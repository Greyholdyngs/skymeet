import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    TASK_REVIEW = 'task_review',
    COMPLETED = 'completed',
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

export enum TaskReviewDecision {
    APPROVED = 'approved',
    CHANGES_REQUESTED = 'changes_requested',
}

@Schema({ _id: false })
export class TaskReviewEntry {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        default: null,
    })
    reviewerId: Types.ObjectId | null;

    @Prop({
        type: String,
        enum: Object.values(TaskReviewDecision),
        required: true,
    })
    decision: TaskReviewDecision;

    @Prop({ type: String, trim: true, default: '' })
    comment: string;

    @Prop({ type: Date, required: true, default: Date.now })
    reviewedAt: Date;
}

export const TaskReviewEntrySchema = SchemaFactory.createForClass(TaskReviewEntry);

@Schema({ timestamps: true })
export class Task {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    })
    projectId: Types.ObjectId;

    @Prop({
        type: [TaskReviewEntrySchema],
        default: [],
    })
    reviewHistory: TaskReviewEntry[];

    @Prop({ required: true, trim: true, minlength: 1, maxlength: 200 })
    title: string;

    @Prop({ trim: true, default: '', maxlength: 10000 })
    description: string;

    @Prop({
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.TODO,
        required: true,
    })
    status: TaskStatus;

    @Prop({
        type: String,
        enum: Object.values(TaskPriority),
        default: TaskPriority.MEDIUM,
        required: true,
    })
    priority: TaskPriority;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
        default: [],
    })
    assigneeIds: Types.ObjectId[];

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        default: null,
    })
    createdBy: Types.ObjectId | null;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        default: null,
    })
    reviewerId: Types.ObjectId | null;

    @Prop({ type: Date, default: null })
    dueDate: Date | null;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Sprint',
        default: null,
        index: true,
    })
    sprintId: Types.ObjectId | null;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ projectId: 1, createdAt: -1 });
TaskSchema.index({ assigneeIds: 1, status: 1, dueDate: 1 });
TaskSchema.index({ projectId: 1, sprintId: 1 });

