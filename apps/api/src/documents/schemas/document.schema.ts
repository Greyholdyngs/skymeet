import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum DocumentType {
    DOCUMENT = 'document',
    DESIGN = 'design',
    NOTES = 'notes',
    TECHNICAL = 'technical',
}

export enum DocumentResourceType {
    FILE = 'file',
    LINK = 'link',
}

export type DocumentDocument = HydratedDocument<Document> & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({ timestamps: true })
export class Document {
    @Prop({
        type: Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    })
    projectId: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    createdBy: Types.ObjectId;

    @Prop({ required: true, trim: true, maxlength: 150 })
    title: string;

    @Prop({ trim: true, maxlength: 1000, default: '' })
    description: string;

    @Prop({
        type: String,
        enum: Object.values(DocumentType),
        required: true,
    })
    type: DocumentType;

    @Prop({
        type: String,
        enum: Object.values(DocumentResourceType),
        required: true,
    })
    resourceType: DocumentResourceType;

    @Prop({ trim: true })
    externalUrl?: string;

    @Prop({ trim: true })
    originalFileName?: string;

    @Prop()
    mimeType?: string;

    @Prop()
    fileSize?: number;

    @Prop({ trim: true })
    storagePublicId?: string;

    @Prop({ trim: true })
    storageResourceType?: string;

    @Prop({ trim: true })
    storageFormat?: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);

DocumentSchema.index({ projectId: 1, createdAt: -1 });
