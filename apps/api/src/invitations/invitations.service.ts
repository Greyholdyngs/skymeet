import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, createHash } from 'node:crypto';

import { Model, Types } from 'mongoose';
import { EmailService } from '../auth/services/email.service.js';
import { ProjectMemberRole } from '../project-members/schemas/project-member.schema.js';

import { ProjectMembersService } from '../project-members/project-members.service.js';
import { Invitation, InvitationDocument, InvitationStatus } from './schemas/invitation.schema.js';
import { INVITATION_EXPIRY_MS } from './invitations.constant.js';

import { User, UserDocument } from '../auth/schemas/user.schema.js';
import { Project, ProjectDocument } from '../projects/schema/project.schema.js';
import { NotificationService } from '../notifications/notification.service.js';

@Injectable()
export class InvitationsService {
    constructor(
        @InjectModel(Invitation.name)
        private readonly invitationModel: Model<InvitationDocument>,

        private readonly projectMembersService: ProjectMembersService,
        private readonly emailService: EmailService,
        private readonly notificationService: NotificationService,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(Project.name)
        private readonly projectModel: Model<ProjectDocument>,
    ) {}

    async createInvitation( projectId: string, inviterId: string,
                            input: {  email?: string; userName?: string;
                            role: ProjectMemberRole.ADMIN | ProjectMemberRole.TEAM_MEMBER; } ) {

        const { email, userName, role } = input;
        const hasEmail = typeof email === 'string' && email.trim().length > 0;
        const hasUserName = typeof userName === 'string' && userName.trim().length > 0;

        if (hasEmail === hasUserName) {
            throw new BadRequestException( 'Provide either an email address or a username, not both.' );
        }

        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(inviterId) ) {
            throw new NotFoundException('Project not found.');
        }

        const projectObjectId = new Types.ObjectId(projectId);
        const inviterObjectId = new Types.ObjectId(inviterId);

        const inviterRole = await this.projectMembersService.getRoleInProject( projectObjectId, inviterObjectId );

        if ( inviterRole !== ProjectMemberRole.OWNER && inviterRole !== ProjectMemberRole.ADMIN ) {
            throw new ForbiddenException( 'Only project owners and admins can invite members.', );
        }

        if ( inviterRole === ProjectMemberRole.ADMIN && role !== ProjectMemberRole.TEAM_MEMBER ) {
            throw new ForbiddenException( 'Admins can only invite team members.' );
        }

        let normalizedEmail: string;
        let invitedUser: UserDocument | null;

        if (hasUserName) {
            const normalizedUserName = userName!.trim();

            invitedUser = await this.userModel.findOne({ userName: normalizedUserName }).exec();

            if (!invitedUser) {
                throw new NotFoundException( 'No account was found with that username.' );
            }

            normalizedEmail = invitedUser.email.trim().toLowerCase();
        } else {
            normalizedEmail = email!.trim().toLowerCase();

            invitedUser = await this.userModel.findOne({ email: normalizedEmail }).exec();
        }

        if ( invitedUser && invitedUser._id.toString() === inviterObjectId.toString() ) {
            throw new BadRequestException( 'You cannot invite yourself to your own project.' );
        }

        if ( invitedUser && await this.projectMembersService.canAccessProject( projectObjectId, invitedUser._id ) ) {
            throw new ConflictException( 'This user is already a member of the project.' );
        }

        const now = new Date();

        const existingInvitation = await this.invitationModel.findOne({
            projectId: projectObjectId,
            email: normalizedEmail,
            status: InvitationStatus.PENDING,
            expiresAt: { $gt: now },
            }).exec();

        if (existingInvitation) {
            throw new ConflictException( 'A pending invitation already exists for this email.');
        }

        const frontendUrl = process.env.FRONTEND_URL?.trim();

        if (!frontendUrl) {
            throw new BadRequestException( 'Frontend URL is not configured.' );
        }

        const rawToken = randomBytes(32).toString('hex');
        const tokenHash = createHash('sha256').update(rawToken).digest('hex');

        const expiresAt = new Date( Date.now() + INVITATION_EXPIRY_MS );

        const invitation = await this.invitationModel.create({
            projectId: projectObjectId,
            email: normalizedEmail,
            invitedBy: inviterObjectId,
            role,
            status: InvitationStatus.PENDING,
            token: tokenHash,
            expiresAt,
        });

