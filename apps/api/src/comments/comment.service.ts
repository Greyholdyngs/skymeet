import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Comment, CommentDocument } from './schemas/comment.schema.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

import { ProjectMembersService } from '../project-members/project-members.service.js';
import { Task } from '../tasks/schema/task.schema.js';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<CommentDocument>,

        @InjectModel(Task.name)
        private readonly taskModel: Model<Task>,

        private readonly projectMembersService: ProjectMembersService,
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
                parentCommentId: null,
            });

            if (!parentComment) {
                throw new NotFoundException( 'Parent comment not found in this discussion' );
            }
        }

        const comment = await this.commentModel.create({
            projectId: projectObjectId,
            taskId: taskObjectId,
            authorId: authorObjectId,
            parentCommentId,
            ciphertext: dto.ciphertext,
        });

        return this.populateAuthor(comment._id);
    }
    
    async findDiscussion( projectId: string, userId: string, taskId?: string, page = 1, limit = 20 ) {
        const projectObjectId = this.toObjectId(projectId);
        await this.assertProjectAccess(projectObjectId, userId);

        const taskObjectId = taskId ? await this.validateTask(projectObjectId, taskId) : null;

        const discussionFilter = {
            projectId: projectObjectId,
            taskId: taskObjectId,
            parentCommentId: null,
        };

        const [comments, total] = await Promise.all([
            this.commentModel.find(discussionFilter).populate('authorId', 'firstName lastName userName').sort(
                { createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).exec(),

            this.commentModel.countDocuments(discussionFilter),
        ]);

        const commentIds = comments.map((comment) => comment._id);
        const replies = commentIds.length ? await this.commentModel.find({
                    projectId: projectObjectId,
                    taskId: taskObjectId,
                    parentCommentId: { $in: commentIds },
                }).populate('authorId', 'firstName lastName userName').sort({ createdAt: 1, _id: 1 }).exec() : [];

        const repliesByParent = new Map<string, typeof replies>();

        for (const reply of replies) {
            const parentId = reply.parentCommentId!.toString();
            const existingReplies = repliesByParent.get(parentId) ?? [];

            existingReplies.push(reply);
            repliesByParent.set(parentId, existingReplies);
        }

        const data = comments.map((comment) => ({
            ...comment.toObject(),
            replies: (repliesByParent.get(comment._id.toString()) ?? []).map((reply) => reply.toObject() ),
        }));

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

        if (comment.authorId.toString() !== userId) {
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

        if (comment.authorId.toString() !== userId) {
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

    async validateDiscussionTask( projectId: string, taskId: string ): Promise<boolean> {
        const projectObjectId = this.toObjectId(projectId);

        await this.validateTask(projectObjectId, taskId);

        return true;
    }
}
