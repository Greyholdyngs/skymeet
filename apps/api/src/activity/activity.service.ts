
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Activity, ActivityDocument } from './schemas/activity.schema.js';
import { ActivityAction, ActivityEntityType } from './activity.types.js';

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
    constructor(
        @InjectModel(Activity.name)
        private readonly activityModel: Model<ActivityDocument>,
    ) {}

    async record(input: CreateActivityInput) {
        return this.activityModel.create(input);
    }

    async findRecentForProjects( projectIds: Types.ObjectId[], limit = 6 ) {
        if (projectIds.length === 0) {
            return [];
        }

        return this.activityModel
            .find({ projectId: { $in: projectIds } })
            .populate('actorId', 'firstName lastName userName')
            .populate('projectId', 'name')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .exec();
    }
}