        const invitationUrl = `${frontendUrl.replace(/\/+$/, '')}` + `/invitations/accept?token=${rawToken}`;

        try {
            await this.emailService.sendEmail(
                normalizedEmail,
                'You have been invited to collaborate on SkyMeet',
                `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>You're invited to SkyMeet</h2>
                        <p>
                            You've been invited to join a project on SkyMeet
                            as a ${role.replace('_', ' ')}.
                        </p>
                        <p>
                            <a href="${invitationUrl}">View invitation</a>
                        </p>
                        <p>This invitation expires in 7 days.</p>
                        <p>
                            If you weren't expecting this invitation,
                            you can ignore this email.
                        </p>
                    </div>
                `,
            );
        } catch {
            await this.invitationModel.findByIdAndDelete(invitation._id).exec();
            throw new BadRequestException('The invitation email could not be sent. Please try again.' );
        }

        if (invitedUser) {
            try {
                await this.notificationService.create({
                    recipientId: invitedUser._id,
                    actorId: inviterObjectId,
                    type: 'project_invitation',
                    title: 'Project invitation',
                    message: 'You have been invited to join a project on SkyMeet',
                    resourceType: 'project',
                    resourceId: projectObjectId,
                });
            } catch (error) {}
        }

        return {
            message: 'Invitation sent successfully',
            invitation: {
            id: invitation._id,
            email: invitation.email,
            role: invitation.role,
            status: invitation.status,
            expiresAt: invitation.expiresAt,
            },
        };
    }

    async getPendingInvitation( projectId: string, userId: string, userEmail: string, ) {
        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(userId) || !userEmail?.trim()) {
            throw new BadRequestException('Invalid invitation request.');
        }

        const normalizedEmail = userEmail.trim().toLowerCase();
        const projectObjectId = new Types.ObjectId(projectId);
        const now = new Date();

        const invitation = await this.invitationModel.findOne({
            projectId: projectObjectId,
            email: normalizedEmail,
            status: InvitationStatus.PENDING,
            expiresAt: { $gt: now },
        }).exec();

        if (!invitation) {
            const expiredInvitation = await this.invitationModel.findOne({
                projectId: projectObjectId,
                email: normalizedEmail,
                status: InvitationStatus.PENDING,
                expiresAt: { $lte: now },
            }).exec();

            if (expiredInvitation) {
                await this.invitationModel.updateOne(
                    {
                        _id: expiredInvitation._id,
                        status: InvitationStatus.PENDING,
                    },
                    {
                        $set: {
                            status: InvitationStatus.EXPIRED,
                            respondedAt: now,
                        },
                    },
                ).exec();

                throw new BadRequestException('This invitation has expired.');
            }

            throw new NotFoundException( 'No pending invitation was found for this project.', );
        }

        const [project, inviter] = await Promise.all([
            this.projectModel.findById(projectObjectId).select('name').lean().exec(),

            this.userModel.findById(invitation.invitedBy).select('firstName lastName userName').lean().exec(),
        ]);

        if (!project || !inviter) {
            throw new NotFoundException('Invitation details could not be found.');
        }

        return {
            id: invitation._id.toString(),
            projectId: projectObjectId.toString(),
            projectName: project.name,
            inviter: {
                firstName: inviter.firstName,
                lastName: inviter.lastName,
                userName: inviter.userName,
            },
            role: invitation.role,
            expiresAt: invitation.expiresAt,
        };
    }

    async respondToInvitationById( invitationId: string, action: 'accept' | 'decline', userId: string,
                                    userEmail: string, ) {
        if ( !Types.ObjectId.isValid(invitationId) || !Types.ObjectId.isValid(userId) || !userEmail?.trim() ) {
            throw new BadRequestException('Invalid invitation request.');
        }

        const invitation = await this.invitationModel.findOne({
            _id: new Types.ObjectId(invitationId),
            email: userEmail.trim().toLowerCase(),
            status: InvitationStatus.PENDING,
        }).exec();

        if (!invitation) {
            throw new NotFoundException( 'Invitation not found or no longer available.', );
        }

        const now = new Date();

        if (invitation.expiresAt <= now) {
            await this.invitationModel.updateOne(
                {
                    _id: invitation._id,
                    status: InvitationStatus.PENDING,
                },
                {
                    $set: {
                        status: InvitationStatus.EXPIRED,
                        respondedAt: now,
                    },
                },
            ).exec();

            throw new BadRequestException('This invitation has expired.');
        }

        if (action === 'accept') {
            return this.acceptInvitationById(
                invitation._id.toString(),
                userId,
                userEmail,
            );
        }

        const declinedInvitation = await this.invitationModel.findOneAndUpdate(
            {
                _id: invitation._id,
                email: userEmail.trim().toLowerCase(),
                status: InvitationStatus.PENDING,
                expiresAt: { $gt: now },
            },
            {
                $set: {
                    status: InvitationStatus.DECLINED,
                    respondedAt: now,
                },
            },
            { returnDocument: 'after' },
        ).exec();

        if (!declinedInvitation) {
            throw new ConflictException( 'This invitation has already been responded to or has expired.', );
        }

        return {
            message: 'Invitation declined successfully.',
            invitation: {
                id: declinedInvitation._id,
                status: declinedInvitation.status,
                respondedAt: declinedInvitation.respondedAt,
            },
        };
    }

    private async acceptInvitationById( invitationId: string, userId: string, userEmail: string, ) {
        const now = new Date();

        const claimedInvitation = await this.invitationModel.findOneAndUpdate(
            {
                _id: new Types.ObjectId(invitationId),
                email: userEmail.trim().toLowerCase(),
                status: InvitationStatus.PENDING,
                expiresAt: { $gt: now },
            },
            {
                $set: {
                    status: InvitationStatus.ACCEPTED,
                    respondedAt: now,
                },
            },
            { returnDocument: 'after' },
        ).exec();

        if (!claimedInvitation) {
            throw new ConflictException('This invitation has already been used or has expired.',);
        }

        try {
            await this.projectMembersService.addMember(
                claimedInvitation.projectId,
                new Types.ObjectId(userId),
                claimedInvitation.role,
            );
        } catch (error) {
            await this.invitationModel.updateOne(
                {
                    _id: claimedInvitation._id,
                    status: InvitationStatus.ACCEPTED,
                },
                {
                    $set: {
                        status: InvitationStatus.PENDING,
                        respondedAt: null,
                    },
                },
            ).exec();

            throw error;
        }

        return {
            message: 'Invitation accepted successfully',
            projectId: claimedInvitation.projectId,
            role: claimedInvitation.role,
        };
    }

    async acceptInvitation( rawToken: string, userId: string, userEmail: string ) {
        if (!rawToken?.trim() || !Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid invitation request');
        }

        const tokenHash = createHash('sha256').update(rawToken).digest('hex');

        const invitation = await this.invitationModel.findOne({ token: tokenHash, status: InvitationStatus.PENDING }).exec();

        if (!invitation) {
            throw new NotFoundException( 'Invitation not found or no longer available', );
        }

        if (invitation.expiresAt.getTime() <= Date.now()) {
            await this.invitationModel.updateOne(
                {
                    _id: invitation._id,
                    status: InvitationStatus.PENDING,
                },
                {
                    $set: { status: InvitationStatus.EXPIRED },
                },
            ).exec();

            throw new BadRequestException('This invitation has expired');
        }

        if (invitation.email !== userEmail.trim().toLowerCase()) {
            throw new ForbiddenException( 'This invitation was sent to a different email address' );
        }

        const claimedInvitation = await this.invitationModel.findOneAndUpdate(
            {
                _id: invitation._id,
                status: InvitationStatus.PENDING,
                expiresAt: { $gt: new Date() },
            },
            {
                $set: {
                    status: InvitationStatus.ACCEPTED,
                    respondedAt: new Date(),
                },
            },
            { returnDocument: 'after' },
        ).exec();

        if (!claimedInvitation) {
            throw new ConflictException( 'This invitation has already been used or has expired' );
        }

        try {
            await this.projectMembersService.addMember(
                claimedInvitation.projectId,
                new Types.ObjectId(userId),
                claimedInvitation.role,
            );
        } catch (error) {
            await this.invitationModel.updateOne(
                {
                    _id: claimedInvitation._id,
                    status: InvitationStatus.ACCEPTED,
                },
                {
                    $set: {
                        status: InvitationStatus.PENDING,
                        respondedAt: null,
                    },
                },
            ).exec();

            throw error;
        }

        return {
            message: 'Invitation accepted successfully',
            projectId: claimedInvitation.projectId,
            role: claimedInvitation.role,
        };
    }

    async declineInvitation( rawToken: string, userId: string, userEmail: string ) {
        if ( !rawToken || !Types.ObjectId.isValid(userId) || !userEmail?.trim() ) {
            throw new BadRequestException( 'A valid invitation token and authenticated user are required.' );
        }

        const tokenHash = createHash('sha256').update(rawToken).digest('hex');
        const normalizedEmail = userEmail.trim().toLowerCase();
        const invitation = await this.invitationModel.findOne({token: tokenHash, status: InvitationStatus.PENDING}).exec();

        if (!invitation) {
            throw new NotFoundException( 'Invitation not found or it has already been responded to.' );
        }

        if (invitation.email !== normalizedEmail) {
            throw new ForbiddenException( 'This invitation was sent to a different email address.' );
        }
        const now = new Date();

        if (invitation.expiresAt <= now) {
            await this.invitationModel.updateOne(
            {
                _id: invitation._id,
                status: InvitationStatus.PENDING,
                expiresAt: { $lte: now },
            },
            {
                $set: {
                status: InvitationStatus.EXPIRED,
                respondedAt: now,
                },
            },
            ).exec();
            throw new BadRequestException( 'This invitation has expired.' );
        }

        const declinedInvitation = await this.invitationModel.findOneAndUpdate(
            {
                _id: invitation._id,
                status: InvitationStatus.PENDING,
                email: normalizedEmail,
                expiresAt: { $gt: now },
            },
            { $set: { status: InvitationStatus.DECLINED, respondedAt: now, },},
            { returnDocument: 'after' },
            ).exec();

        if (!declinedInvitation) {
            throw new ConflictException( 'This invitation has already been responded to or has expired.' );
        }

        return {
            message: 'Invitation declined successfully.',
            invitation: {
            id: declinedInvitation._id,
            status: declinedInvitation.status,
            respondedAt: declinedInvitation.respondedAt,
            },
        };
    }

    async getProjectPeople(projectId: string, userId: string) {

        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(userId) ) {
            throw new NotFoundException('Project not found.');
        }

        const projectObjectId = new Types.ObjectId(projectId);
        const userObjectId = new Types.ObjectId(userId);

        const project = await this.projectModel.findById(projectObjectId).select('ownerId createdAt').lean().exec() as {
            _id: Types.ObjectId;
            ownerId: Types.ObjectId;
            createdAt: Date;
        } | null;

        if (!project) {
            throw new NotFoundException('Project not found.');
        }

        const hasAccess = await this.projectMembersService.canAccessProject( projectObjectId, userObjectId, );

        if (!hasAccess) {
            throw new NotFoundException('Project not found.');
        }

        const [owner, memberRecords, , invitations] = await Promise.all([
            this.userModel.findById(project.ownerId).select('firstName lastName userName email').lean().exec(),
            this.projectMembersService.findByProject(projectObjectId),

            await this.invitationModel.updateMany(
                {
                    projectId: projectObjectId,
                    status: InvitationStatus.PENDING,
                    expiresAt: { $lte: new Date() },
                },
                {
                    $set: {
                        status: InvitationStatus.EXPIRED,
                    },
                },
            ),

            this.invitationModel.find({
                projectId: projectObjectId,
                status: {
                    $in: [
                        InvitationStatus.PENDING,
                        InvitationStatus.DECLINED,
                        InvitationStatus.EXPIRED,
                    ],
                },
            }).select('email role status createdAt expiresAt').sort({ createdAt: -1 }).lean().exec(),
        ]);

        if (!owner) {
            throw new NotFoundException('Project owner not found.');
        }

        const filteredMembers = memberRecords.filter((member) => {
            const populatedUser = member.userId as unknown as {
                _id: Types.ObjectId;
            };

            return ( populatedUser._id.toString() !== project.ownerId.toString());
        });

        return {
            members: [
                {
                    user: owner,
                    role: ProjectMemberRole.OWNER,
                    joinedAt: project.createdAt,
                },
                ...filteredMembers.map((member) => ({
                    user: member.userId,
                    role: member.role,
                    joinedAt: member.createdAt,
                })),
            ],

            invitations,
        };
    }

}
