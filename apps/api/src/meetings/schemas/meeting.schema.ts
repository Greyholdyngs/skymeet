import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type MeetingDocument = HydratedDocument<Meeting> & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({ timestamps: true })
export class Meeting {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Project',
        required: false,
        default: null,
        index: true,
    })
    projectId?: Types.ObjectId | null;

    @Prop({
        type: String,
        enum: ['general', 'project'],
        required: true,
        default: 'project',
        index: true,
    })
    scope: 'general' | 'project';

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true,
    })
    organizerId: Types.ObjectId | null;

    @Prop({
        required: true,
        trim: true,
        maxlength: 150,
    })
    title: string;

    @Prop({
        type: String,
        default: '',
        maxlength: 2000,
    })
    description: string;

    @Prop({
        type: Date,
        required: true,
    })
    startAt: Date;

    @Prop({
        type: Date,
        required: true,
    })
    endAt: Date;

    @Prop({
        type: String,
        default: null,
        trim: true,
    })
    meetingLink: string | null;

    @Prop({
        type: String,
        enum: ['scheduled', 'cancelled', 'completed'],
        default: 'scheduled',
        index: true,
    })
    status: 'scheduled' | 'cancelled' | 'completed';

    @Prop({
        type: [
            {
                userId: {
                    type: MongooseSchema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                response: {
                    type: String,
                    enum: ['pending', 'accepted', 'declined'],
                    default: 'pending',
                },
            },
        ],
        default: [],
    })
    attendees: {
        userId: Types.ObjectId;
        response: 'pending' | 'accepted' | 'declined';
    }[];
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
MeetingSchema.index({ projectId: 1, startAt: 1 });
MeetingSchema.index({ organizerId: 1, startAt: 1 });
