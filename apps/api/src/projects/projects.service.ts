import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Project, ProjectDocument, } from './schema/project.schema.js';
import { ProjectMember, ProjectMemberDocument } from '../project-members/schemas/project-member.schema.js';
import { ActivityService } from '../activity/activity.service.js';

import { ActivityAction, ActivityEntityType } from '../activity/activity.types.js';
@Injectable()
export class ProjectsService {
    private readonly logger = new Logger(ProjectsService.name);

    constructor(
        @InjectModel(Project.name)
        private readonly projectModel: Model<ProjectDocument>,

        @InjectModel(ProjectMember.name)
        private readonly projectMemberModel: Model<ProjectMemberDocument>,

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
            this.logger.error( `Failed to record activity for project ${input.projectId}`, error instanceof Error ? error.stack : String(error) );
        }
    }

    async create( name: string, description: string, ownerId: Types.ObjectId ): Promise<ProjectDocument> {
        const project = new this.projectModel({
            name,
            description,
            ownerId,
        });

        const savedProject = await project.save();
        await this.logProjectActivity({
            projectId: savedProject._id,
            actorId: ownerId,
            action: ActivityAction.PROJECT_CREATED,
            title: savedProject.name,
        });

        return savedProject;
    }

    async findAccessibleToUser(userId: Types.ObjectId) {
        const memberships = await this.projectMemberModel.find({ userId }).select('projectId').lean().exec();
        const memberProjectIds = memberships.map( (membership) => membership.projectId );

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
            count: number; }>([
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
            membersCount: countByProjectId.get( project._id.toString(),) ?? 0,
        }));
    }

    async findAccessibleById( projectId: Types.ObjectId, userId: Types.ObjectId ): Promise<ProjectDocument | null> {
        const project = await this.projectModel.findById(projectId).exec();

        if (!project) {
            return null;
        }

        if (project.ownerId.equals(userId)) {
            return project;
        }

        const membership = await this.projectMemberModel.exists({ projectId, userId }).exec();
        return membership ? project : null;
    }

    async update( projectId: Types.ObjectId, ownerId: Types.ObjectId,
        updates: {
            name?: string;
            description?: string;
        }): Promise<ProjectDocument | null> {

        const existingProject = await this.projectModel.findOne({ _id: projectId, ownerId }).exec();

        if (!existingProject) {
            return null;
        }

        const updatedProject = await this.projectModel.findOneAndUpdate(
                { _id: projectId, ownerId },
                { $set: updates },
                { new: true, runValidators: true },
            ).exec();

        if (!updatedProject) {
            return null;
        }

        await this.logProjectActivity({
            projectId: updatedProject._id,
            actorId: ownerId,
            action: ActivityAction.PROJECT_UPDATED,
            title: updatedProject.name,
        });

        return updatedProject;
    }
    
    async delete( projectId: Types.ObjectId, ownerId: Types.ObjectId ): Promise<ProjectDocument | null> {
        const project = await this.projectModel.findOneAndDelete({ _id: projectId, ownerId }).exec();

        if (!project) {
            return null;
        }

        await this.logProjectActivity({
            projectId: project._id,
            actorId: ownerId,
            action: ActivityAction.PROJECT_DELETED,
            title: project.name,
        });

        const deletedProject = await this.projectModel.findOneAndDelete({ _id: projectId, ownerId }).exec();

        if (!deletedProject) {
            return null;
        }

        await this.projectMemberModel.deleteMany({ projectId }).exec();
        return deletedProject;
    }

}