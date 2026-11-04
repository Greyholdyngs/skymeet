import { Ack, ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer,
        OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

import { Types } from 'mongoose';
import { CommentsService } from './comment.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

import { ProjectMembersService } from '../project-members/project-members.service.js';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateCommentDto } from './dto/update-comment.dto.js';

interface AuthenticatedSocket extends Socket {
    data: { userId: string; };
}

interface DiscussionPayload {
    projectId: string;
    taskId?: string | null;
}

interface CreateCommentPayload extends DiscussionPayload {
    parentCommentId?: string | null;
    content: string;
}

interface SocketAck {
    success: boolean;
    data?: unknown;
    error?: string;
}

interface UpdateCommentPayload {
    projectId: string;
    commentId: string;
    content: string;
}

interface DeleteCommentPayload {
    projectId: string;
    commentId: string;
}

@WebSocketGateway({
    namespace: '/comments',
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
})

export class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly jwtService: JwtService,
        private readonly commentsService: CommentsService,
        private readonly projectMembersService: ProjectMembersService,
    ) {}

    private getDiscussionRoom( projectId: string, taskId?: string | null ): string {
        if (taskId) {
            return `project:${projectId}:task:${taskId}`;
        }

        return `project:${projectId}:discussion`;
    }

    async handleConnection(client: AuthenticatedSocket): Promise<void> {
        try {
            const authToken = client.handshake.auth?.token;
            const authorization = client.handshake.headers.authorization;

            const token = typeof authToken === 'string' ? authToken : authorization?.startsWith('Bearer ')
                         ? authorization.slice(7) : null;

            if (!token) {
                client.disconnect(true);
                return;
            }

            const payload = await this.jwtService.verifyAsync<{ sub: string; }>(token);
            if (!Types.ObjectId.isValid(payload.sub)) {
                client.disconnect(true);
                return;
            }

            client.data.userId = payload.sub;
        } catch {
            client.disconnect(true);
        }
    }

    handleDisconnect(client: AuthenticatedSocket): void {
    }

    @SubscribeMessage('discussion:join')
    async handleJoinDiscussion( @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() payload: DiscussionPayload,
                                @Ack() ack: (response: SocketAck) => void ): Promise<void> {

        console.log('DISCUSSION JOIN PAYLOAD:', payload);
        console.log('PROJECT ID:', payload?.projectId);
        console.log('PROJECT ID TYPE:', typeof payload?.projectId);
        console.log(
            'IS VALID OBJECT ID:',
            Types.ObjectId.isValid(payload?.projectId),
        );
        try {
            if (!Types.ObjectId.isValid(payload?.projectId)) {
                ack({ success: false, error: 'Invalid project ID' });
                return;
            }

            if ( payload.taskId && !Types.ObjectId.isValid(payload.taskId) ) {
                ack({ success: false, error: 'Invalid task ID' });
                return;
            }

            const projectId = new Types.ObjectId(payload.projectId);
            const userId = new Types.ObjectId(client.data.userId);

            const hasAccess = await this.projectMembersService.canAccessProject( projectId, userId );

            if (!hasAccess) {
                ack({ success: false, error: 'Project not found' });
                return;
            }

            if (payload.taskId) {
                const taskExists = await this.commentsService.validateDiscussionTask( payload.projectId, payload.taskId);

                if (!taskExists) {
                    ack({ success: false, error: 'Task not found' });
                    return;
                }
            }

            const room = this.getDiscussionRoom( payload.projectId, payload.taskId );
            await client.join(room);

            ack({ success: true, data: { room } });
        } catch {
            ack({ success: false, error: 'Unable to join discussion' });
        }
    }

    @SubscribeMessage('discussion:leave')
    async handleLeaveDiscussion( @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() payload: DiscussionPayload,
                                @Ack() ack: (response: SocketAck) => void ): Promise<void> {

        if (!Types.ObjectId.isValid(payload?.projectId)) {
            ack({ success: false, error: 'Invalid project ID' });
            return;
        }

        if ( payload.taskId && !Types.ObjectId.isValid(payload.taskId) ) {
            ack({ success: false, error: 'Invalid task ID' });
            return;
        }

        const room = this.getDiscussionRoom( payload.projectId, payload.taskId);
        await client.leave(room);

        ack({ success: true });
    }

    @SubscribeMessage('comment:create')
    async handleCreateComment( @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() payload: CreateCommentPayload,
                                @Ack() ack: (response: SocketAck) => void ): Promise<void> {
        try {
            if (!Types.ObjectId.isValid(payload?.projectId)) {
                ack({ success: false, error: 'Invalid project ID' });
                return;
            }

            if ( payload.taskId && !Types.ObjectId.isValid(payload.taskId) ) {
                ack({ success: false, error: 'Invalid task ID' });
                return;
            }

            const dto = plainToInstance(CreateCommentDto, {
                taskId: payload.taskId,
                parentCommentId: payload.parentCommentId,
                content: payload.content,
            });

            const errors = await validate(dto);

            if (errors.length > 0) {
                ack({ success: false, error: 'Invalid comment payload' });
                return;
            }

            const comment = await this.commentsService.createComment(
                payload.projectId,
                client.data.userId,
                dto,
            );

            const room = this.getDiscussionRoom( payload.projectId, payload.taskId );
            this.server.to(room).emit('comment:new', comment);

            ack({ success: true, data: comment });
        } catch (error) {
            ack({
                success: false,
                error: error instanceof Error ? error.message : 'Unable to create comment',
            });
        }
    }

    @SubscribeMessage('comment:update')
    async handleUpdateComment( @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() payload: UpdateCommentPayload,
                                @Ack() ack: (response: SocketAck) => void ): Promise<void> {
        try {
            if (!Types.ObjectId.isValid(payload?.projectId)) {
                ack({ success: false, error: 'Invalid project ID' });
                return;
            }

            if (!Types.ObjectId.isValid(payload?.commentId)) {
                ack({ success: false, error: 'Invalid comment ID' });
                return;
            }

            const dto = plainToInstance(UpdateCommentDto, { content: payload.content });
            const errors = await validate(dto);

            if (errors.length > 0) {
                ack({ success: false, error: 'Invalid comment content' });
                return;
            }

            const comment = await this.commentsService.updateComment(
                payload.projectId,
                payload.commentId,
                client.data.userId,
                dto,
            );

            if (!comment) {
                ack({ success: false, error: 'Comment not found' });
                return;
            }

            const room = this.getDiscussionRoom( payload.projectId, comment.taskId?.toString() );
            this.server.to(room).emit('comment:updated', comment);

            ack({ success: true, data: comment });
        } catch (error) {
            ack({
                success: false,
                error: error instanceof Error ? error.message : 'Unable to update comment',
            });
        }
    }

    @SubscribeMessage('comment:delete')
    async handleDeleteComment( @ConnectedSocket() client: AuthenticatedSocket, @MessageBody() payload: DeleteCommentPayload,
                             @Ack() ack: (response: SocketAck) => void ): Promise<void> {
        try {
            if (!Types.ObjectId.isValid(payload?.projectId)) {
                ack({ success: false, error: 'Invalid project ID' });
                return;
            }

            if (!Types.ObjectId.isValid(payload?.commentId)) {
                ack({ success: false, error: 'Invalid comment ID' });
                return;
            }

            const comment = await this.commentsService.deleteComment(
                payload.projectId,
                payload.commentId,
                client.data.userId,
            );

            if (!comment) {
                ack({ success: false, error: 'Comment not found' });
                return;
            }

            const room = this.getDiscussionRoom( payload.projectId, comment.taskId?.toString() );
            this.server.to(room).emit('comment:deleted', comment);

            ack({ success: true, data: comment });
        } catch (error) {
            ack({
                success: false,
                error: error instanceof Error ? error.message : 'Unable to delete comment',
            });
        }
    }

}
