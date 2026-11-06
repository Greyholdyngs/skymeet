import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ProjectMlsGroupDocument = HydratedDocument<ProjectMlsGroup> & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({ timestamps: true })
export class ProjectMlsGroup {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Project',
        required: true,
        unique: true,
        index: true,
    })
    projectId: MongooseSchema.Types.ObjectId;

    @Prop({
        required: true,
        unique: true,
    })
    groupId: string;

    @Prop({
        required: true,
        enum: ['MLS_1.0'],
        default: 'MLS_1.0',
    })
    protocolVersion: 'MLS_1.0';

    @Prop({
        required: true,
    })
    cipherSuite: string;

    @Prop({
        required: true,
        default: 0,
        min: 0,
    })
    epoch: number;
}

export const ProjectMlsGroupSchema = SchemaFactory.createForClass(ProjectMlsGroup);