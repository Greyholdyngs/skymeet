import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';

import type { Connection } from 'mongoose';
import { Project, ProjectDocument } from './schema/project.schema.js';
import { ProjectMember, ProjectMemberDocument, ProjectMemberRole} from '../project-members/schemas/project-member.schema.js';

import { ActivityService } from '../activity/activity.service.js';
import { ActivityAction, ActivityEntityType } from '../activity/activity.types.js';
import { Task, TaskDocument } from '../tasks/schema/task.schema.js';

import { Sprint, SprintDocument } from '../sprints/schemas/sprint.schema.js';
import { Invitation, InvitationDocument } from '../invitations/schemas/invitation.schema.js';
import { Comment as ProjectComment, CommentDocument } from '../comments/schemas/comment.schema.js';

import { Meeting, MeetingDocument } from '../meetings/schemas/meeting.schema.js';
import { Activity, ActivityDocument } from '../activity/schemas/activity.schema.js';
import { Notification, NotificationDocument } from '../notifications/schemas/notification.schema.js';

@Injectable()
export class ProjectsService {
    private readonly logger = new Logger(ProjectsService.name);

    constructor(
        @InjectModel(Project.name)
        private readonly projectModel: Model<ProjectDocument>,

        @InjectModel(ProjectMember.name)
        private readonly projectMemberModel: Model<ProjectMemberDocument>,

        @InjectModel(Task.name)
        private readonly taskModel: Model<TaskDocument>,

        @InjectModel(Sprint.name)
        private readonly sprintModel: Model<SprintDocument>,

        @InjectModel(Invitation.name)
        private readonly invitationModel: Model<InvitationDocument>,

        @InjectModel(ProjectComment.name)
        private readonly commentModel: Model<CommentDocument>,

        @InjectModel(Meeting.name)
        private readonly meetingModel: Model<MeetingDocument>,

        @InjectModel(Activity.name)
        private readonly activityModel: Model<ActivityDocument>,

        @InjectModel(Notification.name)
        private readonly notificationModel: Model<NotificationDocument>,

        @InjectConnection()
        private readonly connection: Connection,

        private readonly activityService: ActivityService,
    ) {}

    private async logProjectActivity(input: { projectId: Types.ObjectId; actorId: Types.ObjectId; action: ActivityAction;
                                            title: string; }): Promise<void> {
        try {
            await this.activityService.record({
                projectId: input.projectId,
                actorId: input.actorId,
                entityType: ActivityEntityType.PROJECT,
                entityId: input.projectId,
                action: input.action,
                entityTitle: input.title,
                fromStatus: null,
                toStatus: null,
                reviewDecision: null,
            });
        } catch (error) {
            this.logger.error( `Failed to record activity for project ${input.projectId}`,
                error instanceof Error ? error.stack : String(error),
            );
        }
    }

    async create( name: string, description: string, ownerId: Types.ObjectId ): Promise<ProjectDocument> {
        const session = await this.connection.startSession();

        try {
            const result = await session.withTransaction(async () => {
                const [project] = await this.projectModel.create(
                    [{ name, description, ownerId }],
                    { session },
                );

                await this.projectMemberModel.create(
                    [{
                        projectId: project._id,
                        userId: ownerId,
                        role: ProjectMemberRole.OWNER,
                    }],
                    { session },
                );

                return project;
            });

            if (!result) {
                throw new Error('Project creation failed.');
            }

            await this.logProjectActivity({
                projectId: result._id,
                actorId: ownerId,
                action: ActivityAction.PROJECT_CREATED,
                title: result.name,
            });

            return result;
        } finally {
            await session.endSession();
        }
    }

    async findAccessibleToUser(userId: Types.ObjectId) {
        const memberships = await this.projectMemberModel.find({ userId }).select('projectId').lean().exec();

        const memberProjectIds = memberships.map( (membership) => membership.projectId);

        const projects = await this.projectModel.find({
                $or: [
                    { ownerId: userId },
                    { _id: { $in: memberProjectIds } },
                ],
            }).sort({ createdAt: -1 }).lean().exec();

        if (projects.length === 0) {
            return [];
        }

        const memberCounts = await this.projectMemberModel.aggregate<{
                _id: Types.ObjectId;
                count: number;
            }>([
                {
                    $match: {
                        projectId: {
                            $in: projects.map((project) => project._id),
                        },
                    },
                },
                {
                    $group: {
                        _id: '$projectId',
                        count: { $sum: 1 },
                    },
                },
            ]).exec();

        const countByProjectId = new Map(
            memberCounts.map(({ _id, count }) => [
                _id.toString(),
                count,
            ]),
        );

        return projects.map((project) => ({
            ...project,
            membersCount: countByProjectId.get(project._id.toString()) ?? 0,
        }));
    }

