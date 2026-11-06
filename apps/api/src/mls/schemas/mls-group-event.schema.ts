import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type MlsGroupEventDocument = HydratedDocument<MlsGroupEvent> & {
    createdAt: Date;
};

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class MlsGroupEvent {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    })
    projectId: MongooseSchema.Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'ProjectMlsGroup',
        required: true,
        index: true,
    })
    groupRecordId: MongooseSchema.Types.ObjectId;

    @Prop({
        required: true,
        index: true,
    })
    groupId: string;

    @Prop({
        required: true,
        min: 0,
    })
    epoch: number;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Device',
        required: true,
    })
    senderDeviceRecordId: MongooseSchema.Types.ObjectId;

    @Prop({
        required: true,
        enum: ['application', 'proposal', 'commit'],
    })
    messageType: 'application' | 'proposal' | 'commit';

    @Prop({
        required: true,
    })
    encodedMessage: string;
}

export const MlsGroupEventSchema = SchemaFactory.createForClass(MlsGroupEvent);
MlsGroupEventSchema.index({ groupId: 1, createdAt: 1, _id: 1,});