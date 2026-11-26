import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Comment, CommentDocument } from './schemas/comment.schema.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

import { ProjectMembersService } from '../project-members/project-members.service.js';
import { Task } from '../tasks/schema/task.schema.js';
import { NotificationService } from '../notifications/notification.service.js';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<CommentDocument>,

        @InjectModel(Task.name)
        private readonly taskModel: Model<Task>,

        private readonly projectMembersService: ProjectMembersService,
        private readonly notificationService: NotificationService,
    ) {}

    private toObjectId(id: string): Types.ObjectId {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Resource not found');
        }

        return new Types.ObjectId(id);
    }

    private async assertProjectAccess( projectId: Types.ObjectId, userId: string ): Promise<void> {
        const hasAccess = await this.projectMembersService.canAccessProject(
            projectId,
            this.toObjectId(userId),
        );

        if (!hasAccess) {
            throw new NotFoundException('Project not found');
        }
    }

    private async assertCommentVisible( comment: CommentDocument, projectId: Types.ObjectId, userId: string, ): Promise<void> {
        const access = await this.projectMembersService.canViewHistoricalChat( projectId, this.toObjectId(userId),);

        if ( !access.allowed && access.joinedAt && comment.createdAt < access.joinedAt ) {
            throw new NotFoundException('Comment not found');
        }
    }

    private async validateTask( projectId: Types.ObjectId, taskId: string ): Promise<Types.ObjectId> {
        const taskObjectId = this.toObjectId(taskId);
        const task = await this.taskModel.findOne({
            _id: taskObjectId,
            projectId,
        });

        if (!task) {
            throw new NotFoundException( 'Task not found in this project' );
        }

        return taskObjectId;
    }

    private async populateAuthor(commentId: Types.ObjectId) {
        return this.commentModel.findById(commentId).populate('authorId', 'firstName lastName userName').exec();
    }

    async createComment( projectId: string, userId: string, dto: CreateCommentDto ) {
        const projectObjectId = this.toObjectId(projectId);
        const authorObjectId = this.toObjectId(userId);

        await this.assertProjectAccess(projectObjectId, userId);

        const taskObjectId = dto.taskId ? await this.validateTask(projectObjectId, dto.taskId) : null;
        let parentCommentId: Types.ObjectId | null = null;

        if (dto.parentCommentId) {
            parentCommentId = this.toObjectId(dto.parentCommentId);

            const parentComment = await this.commentModel.findOne({
                _id: parentCommentId,
                projectId: projectObjectId,
                taskId: taskObjectId,
                deletedAt: null,
            });

            if (!parentComment) {
                throw new NotFoundException( 'Parent comment not found in this discussion' );
            }
            await this.assertCommentVisible( parentComment, projectObjectId, userId, );

        }
        const comment = await this.commentModel.create({
            projectId: projectObjectId,
            taskId: taskObjectId,
            authorId: authorObjectId,
            parentCommentId,
            ciphertext: dto.ciphertext,
        });

        const recipientIds = parentCommentId ? await this.commentModel.findById(parentCommentId).distinct('authorId')
                                             : await this.projectMembersService.findMemberIds(projectObjectId);

        const uniqueRecipients = [
            ...new Map(recipientIds.filter((id) => !id.equals(authorObjectId)).map((id) => [id.toString(), id]),).values(),
        ];

        if (uniqueRecipients.length) {
            await this.notificationService.createMany(
                uniqueRecipients.map((recipientId) => ({
                    recipientId,
                    actorId: authorObjectId,
                    type: parentCommentId  ? 'comment_reply' as const : 'comment_added' as const,
                    title: parentCommentId ? 'New reply' : 'New comment',
                    message: parentCommentId ? 'Someone replied to a comment in a project discussion'
                                             : 'A new comment was added to a project discussion',
                    resourceType: 'comment' as const,
                    resourceId: comment._id,
                })),
            );
        }

        return this.populateAuthor(comment._id);
    }

    async validateDiscussionTask( projectId: string, taskId: string ): Promise<boolean> {
        const projectObjectId = this.toObjectId(projectId);

        await this.validateTask(projectObjectId, taskId);

        return true;
    }

    async findDiscussion( projectId: string, userId: string, taskId?: string, page = 1, limit = 20 ) {
        const projectObjectId = this.toObjectId(projectId);
        const userObjectId = this.toObjectId(userId);

        await this.assertProjectAccess(projectObjectId, userId);

        const taskObjectId = taskId ? await this.validateTask(projectObjectId, taskId) : null;

        const historyAccess = await this.projectMembersService.canViewHistoricalChat(
            projectObjectId,
            userObjectId,
        );

        const discussionFilter: Record<string, unknown> = {
            projectId: projectObjectId,
            taskId: taskObjectId,
        };

        if (!historyAccess.allowed && historyAccess.joinedAt) {
            discussionFilter.createdAt = { $gte: historyAccess.joinedAt };
        }

        const rootFilter = { ...discussionFilter, parentCommentId: null, };

        const [rootComments, total] = await Promise.all([
            this.commentModel.find(rootFilter).populate('authorId', 'firstName lastName userName')
                             .sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).exec(),

            this.commentModel.countDocuments(rootFilter),
        ]);

        const allComments: CommentDocument[] = [...rootComments];
        let parentIds = rootComments.map((comment) => comment._id);

        while (parentIds.length > 0) {
            const children = await this.commentModel.find({
                    ...discussionFilter,
                    parentCommentId: { $in: parentIds },
                }).populate('authorId', 'firstName lastName userName').sort({ createdAt: 1, _id: 1 }).exec();

            allComments.push(...children);
            parentIds = children.map((comment) => comment._id);
        }

        const commentMap = new Map<string, Record<string, any>>();

        for (const comment of allComments) {
            commentMap.set(comment._id.toString(), {
                ...comment.toObject(),
                replies: [],
            });
        }

        const data: Record<string, any>[] = [];

        for (const comment of allComments) {
            const node = commentMap.get(comment._id.toString())!;
            const parentId = comment.parentCommentId?.toString();

            if (parentId) {
                const parent = commentMap.get(parentId);

                if (parent) {
                    parent.replies.push(node);
                }
            } else {
                data.push(node);
            }
        }

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }


    async updateComment( projectId: string, commentId: string, userId: string, dto: UpdateCommentDto ) {
        const projectObjectId = this.toObjectId(projectId);
        const commentObjectId = this.toObjectId(commentId);

        await this.assertProjectAccess(projectObjectId, userId);
        const comment = await this.commentModel.findOne({
            _id: commentObjectId,
            projectId: projectObjectId,
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        await this.assertCommentVisible( comment, projectObjectId, userId, );

        if (comment.authorId?.toString() !== userId) {
            throw new ForbiddenException( 'You can only edit your own comments', );
        }

        if (comment.deletedAt) {
            throw new BadRequestException( 'Deleted comments cannot be edited' );
        }

        comment.ciphertext = dto.ciphertext;
        comment.editedAt = new Date();

        await comment.save();

        return this.populateAuthor(comment._id);
    }

    async deleteComment( projectId: string, commentId: string, userId: string ) {
        const projectObjectId = this.toObjectId(projectId);
        const commentObjectId = this.toObjectId(commentId);

        await this.assertProjectAccess(projectObjectId, userId);
        const comment = await this.commentModel.findOne({
            _id: commentObjectId,
            projectId: projectObjectId,
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.authorId?.toString() !== userId) {
            throw new ForbiddenException( 'You can only delete your own comments' );
        }

        if (comment.deletedAt) {
            throw new BadRequestException( 'Comment has already been deleted' );
        }

        comment.deletedAt = new Date();
        comment.deletedAt = new Date();

        await comment.save();

        return this.populateAuthor(comment._id);
    }
}
