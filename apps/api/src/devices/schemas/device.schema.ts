import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device> & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({ timestamps: true })
export class Device {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true,
    })
    userId: Types.ObjectId | null;

    @Prop({
        required: true,
        trim: true,
    })
    deviceId: string;

    @Prop({
        required: true,
        trim: true,
    })
    deviceName: string;

    @Prop({
        required: true,
        enum: ['web', 'desktop', 'mobile'],
    })
    platform: 'web' | 'desktop' | 'mobile';

    @Prop({
        type: String,
        default: null,
    })
    identityPublicKey: string | null;

    @Prop({
        required: true,
        enum: ['active', 'revoked'],
        default: 'active',
    })
    status: 'active' | 'revoked';

    @Prop({
        required: true,
        enum: ['not_configured', 'secured'],
        default: 'not_configured',
    })
    encryptionStatus: 'not_configured' | 'secured';

    @Prop({
        type: Date,
        default: null,
    })
    lastSeenAt: Date | null;

    @Prop({
        type: Date,
        default: null,
    })
    revokedAt: Date | null;

    @Prop({
        type: String,
        default: null,
    })
    enrollmentChallenge: string | null;

    @Prop({
        type: Date,
        default: null,
    })
    enrollmentChallengeExpiresAt: Date | null;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
DeviceSchema.index( { userId: 1, deviceId: 1 }, { unique: true },);
