import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Activity, ActivityDocument } from './schemas/activity.schema.js';
import { ActivityAction, ActivityEntityType } from './activity.types.js';
import { ActivityGateway } from './activity.gateway.js';

interface CreateActivityInput {
    projectId: Types.ObjectId;
    actorId: Types.ObjectId;
    entityType: ActivityEntityType;
    entityId: Types.ObjectId;
    action: ActivityAction;
    entityTitle: string;
    fromStatus?: string | null;
    toStatus?: string | null;
    reviewDecision?: string | null;
}

@Injectable()
export class ActivityService {
    private readonly logger = new Logger(ActivityService.name)
    constructor(
        @InjectModel(Activity.name)
        private readonly activityModel: Model<ActivityDocument>,

        private readonly activityGateway: ActivityGateway,
    ) {}

    async record(input: CreateActivityInput) {
        const activity = await this.activityModel.create(input);

        void this.activityGateway.emitActivity(input.projectId.toString(), activity).catch((error: unknown) => {
                this.logger.error(
                    'Failed to broadcast project activity.',
                    error instanceof Error ? error.stack : String(error),
                );
            });

        return activity;
    }

    async findRecentForProjects(projectIds: Types.ObjectId[], limit = 6) {
        if (projectIds.length === 0) {
            return [];
        }

        return this.activityModel.find({ projectId: { $in: projectIds } }).populate('actorId', 'firstName lastName userName')
                                .populate('projectId', 'name').sort({ createdAt: -1 }).limit(limit).lean().exec();
    }

    async countForProjects(projectIds: Types.ObjectId[]) {
        if (projectIds.length === 0) {
            return 0;
        }

        return this.activityModel.countDocuments({
            projectId: { $in: projectIds },
        }).exec();
    }

    async findForProjects( projectIds: Types.ObjectId[], page = 1, limit = 20 ) {
        if (projectIds.length === 0) {
            return {
                data: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                },
            };
        }

        const filter = { projectId: { $in: projectIds } };

        const [data, total] = await Promise.all([
            this.activityModel.find(filter).populate('actorId', 'firstName lastName userName').populate('projectId', 'name')
                                .sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean().exec(),
            this.activityModel.countDocuments(filter).exec(),
        ]);

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
}

