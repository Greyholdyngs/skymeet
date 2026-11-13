import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Sprint, SprintDocument, SprintStatus } from './schemas/sprint.schema.js';
import { CreateSprintDto } from './dto/create-sprint.dto.js';
import { ProjectMembersService } from '../project-members/project-members.service.js';

import { ProjectMemberRole } from '../project-members/schemas/project-member.schema.js';
import { UpdateSprintDto } from './dto/update-sprint.dto.js';
import { Task, TaskDocument } from '../tasks/schema/task.schema.js';

import { ActivityService } from '../activity/activity.service.js';
import { ActivityAction, ActivityEntityType } from '../activity/activity.types.js';

@Injectable()
export class SprintsService {
    constructor(
        @InjectModel(Sprint.name)
        private readonly sprintModel: Model<SprintDocument>,

        @InjectModel(Task.name)
        private readonly taskModel: Model<TaskDocument>,

        private readonly projectMembersService: ProjectMembersService,
        private readonly activityService: ActivityService,

    ) {}

    async createSprint( projectId: string, userId: string, dto: CreateSprintDto) {
        if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(userId) ) {
            throw new NotFoundException('Project not found.');
        }

        const projectObjectId = new Types.ObjectId(projectId);
        const userObjectId = new Types.ObjectId(userId);

        const role = await this.projectMembersService.getRoleInProject( projectObjectId, userObjectId, );

        if (!role) {
            throw new NotFoundException('Project not found.');
        }

        if ( role !== ProjectMemberRole.OWNER && role !== ProjectMemberRole.ADMIN ) {
            throw new ForbiddenException( 'Only project owners and admins can create sprints.', );
        }

        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);

        if ( Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate ) {
            throw new BadRequestException( 'Sprint end date must be later than its start date.' );
        }

        const sprint = await this.sprintModel.create({
            projectId: projectObjectId,
            name: dto.name,
            description: dto.description ?? '',
            startDate,
            endDate,
            status: SprintStatus.PLANNED,
            createdBy: userObjectId,
        });

        await this.activityService.record({
            projectId: projectObjectId,
            actorId: userObjectId,
            entityType: ActivityEntityType.SPRINT,
            entityId: sprint._id,
            action: ActivityAction.SPRINT_CREATED,
            entityTitle: sprint.name,
        });

        return {
            message: 'Sprint created successfully.',
            sprint,
        };
    }

    async findProjectSprints(projectId: string, userId: string) {
        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(userId) ) {
            throw new NotFoundException('Project not found.');
        }

        const projectObjectId = new Types.ObjectId(projectId);
        const userObjectId = new Types.ObjectId(userId);
        const hasAccess = await this.projectMembersService.canAccessProject( projectObjectId, userObjectId );

        if (!hasAccess) {
            throw new NotFoundException('Project not found.');
        }

        const sprints = await this.sprintModel.find({ projectId: projectObjectId }).sort({ startDate: 1 }).exec();

        return {
            sprints,
        };
    }

    async updateSprint( projectId: string, sprintId: string, userId: string, dto: UpdateSprintDto ) {
        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(sprintId) || !Types.ObjectId.isValid(userId) ) {
            throw new NotFoundException('Sprint not found.');
        }

        const projectObjectId = new Types.ObjectId(projectId);
        const sprintObjectId = new Types.ObjectId(sprintId);
        const userObjectId = new Types.ObjectId(userId);

        const role = await this.projectMembersService.getRoleInProject( projectObjectId, userObjectId );

        if (!role) {
            throw new NotFoundException('Project not found.');
        }

        if ( role !== ProjectMemberRole.OWNER && role !== ProjectMemberRole.ADMIN ) {
            throw new ForbiddenException( 'Only project owners and admins can update sprints.' );
        }

        const sprint = await this.sprintModel.findOne({
            _id: sprintObjectId,
            projectId: projectObjectId,
        }).exec();

        if (!sprint) {
            throw new NotFoundException('Sprint not found.');
        }

        const startDate = dto.startDate !== undefined ? new Date(dto.startDate) : sprint.startDate;
        const endDate = dto.endDate !== undefined ? new Date(dto.endDate) : sprint.endDate;

        if ( Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate ) {
            throw new BadRequestException( 'Sprint end date must be later than its start date.' );
        }

        if (dto.name !== undefined) {
            sprint.name = dto.name;
        }

        if (dto.description !== undefined) {
            sprint.description = dto.description;
        }

        sprint.startDate = startDate;
        sprint.endDate = endDate;

        if (dto.status !== undefined) {
            sprint.status = dto.status;
        }

        await sprint.save();

        await this.activityService.record({
            projectId: projectObjectId,
            actorId: userObjectId,
            entityType: ActivityEntityType.SPRINT,
            entityId: sprint._id,
            action: ActivityAction.SPRINT_UPDATED,
            entityTitle: sprint.name,
        });

        return {
            message: 'Sprint updated successfully.',
            sprint,
        };
    }

    async deleteSprint( projectId: string, sprintId: string, userId: string ) {
        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(sprintId) || !Types.ObjectId.isValid(userId) ) {
            throw new NotFoundException('Sprint not found.');
        }

        const projectObjectId = new Types.ObjectId(projectId);
        const sprintObjectId = new Types.ObjectId(sprintId);
        const userObjectId = new Types.ObjectId(userId);

        const role = await this.projectMembersService.getRoleInProject( projectObjectId, userObjectId );

        if (!role) {
            throw new NotFoundException('Sprint not found.');
        }

        if ( role !== ProjectMemberRole.OWNER && role !== ProjectMemberRole.ADMIN ) {
            throw new ForbiddenException( 'You do not have permission to delete sprints.' );
        }

        const session = await this.sprintModel.db.startSession();
        let deletedSprintName = '';

        try {
            await session.withTransaction(async () => {
                const sprint = await this.sprintModel.findOne({
                    _id: sprintObjectId,
                    projectId: projectObjectId,
                }).session(session);

                if (!sprint) {
                    throw new NotFoundException('Sprint not found.');
                }

                deletedSprintName = sprint.name;

                await this.taskModel.updateMany(
                    {
                        projectId: projectObjectId,
                        sprintId: sprintObjectId,
                    },
                    {
                        $set: { sprintId: null },
                    },
                    { session },
                );

                await this.sprintModel.deleteOne(
                    {
                        _id: sprintObjectId,
                        projectId: projectObjectId,
                    },
                    { session },
                );
            });
        } finally {
            await session.endSession();
        }

        await this.activityService.record({
            projectId: projectObjectId,
            actorId: userObjectId,
            entityType: ActivityEntityType.SPRINT,
            entityId: sprintObjectId,
            action: ActivityAction.SPRINT_DELETED,
            entityTitle: deletedSprintName,
        });

        return {
            message: 'Sprint deleted successfully.',
        };
    }
}
