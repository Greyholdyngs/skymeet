import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ActivityAction, ActivityEntityType } from '../activity.types.js';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Activity {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    })
    projectId: Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true,
    })
    actorId: Types.ObjectId | null;

    @Prop({
        type: String,
        enum: Object.values(ActivityEntityType),
        required: true,
    })
    entityType: ActivityEntityType;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        required: true,
    })
    entityId: Types.ObjectId;

    @Prop({
        type: String,
        enum: Object.values(ActivityAction),
        required: true,
    })
    action: ActivityAction;

    @Prop({ type: String, required: true, trim: true, maxlength: 200 })
    entityTitle: string;

    @Prop({ type: String, default: null })
    fromStatus: string | null;

    @Prop({ type: String, default: null })
    toStatus: string | null;

    @Prop({ type: String, default: null })
    reviewDecision: string | null;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

ActivitySchema.index({ projectId: 1, createdAt: -1 });
