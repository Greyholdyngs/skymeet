import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectMemberDocument = HydratedDocument<ProjectMember>;

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
        enum: ['owner', 'member'],
        default: 'member',
        required: true,
    })
    role: 'owner' | 'member';
}

export const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember);

ProjectMemberSchema.index(
    {
        projectId: 1,
        userId: 1,
    },
    {
        unique: true,
    },
);

