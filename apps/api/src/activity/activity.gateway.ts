import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Server, Socket } from 'socket.io';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema.js';

import { ProjectMembersService } from '../project-members/project-members.service.js';

interface AuthenticatedSocket extends Socket {
    data: {
        userId: string;
    };
}

@WebSocketGateway({
    namespace: '/activity',
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
})

export class ActivityGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly jwtService: JwtService,
        private readonly projectMembersService: ProjectMembersService,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async handleConnection(client: AuthenticatedSocket): Promise<void> {
        try {
            const authToken = client.handshake.auth?.token;
            const authorization = client.handshake.headers.authorization;

            const token =  typeof authToken === 'string' ? authToken : authorization?.startsWith('Bearer ')
                                                         ? authorization.slice(7) : null;

            if (!token) {
                client.disconnect(true);
                return;
            }
            const payload = await this.jwtService.verifyAsync<{ sub: string; tokenVersion?: number;}>(token);

            if (!Types.ObjectId.isValid(payload.sub)) {
                client.disconnect(true);
                return;
            }
            const user = await this.userModel.findById(payload.sub).select('tokenVersion').lean().exec();

            if ( !user || (payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0) ) {
                client.disconnect(true);
                return;
            }

            client.data.userId = payload.sub;
            await client.join(`user:${payload.sub}`);
        } catch {
            client.disconnect(true);
        }
    }

    async emitActivity( projectId: string, activity: unknown ): Promise<void> {
        const memberIds = await this.projectMembersService.findMemberIds( new Types.ObjectId(projectId) );

        for (const memberId of memberIds) {
            this.server.to(`user:${memberId.toString()}`).emit('activity:new', activity);
        }
    }
}
