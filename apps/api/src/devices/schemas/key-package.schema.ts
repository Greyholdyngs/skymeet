import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type KeyPackageDocument = HydratedDocument<KeyPackage> & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({ timestamps: true })
export class KeyPackage {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    })
    userId: Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Device',
        required: true,
        index: true,
    })
    deviceRecordId: Types.ObjectId;

    @Prop({
        required: true,
        unique: true,
    })
    keyPackageId: string;

    @Prop({
        required: true,
    })
    cipherSuite: string;

    @Prop({
        required: true,
    })
    encodedKeyPackage: string;

    @Prop({
        required: true,
        enum: ['available', 'consumed', 'revoked'],
        default: 'available',
        index: true,
    })
    status: 'available' | 'consumed' | 'revoked';

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

export const KeyPackageSchema = SchemaFactory.createForClass(KeyPackage);
KeyPackageSchema.index({ deviceRecordId: 1, status: 1, createdAt: 1 });