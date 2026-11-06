import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type MlsWelcomeDocument = HydratedDocument<MlsWelcome> & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({ timestamps: true })
export class MlsWelcome {
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
        type: MongooseSchema.Types.ObjectId,
        ref: 'Device',
        required: true,
    })
    senderDeviceRecordId: MongooseSchema.Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Device',
        required: true,
        index: true,
    })
    recipientDeviceRecordId: MongooseSchema.Types.ObjectId;

    @Prop({
        required: true,
    })
    encodedWelcome: string;

    @Prop({
        type: Date,
        default: null,
    })
    consumedAt: Date | null;

    @Prop({
        type: Date,
        default: null,
    })
    expiresAt: Date | null;
}

export const MlsWelcomeSchema = SchemaFactory.createForClass(MlsWelcome);
MlsWelcomeSchema.index({ recipientDeviceRecordId: 1, consumedAt: 1, createdAt: 1});