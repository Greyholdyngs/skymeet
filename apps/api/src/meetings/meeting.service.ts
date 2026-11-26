import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectsService } from '../projects/projects.service.js';
import { ProjectMembersService } from '../project-members/project-members.service.js';
import { Meeting, MeetingDocument } from './schemas/meeting.schema.js';

import { CreateMeetingDto } from './dto/create-meeting.dto.js';
import { UpdateMeetingDto } from './dto/update-meeting.dto.js';
import { NotificationService } from '../notifications/notification.service.js';

import { User, UserDocument } from '../auth/schemas/user.schema.js';
@Injectable()
export class MeetingService {
    private readonly logger = new Logger(MeetingService.name);

    constructor(
        @InjectModel(Meeting.name)
        private readonly meetingModel: Model<MeetingDocument>,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        private readonly projectsService: ProjectsService,
        private readonly projectMembersService: ProjectMembersService,
        private readonly notificationService: NotificationService,
    ) {}

    private toObjectId(id: string): Types.ObjectId {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Resource not found');
        }

        return new Types.ObjectId(id);
    }

    private async getAccessibleProject( projectId: Types.ObjectId, userId: Types.ObjectId ) {
        const project = await this.projectsService.findAccessibleById( projectId, userId);

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    private async validateAttendees( attendeeIds: string[], userId: Types.ObjectId,
                                     project?: { _id: Types.ObjectId; ownerId: Types.ObjectId; } ): Promise<void> {
        if (project) {
            return this.assertProjectAttendees(
                project._id,
                project.ownerId,
                attendeeIds,
            );
        }

        return this.assertGeneralMeetingAttendees(
            userId,
            attendeeIds,
        );
    }

    private async assertProjectAttendees( projectId: Types.ObjectId, ownerId: Types.ObjectId, attendeeIds: string[] ): Promise<void> {
        const uniqueIds = [...new Set(attendeeIds)];

        for (const id of uniqueIds) {
            if (!Types.ObjectId.isValid(id)) {
                throw new BadRequestException( 'One or more attendee IDs are invalid',);
            }
        }

        const memberIds = await this.projectMembersService.findMemberIds(projectId);

        const allowedIds = new Set([
            ownerId.toString(),
            ...memberIds.map((id) => id.toString()),
        ]);

        if (uniqueIds.some((id) => !allowedIds.has(id))) {
            throw new BadRequestException( 'All meeting attendees must belong to this project' );
        }
    }

    private async assertGeneralMeetingAttendees( userId: Types.ObjectId, attendeeIds: string[], ): Promise<void> {
        const uniqueIds = [...new Set(attendeeIds)];

        for (const id of uniqueIds) {
            if (!Types.ObjectId.isValid(id)) {
                throw new BadRequestException( 'One or more attendee IDs are invalid', );
            }
        }

        const externalAttendeeIds = uniqueIds.filter(
            (id) => id !== userId.toString(),
        );

        if (externalAttendeeIds.length === 0) {
            return;
        }

        const existingUsers = await this.userModel.find({ _id: { $in: externalAttendeeIds },}).select('_id').lean().exec();

        if (existingUsers.length !== externalAttendeeIds.length) {
            throw new BadRequestException( 'One or more selected attendees do not exist', );
        }
    }

    private validateMeetingDates(startAt: Date, endAt: Date): void {
        if ( Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || startAt >= endAt ) {
            throw new BadRequestException( 'Meeting end time must be later than its start time', );
        }
    }

    async create( userId: Types.ObjectId, dto: CreateMeetingDto) {
        let project: {
            _id: Types.ObjectId;
            ownerId: Types.ObjectId;
        } | undefined;

        let projectObjectId: Types.ObjectId | null = null;

        if (dto.scope === 'project') {
            if (!dto.projectId) {
                throw new BadRequestException( 'A project must be selected for project meetings' );
            }

            projectObjectId = this.toObjectId(dto.projectId);
            project = await this.getAccessibleProject( projectObjectId, userId, );

        } else if (dto.scope === 'general') {
            if (dto.projectId) {
                throw new BadRequestException( 'General meetings cannot be associated with a project', );
            }
        }

        const attendeeIds = dto.attendeeIds ?? [];

        const startAt = new Date(dto.startAt);
        const endAt = new Date(dto.endAt);

        this.validateMeetingDates(startAt, endAt);

        await this.validateAttendees(
            attendeeIds,
            userId,
            project,
        );

        const attendees = [...new Set(attendeeIds)].filter((id) => id !== userId.toString()).map((id) => ({
                            userId: new Types.ObjectId(id),
                            response: 'pending' as const,
                        }));

        const meeting = await this.meetingModel.create({
            scope: dto.scope,
            projectId: projectObjectId,
            organizerId: userId,
            title: dto.title,
            description: dto.description ?? '',
            startAt,
            endAt,
            meetingLink: dto.meetingLink ?? null,
            attendees,
        });

        await this.notificationService.createMany(
            attendees.map((attendee) => ({
                recipientId: attendee.userId,
                actorId: userId,
                type: 'meeting_invitation' as const,
                title: 'Meeting invitation',
                message: `You have been invited to "${meeting.title}"`,
                resourceType: 'meeting' as const,
                resourceId: meeting._id,
            })),
        );

        return meeting;
    }

    async findByProject( projectId: string, userId: Types.ObjectId ) {
        const projectObjectId = this.toObjectId(projectId);

        await this.getAccessibleProject(projectObjectId, userId);

        return this.meetingModel.find({ projectId: projectObjectId }).populate('organizerId', 'firstName lastName userName')
            .populate('attendees.userId', 'firstName lastName userName').sort({ startAt: 1 }).exec();
    }

    async findOne(meetingId: string, userId: Types.ObjectId) {
        const meetingObjectId = this.toObjectId(meetingId);

        const meeting = await this.meetingModel.findById(meetingObjectId).populate('organizerId', 'firstName lastName userName')
            .populate('attendees.userId', 'firstName lastName userName').exec();

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        if (meeting.scope === 'project') {
            if (!meeting.projectId) {
                throw new NotFoundException('Meeting not found');
            }

            await this.getAccessibleProject(meeting.projectId, userId);

        } else {
            const isOrganizer = meeting.organizerId?.equals(userId) ?? false;
            const isAttendee = meeting.attendees.some( (attendee) => attendee.userId.equals(userId));

            if (!isOrganizer && !isAttendee) {
                throw new ForbiddenException('You do not have access to this meeting');
            }
        }

        return meeting;
    }

    async update( meetingId: string, userId: Types.ObjectId, dto: UpdateMeetingDto ) {
        const meetingObjectId = this.toObjectId(meetingId);

        const meeting = await this.meetingModel.findById(meetingObjectId).exec();

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        const isOrganizer = meeting.organizerId?.equals(userId) ?? false;
        const previousStartAt = meeting.startAt.getTime();
        const previousEndAt = meeting.endAt.getTime();

        const previousAttendeeIds = new Set( meeting.attendees.map((attendee) => attendee.userId.toString()),);

        let project: {
            _id: Types.ObjectId;
            ownerId: Types.ObjectId;
        } | undefined;

        if (meeting.scope === 'project') {
            if (!meeting.projectId) {
                throw new NotFoundException('Meeting not found');
            }

            project = await this.getAccessibleProject(meeting.projectId, userId);
        }

        const isOwner = project?.ownerId.equals(userId) ?? false;

        if (!isOrganizer && !isOwner) {
            throw new ForbiddenException( 'Only the meeting organizer or project owner can update this meeting' );
        }

        const startAt = dto.startAt !== undefined ? new Date(dto.startAt) : meeting.startAt;
        const endAt = dto.endAt !== undefined ? new Date(dto.endAt) : meeting.endAt;
        this.validateMeetingDates(startAt, endAt);

        if (dto.attendeeIds !== undefined) {
            await this.validateAttendees(
                dto.attendeeIds,
                userId,
                project,
            );

            meeting.attendees = [...new Set(dto.attendeeIds)].filter((id) => id !== meeting.organizerId?.toString()).map((id) => {
                                    const existing = meeting.attendees.find(
                                        (attendee) => attendee.userId.toString() === id,
                                    );

                    return {
                        userId: new Types.ObjectId(id),
                        response: existing?.response ?? 'pending',
                    };
                });
        }

        if (dto.title !== undefined) meeting.title = dto.title;
        if (dto.description !== undefined) meeting.description = dto.description;
        if (dto.startAt !== undefined) meeting.startAt = startAt;
        if (dto.endAt !== undefined) meeting.endAt = endAt;
        if (dto.meetingLink !== undefined) meeting.meetingLink = dto.meetingLink;

        const timeChanged = startAt.getTime() !== previousStartAt || endAt.getTime() !== previousEndAt;
        const savedMeeting = await meeting.save();

        const recipients = timeChanged ? savedMeeting.attendees.filter( (attendee) => attendee.response !== 'declined',)
                                        : savedMeeting.attendees.filter((attendee) => !previousAttendeeIds.has(attendee.userId.toString()),);

        if (recipients.length) {
            await this.notificationService.createMany(
                recipients.map((attendee) => ({
                    recipientId: attendee.userId,
                    actorId: userId,
                    type: timeChanged ? 'meeting_rescheduled' as const : 'meeting_invitation' as const,
                    title: timeChanged ? 'Meeting rescheduled' : 'Meeting invitation',
                    message: timeChanged ? `"${savedMeeting.title}" has been rescheduled` : `You have been invited to "${savedMeeting.title}"`,
                    resourceType: 'meeting' as const,
                    resourceId: savedMeeting._id,
                })),
            );
        }

        return savedMeeting;
    }

    async respond(  meetingId: string, userId: Types.ObjectId, response: 'accepted' | 'declined' ) {
        const meetingObjectId = this.toObjectId(meetingId);

        const meeting = await this.meetingModel.findById(meetingObjectId).exec();

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        const attendee = meeting.attendees.find( (item) => item.userId.equals(userId) );

        if (!attendee) {
            throw new ForbiddenException('You are not invited to this meeting');
        }

        if (meeting.status !== 'scheduled') {
            throw new BadRequestException( 'You cannot respond to a meeting that is no longer scheduled',);
        }

        attendee.response = response;

        return meeting.save();
    }

    async cancel(meetingId: string, userId: Types.ObjectId) {
        const meetingObjectId = this.toObjectId(meetingId);

        const meeting = await this.meetingModel.findById(meetingObjectId).exec();

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        const isOrganizer = meeting.organizerId?.equals(userId) ?? false;
        let isOwner = false;

        if (meeting.scope === 'project') {
            if (!meeting.projectId) {
                throw new NotFoundException('Meeting not found');
            }

            const project = await this.getAccessibleProject(meeting.projectId, userId);
            isOwner = project.ownerId.equals(userId);
        }

        if (!isOrganizer && !isOwner) {
            throw new ForbiddenException(  'Only the meeting organizer or project owner can cancel this meeting' );
        }

        if (meeting.status === 'cancelled') {
            throw new BadRequestException('Meeting is already cancelled');
        }

        meeting.status = 'cancelled';
        const cancelledMeeting = await meeting.save();

        await this.notificationService.createMany(
            cancelledMeeting.attendees.map((attendee) => ({
                recipientId: attendee.userId,
                actorId: userId,
                type: 'meeting_cancelled' as const,
                title: 'Meeting cancelled',
                message: `"${cancelledMeeting.title}" has been cancelled`,
                resourceType: 'meeting' as const,
                resourceId: cancelledMeeting._id,
            })),
        );

        return cancelledMeeting;
    }

    async findAll(userId: Types.ObjectId) {
        return this.meetingModel.find({
                $or: [
                    { organizerId: userId },
                    { 'attendees.userId': userId },
                ],
            }).populate('organizerId', 'firstName lastName userName').populate('attendees.userId', 'firstName lastName userName')
            .sort({ startAt: 1 }).exec();
    }
}
