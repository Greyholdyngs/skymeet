import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectsService } from '../projects/projects.service.js';
import { ProjectMembersService } from '../project-members/project-members.service.js';
import { Task, TaskDocument, TaskReviewDecision, TaskStatus } from './schema/task.schema.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { ReviewTaskDto } from './dto/review-task.dto.js';

import { ActivityService } from '../activity/activity.service.js';
import { ActivityAction, ActivityEntityType } from '../activity/activity.types.js';
import { Sprint, SprintDocument } from '../sprints/schemas/sprint.schema.js';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name)
        private readonly taskModel: Model<TaskDocument>,

        @InjectModel(Sprint.name)
        private readonly sprintModel: Model<SprintDocument>,

        private readonly projectsService: ProjectsService,
        private readonly projectMembersService: ProjectMembersService,
        private readonly activityService: ActivityService,
    ) {}

    private readonly logger = new Logger(TaskService.name);

    private toObjectId(id: string): Types.ObjectId {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Resource not found');
        }

        return new Types.ObjectId(id);
    }

    private async getAccessibleProject( projectId: Types.ObjectId, userId: Types.ObjectId ) {
        const project = await this.projectsService.findAccessibleById( projectId,userId );

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    private async assertProjectPeople( projectId: Types.ObjectId, ownerId: Types.ObjectId, userIds: string[] ): Promise<void> {
        const uniqueIds = [...new Set(userIds)];

        for (const id of uniqueIds) {
            if (!Types.ObjectId.isValid(id)) {
                throw new BadRequestException( 'One or more assigned users are invalid' );
            }
        }

        const memberIds = await this.projectMembersService.findMemberIds(projectId);

        const allowedIds = new Set([ 
            ownerId.toString(),
            ...memberIds.map((id) => id.toString()),
        ]);

        if (uniqueIds.some((id) => !allowedIds.has(id))) {
            throw new BadRequestException( 'Assignees and reviewers must belong to this project' );
        }
    }

    private async validateSprintAssignment( projectId: Types.ObjectId, sprintId?: string | null ): Promise<Types.ObjectId | null> {
        if (!sprintId) {
            return null;
        }

        if (!Types.ObjectId.isValid(sprintId)) {
            throw new BadRequestException('Invalid sprint ID.');
        }

        const sprintObjectId = new Types.ObjectId(sprintId);
        const sprintExists = await this.sprintModel.exists({
            _id: sprintObjectId,
            projectId,
        });

        if (!sprintExists) {
            throw new BadRequestException('The selected sprint does not belong to this project.',);
        }

        return sprintObjectId;
    }

    private async getTaskForProject( projectId: string, taskId: string, userId: Types.ObjectId
        ): Promise<{ task: TaskDocument; ownerId: Types.ObjectId }> {
        const projectObjectId = this.toObjectId(projectId);
        const taskObjectId = this.toObjectId(taskId);

        const project = await this.getAccessibleProject( projectObjectId, userId, );
        const task = await this.taskModel.findOne({_id: taskObjectId, projectId: projectObjectId }).exec();

        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return { task, ownerId: project.ownerId };
    }

    async startTask( projectId: string, taskId: string, userId: Types.ObjectId ) {
        const { task, ownerId } = await this.getTaskForProject( projectId, taskId, userId );
        const isOwner = ownerId.equals(userId);

        const isAssignee = task.assigneeIds.some( (assigneeId) => assigneeId.equals(userId), );
        if (!isOwner && !isAssignee) {
            throw new ForbiddenException( 'Only an assignee or the project owner can start this task', );
        }

        if (task.status !== TaskStatus.TODO) {
            throw new BadRequestException( 'Only TODO tasks can be started', );
        }
        const previousStatus = task.status;
        task.status = TaskStatus.IN_PROGRESS;

        const updatedTask = await task.save();

        await this.logTaskActivity({
            projectId: task.projectId,
            actorId: userId,
            taskId: updatedTask._id,
            action: ActivityAction.TASK_STARTED,
            title: updatedTask.title,
            fromStatus: previousStatus,
            toStatus: updatedTask.status,
        });

        return updatedTask;
    }

    async submitForReview( projectId: string, taskId: string, userId: Types.ObjectId ) {
        const { task, ownerId } = await this.getTaskForProject( projectId, taskId, userId );

        const isOwner = ownerId.equals(userId);
        const isAssignee = task.assigneeIds.some( (assigneeId) => assigneeId.equals(userId), );

        if (!isOwner && !isAssignee) {
            throw new ForbiddenException( 'Only an assignee or the project owner can submit this task for review' );
        }

        if (task.status !== TaskStatus.IN_PROGRESS) {
            throw new BadRequestException( 'Only IN_PROGRESS tasks can be submitted for review' );
        }
        if (!task.reviewerId) {
            throw new BadRequestException( 'Assign a reviewer before submitting this task' );
        }

        const previousStatus = task.status;
        task.status = TaskStatus.TASK_REVIEW;

        const updatedTask = await task.save();

        await this.logTaskActivity({
            projectId: task.projectId,
            actorId: userId,
            taskId: updatedTask._id,
            action: ActivityAction.TASK_SUBMITTED_FOR_REVIEW,
            title: updatedTask.title,
            fromStatus: previousStatus,
            toStatus: updatedTask.status,
        });

        return updatedTask;
    }

    async reviewTask( projectId: string, taskId: string, userId: Types.ObjectId, dto: ReviewTaskDto ) {
        const { task, ownerId } = await this.getTaskForProject( projectId, taskId, userId );

        const isOwner = ownerId.equals(userId);
        const isAssignedReviewer = task.reviewerId?.equals(userId) ?? false;

        if (!isOwner && !isAssignedReviewer) {
            throw new ForbiddenException( 'Only the assigned reviewer or project owner can review this task' );
        }

        if (task.status !== TaskStatus.TASK_REVIEW) {
            throw new BadRequestException( 'Only tasks awaiting review can be reviewed' );
        }

        if ( dto.decision === TaskReviewDecision.CHANGES_REQUESTED && !dto.comment?.trim() ) {
            throw new BadRequestException( 'A comment is required when requesting changes' );
        }

        task.reviewHistory.push({
            reviewerId: userId,
            decision: dto.decision,
            comment: dto.decision === TaskReviewDecision.CHANGES_REQUESTED ? dto.comment.trim() : dto.approvalComment?.trim() ?? '',
            reviewedAt: new Date(),
        });

        const previousStatus = task.status;
        task.status = dto.decision === TaskReviewDecision.APPROVED ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS;

        const updatedTask = await task.save();

        await this.logTaskActivity({
            projectId: task.projectId,
            actorId: userId,
            taskId: updatedTask._id,
            action: ActivityAction.TASK_REVIEWED,
            title: updatedTask.title,
            fromStatus: previousStatus,
            toStatus: updatedTask.status,
            reviewDecision: dto.decision,
        });

        return updatedTask;
    }

    async create( projectId: string, userId: Types.ObjectId, dto: CreateTaskDto ) {
        const projectObjectId = this.toObjectId(projectId);
        const project = await this.getAccessibleProject( projectObjectId, userId );

        const assigneeIds = dto.assigneeIds ?? [];
        const reviewerIds = dto.reviewerId ? [dto.reviewerId] : [];

        const sprintId = await this.validateSprintAssignment( projectObjectId, dto.sprintId);

        await this.assertProjectPeople(
            projectObjectId,
            project.ownerId,
            [...assigneeIds, ...reviewerIds],
        );
        
        const task = await this.taskModel.create({
            projectId: projectObjectId,
            sprintId,
            title: dto.title,
            description: dto.description ?? '',
            priority: dto.priority,
            assigneeIds: assigneeIds.map( (id) => new Types.ObjectId(id) ),
            reviewerId: dto.reviewerId ? new Types.ObjectId(dto.reviewerId) : null,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            createdBy: userId,
        });

        await this.logTaskActivity({
            projectId: projectObjectId,
            actorId: userId,
            taskId: task._id,
            action: ActivityAction.TASK_CREATED,
            title: task.title,
            toStatus: task.status,
        });

        return task;

    }

    async findByProject( projectId: string, userId: Types.ObjectId ) {
        const projectObjectId = this.toObjectId(projectId);
        await this.getAccessibleProject(projectObjectId, userId);

        return this.taskModel.find({ projectId: projectObjectId }).populate('assigneeIds', 'userName').populate('reviewerId', 'userName').sort({ createdAt: -1 }).exec();
    }

    async update( projectId: string, taskId: string, userId: Types.ObjectId, dto: UpdateTaskDto ) {
        const projectObjectId = this.toObjectId(projectId);
        const taskObjectId = this.toObjectId(taskId);

        const project = await this.getAccessibleProject( projectObjectId, userId );
        const task = await this.taskModel.findOne({ _id: taskObjectId, projectId: projectObjectId }).exec();

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        const previousTitle = task.title;
        const previousStatus = task.status;

        const isOwner = project.ownerId.equals(userId);
        const isCreator = task.createdBy.equals(userId);

        if (!isOwner && !isCreator) {
            throw new ForbiddenException( 'You cannot edit this task' );
        }

        const assigneeIds = dto.assigneeIds ?? task.assigneeIds.map((id) => id.toString());
        const reviewerId = dto.reviewerId === undefined ? task.reviewerId?.toString() : dto.reviewerId;

        await this.assertProjectPeople(
            projectObjectId,
            project.ownerId,
            [
                ...assigneeIds,
                ...(reviewerId ? [reviewerId] : []),
            ],
        );

        const sprintId = dto.sprintId !== undefined ? await this.validateSprintAssignment(
                         projectObjectId, dto.sprintId ) : task.sprintId;

        if (dto.title !== undefined) task.title = dto.title;
        if (dto.description !== undefined) task.description = dto.description;
        if (dto.priority !== undefined) task.priority = dto.priority;

        if (dto.sprintId !== undefined) {
             task.sprintId = sprintId;
        }

        if (dto.assigneeIds !== undefined) {
            task.assigneeIds = dto.assigneeIds.map( (id) => new Types.ObjectId(id) );
        }

        if (dto.reviewerId !== undefined) {
            task.reviewerId = dto.reviewerId ? new Types.ObjectId(dto.reviewerId) : null;
        }

        if (dto.dueDate !== undefined) {
            task.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
        }
        const updatedTask = await task.save();

        await this.logTaskActivity({
            projectId: projectObjectId,
            actorId: userId,
            taskId: updatedTask._id,
            action: ActivityAction.TASK_UPDATED,
            title: updatedTask.title,
            fromStatus: previousStatus,
            toStatus: updatedTask.status,
        });

        return updatedTask;
    }

    async delete( projectId: string, taskId: string, userId: Types.ObjectId ) {
        const projectObjectId = this.toObjectId(projectId);
        const taskObjectId = this.toObjectId(taskId);

        const project = await this.getAccessibleProject( projectObjectId, userId, );
        const task = await this.taskModel.findOne({ _id: taskObjectId, projectId: projectObjectId }).exec();

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        if (!project.ownerId.equals(userId)) {
            throw new ForbiddenException('Only the project owner can delete tasks' );
        }

        await task.deleteOne();
        await this.logTaskActivity({
            projectId: projectObjectId,
            actorId: userId,
            taskId: task._id,
            action: ActivityAction.TASK_DELETED,
            title: task.title,
            fromStatus: task.status,
        });

        return { message: 'Task deleted successfully' };
    }

    async getDashboardData(userId: Types.ObjectId) {
        const now = new Date();
        const activeTasksFilter = { assigneeIds: userId, status: { $ne: TaskStatus.COMPLETED } };

        const [myTasksCount, myTasks, overdueTasks, upcomingTask] =
            await Promise.all([
                this.taskModel.countDocuments(activeTasksFilter).exec(),

                this.taskModel.find(activeTasksFilter).populate('projectId', 'name').sort({ dueDate: 1, createdAt: -1 }).limit(5).exec(),
                this.taskModel.countDocuments({ ...activeTasksFilter, dueDate: { $lt: now }, }).exec(),

                this.taskModel.findOne({
                        ...activeTasksFilter,
                        dueDate: { $gte: now },
                    }).sort({ dueDate: 1 }).select('title dueDate projectId priority status').populate('projectId', 'name').exec(),
            ]);

        return {
            myTasksCount,
            myTasks,
            overdueTasks,
            upcomingDeadline: upcomingTask ? {
                    taskId: upcomingTask._id,
                    title: upcomingTask.title,
                    dueDate: upcomingTask.dueDate,
                    project: upcomingTask.projectId,
                } : null,
        };
    }

    private async logTaskActivity(input: { projectId: Types.ObjectId; actorId: Types.ObjectId; taskId: Types.ObjectId;
        action: ActivityAction; title: string; fromStatus?: string | null; toStatus?: string | null;
        reviewDecision?: string | null; }): Promise<void> {

        try {
            await this.activityService.record({
                projectId: input.projectId,
                actorId: input.actorId,
                entityType: ActivityEntityType.TASK,
                entityId: input.taskId,
                action: input.action,
                entityTitle: input.title,
                fromStatus: input.fromStatus ?? null,
                toStatus: input.toStatus ?? null,
                reviewDecision: input.reviewDecision ?? null,
            });
        } catch (error) {
            this.logger.error( `Failed to record activity for task ${input.taskId}`, error instanceof Error ? error.stack : String(error) );
        }
    }


}
