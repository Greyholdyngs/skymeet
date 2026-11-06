import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment> & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({ timestamps: true })
export class Comment {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    })
    projectId: Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Task',
        default: null,
        index: true,
    })
    taskId: Types.ObjectId | null;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    authorId: Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Comment',
        default: null,
        index: true,
    })
    parentCommentId: Types.ObjectId | null;

    @Prop({
        type: String,
        required: true,
    })
    ciphertext: string;

    @Prop({
        type: Date,
        default: null,
    })
    editedAt: Date | null;

    @Prop({
        type: Date,
        default: null,
    })
    deletedAt: Date | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ projectId: 1, taskId: 1, createdAt: 1});
CommentSchema.index({ parentCommentId: 1, createdAt: 1});
