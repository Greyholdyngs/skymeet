import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({
  timestamps: true,
})
export class Otp {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true,}) 
    userId: Types.ObjectId;

    @Prop({ required: true }) 
    otpHash: string;

    @Prop({ required: true, enum: ['email_verification', 'password_reset', 'email_change'], })
    purpose: 'email_verification' | 'password_reset' | 'email_change';

    @Prop({ required: true }) 
    expiresAt: Date;

    @Prop({default: 0,}) 
    attempts: number;

    @Prop({ required: true }) 
    resendAvailableAt: Date;

}

export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.index( { userId: 1, purpose: 1 }, { unique: true },);
OtpSchema.index( { expiresAt: 1 }, { expireAfterSeconds: 0 });