    async findAccessibleById( projectId: Types.ObjectId, userId: Types.ObjectId ) {
        const project = await this.projectModel.findById(projectId).exec();

        if (!project) {
            return null;
        }

        if (!project.ownerId.equals(userId)) {
            const membership = await this.projectMemberModel.exists({ projectId, userId }).exec();

            if (!membership) {
                return null;
            }
        }

        const membersCount = await this.projectMemberModel.countDocuments({ projectId }).exec();

        return {
            ...project.toObject(),
            membersCount,
        };
    }

    async update( projectId: Types.ObjectId,  actorId: Types.ObjectId, updates: {
                         name?: string; description?: string; showChatHistoryToNewMembers?: boolean | null; }, ): Promise<ProjectDocument | null> {
        const project = await this.projectModel.findById(projectId).exec();

        if (!project) {
            return null;
        }

        const isOwner = project.ownerId.equals(actorId);

        const updatingProjectDetails = updates.name !== undefined || updates.description !== undefined;

        const updatingChatHistory = updates.showChatHistoryToNewMembers !== undefined;

        if (updatingProjectDetails && !isOwner) {
            throw new ForbiddenException( 'Only the project owner can update project details',);
        }

        if (updatingChatHistory) {
            const membership = await this.projectMemberModel.findOne({ projectId, userId: actorId }).select('role').exec();

            const isAdmin = membership?.role === ProjectMemberRole.ADMIN;

            if (!isOwner && !isAdmin) {
                throw new ForbiddenException( 'Only the project owner or admins can change chat history settings', );
            }
        }

        const updatedProject = await this.projectModel.findOneAndUpdate(
                                {
                                    _id: projectId,
                                    ...(updatingProjectDetails ? { ownerId: actorId } : {}),
                                },
                                { $set: updates },
                                { returnDocument: 'after', runValidators: true },
                            ).exec();

        if (!updatedProject) {
            return null;
        }

        await this.logProjectActivity({
            projectId: updatedProject._id,
            actorId,
            action: ActivityAction.PROJECT_UPDATED,
            title: updatedProject.name,
        });

        return updatedProject;
    }

    async delete( projectId: Types.ObjectId, ownerId: Types.ObjectId, ): Promise<ProjectDocument | null> {
        const session = await this.connection.startSession();

        try {
            const deletedProject = await session.withTransaction(async () => {
                const project = await this.projectModel.findOne({ _id: projectId, ownerId }).session(session).exec();

                if (!project) {
                    return null;
                }

                const tasks = await this.taskModel.find({ projectId }).select('_id').session(session).lean().exec();
                const comments = await this.commentModel.find({ projectId }).select('_id').session(session).lean().exec();
                const meetings = await this.meetingModel.find({ projectId }).select('_id').session(session).lean().exec();

                const notificationFilters: Record<string, unknown>[] = [ { resourceType: 'project', resourceId: projectId }, ];

                if (tasks.length) {
                    notificationFilters.push({
                        resourceType: 'task',
                        resourceId: { $in: tasks.map(task => task._id) },
                    });
                }

                if (comments.length) {
                    notificationFilters.push({
                        resourceType: 'comment',
                        resourceId: { $in: comments.map(comment => comment._id) },
                    });
                }

                if (meetings.length) {
                    notificationFilters.push({
                        resourceType: 'meeting',
                        resourceId: { $in: meetings.map(meeting => meeting._id) },
                    });
                }

                await this.notificationModel.deleteMany({ $or: notificationFilters }).session(session).exec();
                await this.taskModel.deleteMany({ projectId }).session(session).exec();
                await this.sprintModel.deleteMany({ projectId }).session(session).exec();

                await this.invitationModel.deleteMany({ projectId }).session(session).exec();
                await this.commentModel.deleteMany({ projectId }).session(session).exec();
                await this.meetingModel.deleteMany({ projectId }).session(session).exec();

                await this.activityModel.deleteMany({ projectId }).session(session).exec();
                await this.projectMemberModel.deleteMany({ projectId }).session(session).exec();

                return this.projectModel.findOneAndDelete({ _id: projectId, ownerId }).session(session).exec();
            });

            return deletedProject ?? null;
        } finally {
            await session.endSession();
        }
    }
}
