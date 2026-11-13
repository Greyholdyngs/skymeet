import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class UserPreferences {
    @Prop({
        type: String,
        enum: ['system', 'light', 'dark'],
        default: 'system',
    })
    appearance: 'system' | 'light' | 'dark';

    @Prop({
        type: String,
        default: 'Africa/Lagos',
    })
    timezone: string;

    @Prop({
        type: Boolean,
        default: true,
    })
    inAppNotifications: boolean;

    @Prop({
        type: Boolean,
        default: true,
    })
    showChatHistoryToNewMembers: boolean;
}

export const UserPreferencesSchema = SchemaFactory.createForClass(UserPreferences);

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true })
    firstName: string;

    @Prop({ required: true, trim: true })
    lastName: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    userName: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ type: String, lowercase: true, trim: true, default: null })
    pendingEmail: string | null;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ default: false })
    isEmailVerified: boolean;

    @Prop({ default: 0 })
    tokenVersion: number;

    @Prop({
        type: UserPreferencesSchema,
        default: () => ({}),
    })
    preferences: UserPreferences;

}

export const UserSchema = SchemaFactory.createForClass(User);
