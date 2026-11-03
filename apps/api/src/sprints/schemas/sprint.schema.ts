import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum SprintStatus {
    PLANNED = 'planned',
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

export type SprintDocument = HydratedDocument<Sprint> & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({ timestamps: true })
export class Sprint {
    @Prop({
        type: Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    })
    projectId: Types.ObjectId;

    @Prop({
        required: true,
        trim: true,
        maxlength: 100,
    })
    name: string;

    @Prop({
        trim: true,
        default: '',
        maxlength: 1000,
    })
    description: string;

    @Prop({
        type: Date,
        required: true,
    })
    startDate: Date;

    @Prop({
        type: Date,
        required: true,
    })
    endDate: Date;

    @Prop({
        type: String,
        enum: Object.values(SprintStatus),
        default: SprintStatus.PLANNED,
        required: true,
    })
    status: SprintStatus;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    createdBy: Types.ObjectId;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);
SprintSchema.index({ projectId: 1, startDate: 1 });
