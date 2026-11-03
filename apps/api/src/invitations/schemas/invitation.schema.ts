
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProjectMemberRole } from '../../project-members/schemas/project-member.schema.js';

export type InvitationDocument = HydratedDocument<Invitation>;

export enum InvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    EXPIRED = 'expired',
    REVOKED = 'revoked',
}

@Schema({ timestamps: true })
export class Invitation {
    @Prop({
        type: Types.ObjectId,
        ref: 'Project',
        required: true,
    })
    projectId: Types.ObjectId;

    @Prop({
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    })
    email: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    invitedBy: Types.ObjectId;

    @Prop({
        type: String,
        enum: [
            ProjectMemberRole.ADMIN,
            ProjectMemberRole.TEAM_MEMBER,
        ],
        required: true,
    })
    role: ProjectMemberRole.ADMIN | ProjectMemberRole.TEAM_MEMBER;

    @Prop({
        type: String,
        enum: Object.values(InvitationStatus),
        default: InvitationStatus.PENDING,
        required: true,
    })
    status: InvitationStatus;

    @Prop({
        type: String,
        required: true,
        unique: true,
        select: false,
    })
    token: string;

    @Prop({
        type: Date,
        required: true,
    })
    expiresAt: Date;

    @Prop({
        type: Date,
        default: null,
    })
    respondedAt: Date | null;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

InvitationSchema.index({ projectId: 1, email: 1, status: 1 });
InvitationSchema.index({ email: 1, status: 1 });
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
