import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ProjectMemberRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    TEAM_MEMBER = 'team_member',
}

export type ProjectMemberDocument = HydratedDocument<ProjectMember> & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({ timestamps: true })
export class ProjectMember {
    @Prop({
        type: Types.ObjectId,
        ref: 'Project',
        required: true,
    })
    projectId: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    userId: Types.ObjectId;

    @Prop({
        type: String,
        enum: Object.values(ProjectMemberRole),
        default: ProjectMemberRole.TEAM_MEMBER,
        required: true,
    })
    role: ProjectMemberRole;

    @Prop({
        type: Boolean,
        default: true,
        required: true,
    })
    canViewHistoricalChat: boolean;
}

export const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember);

ProjectMemberSchema.index(
    {
        projectId: 1, userId: 1,
    },
    {
        unique: true,
    },
);

