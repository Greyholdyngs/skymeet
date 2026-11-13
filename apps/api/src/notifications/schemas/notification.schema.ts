import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export type NotificationType =
    | 'task_assigned'
    | 'task_review_requested'
    | 'task_approved'
    | 'task_changes_requested'
    | 'comment_added'
    | 'comment_reply'
    | 'mention'
    | 'meeting_invitation'
    | 'meeting_rescheduled'
    | 'meeting_cancelled'
    | 'project_invitation';

export type NotificationResourceType =
    | 'project'
    | 'task'
    | 'meeting'
    | 'comment';

@Schema({ timestamps: true })
export class Notification {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    })
    recipientId: Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        default: null,
    })
    actorId: Types.ObjectId | null;

    @Prop({
        type: String,
        enum: [
            'task_assigned',
            'task_review_requested',
            'task_approved',
            'task_changes_requested',
            'comment_added',
            'comment_reply',
            'mention',
            'meeting_invitation',
            'meeting_rescheduled',
            'meeting_cancelled',
            'project_invitation',
        ],
        required: true,
    })
    type: NotificationType;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
    })
    title: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxlength: 240,
    })
    message: string;

    @Prop({
        type: String,
        enum: ['project', 'task', 'meeting', 'comment'],
        default: null,
    })
    resourceType: NotificationResourceType | null;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        default: null,
    })
    resourceId: Types.ObjectId | null;

    @Prop({
        type: Boolean,
        default: false,
    })
    isRead: boolean;

    @Prop({
        type: Date,
        default: null,
    })
    readAt: Date | null;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
