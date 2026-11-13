import { Injectable, ConflictException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import type { Connection, Model } from 'mongoose';

import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import { User, UserDocument } from '../auth/schemas/user.schema.js';

@Injectable()
export class AccountDeletionService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectConnection()
        private readonly connection: Connection,
    ) {}

    async validateDeletion(userId: string, currentPassword: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new NotFoundException('User not found');
        }

        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.passwordHash,
        );

        if (!passwordMatches) {
            throw new UnauthorizedException('Incorrect password');
        }

        const projectModel = this.connection.model('Project');

        const ownedProject = await projectModel.exists({
            ownerId: new Types.ObjectId(userId),
        });

        if (ownedProject) {
            throw new ConflictException( 'Transfer ownership of all your projects before deleting your account', );
        }

        return user;
    }
    
    async deleteAccount(userId: string, currentPassword: string) {
        const user = await this.validateDeletion(userId, currentPassword);
        const accountId = new Types.ObjectId(userId);

        const session = await this.connection.startSession();

        try {
            await session.withTransaction(async () => {
                const deviceModel = this.connection.model('Device');
                const keyPackageModel = this.connection.model('KeyPackage');
                const mlsWelcomeModel = this.connection.model('MlsWelcome');

                const devices = await deviceModel.find({ userId: accountId }).select('_id').session(session).lean().exec();
                const deviceRecordIds = devices.map((device) => device._id);
                await keyPackageModel.deleteMany( { userId: accountId }, { session }, );

                if (deviceRecordIds.length > 0) {
                    await mlsWelcomeModel.deleteMany(
                        { recipientDeviceRecordId: { $in: deviceRecordIds } },
                        { session },
                    );
                }

                for (const device of devices) {
                    await deviceModel.updateOne(
                        { _id: device._id, userId: accountId },
                        {
                            $set: {
                                userId: null,
                                deviceId: `deleted-${device._id.toString()}`,
                                deviceName: 'Deleted device',
                                identityPublicKey: null,
                                status: 'revoked',
                                encryptionStatus: 'not_configured',
                                revokedAt: new Date(),
                                enrollmentChallenge: null,
                                enrollmentChallengeExpiresAt: null,
                            },
                        },
                        { session },
                    );
                }

                const projectMemberModel = this.connection.model('ProjectMember');
                const otpModel = this.connection.model('Otp');
                const invitationModel = this.connection.model('Invitation');

                const notificationModel = this.connection.model('Notification');
                await projectMemberModel.deleteMany( { userId: accountId }, { session }, );
                await otpModel.deleteMany( { userId: accountId }, { session },);

                await invitationModel.deleteMany(
                    {
                        $or: [
                            { invitedBy: accountId },
                            { email: user.email },
                        ],
                    },
                    { session },
                );

                await notificationModel.deleteMany( { recipientId: accountId }, { session },);
                const commentModel = this.connection.model('Comment');
                const activityModel = this.connection.model('Activity');

                await notificationModel.updateMany( { actorId: accountId }, { $set: { actorId: null } }, { session } );
                await commentModel.updateMany( { authorId: accountId }, { $set: { authorId: null } }, { session }, );
                await activityModel.updateMany( { actorId: accountId }, { $set: { actorId: null } }, { session }, );

                const taskModel = this.connection.model('Task');
                const sprintModel = this.connection.model('Sprint');

                await taskModel.updateMany(
                    {
                        $or: [
                            { assigneeIds: accountId },
                            { createdBy: accountId },
                            { reviewerId: accountId },
                            { 'reviewHistory.reviewerId': accountId },
                        ],
                    },
                    {
                        $pull: {
                            assigneeIds: accountId,
                        },
                        $set: {
                            createdBy: null,
                            reviewerId: null,
                            'reviewHistory.$[entry].reviewerId': null,
                        },
                    },
                    {
                        session,
                        arrayFilters: [
                            { 'entry.reviewerId': accountId },
                        ],
                    },
                );

                await sprintModel.updateMany( { createdBy: accountId }, { $set: { createdBy: null } }, { session }, );
                const meetingModel = this.connection.model('Meeting');

                await meetingModel.updateMany(
                    {
                        organizerId: accountId,
                        scope: 'general',
                    },
                    {
                        $set: {
                            organizerId: null,
                            status: 'cancelled',
                        },
                        $pull: {
                            attendees: { userId: accountId },
                        },
                    },
                    { session },
                );

                await meetingModel.updateMany( { organizerId: accountId }, { $set: { organizerId: null } }, { session }, );
                await meetingModel.updateMany(
                    { 'attendees.userId': accountId },
                    { $pull: { attendees: { userId: accountId } } },
                    { session },
                );

                const projectModel = this.connection.model('Project');
                const remainingOwnedProject = await projectModel.exists({ ownerId: accountId }).session(session);

                if (remainingOwnedProject) {
                    throw new ConflictException( 'Transfer ownership of all your projects before deleting your account', );
                }

                const deletionResult = await this.userModel.deleteOne(
                    { _id: accountId },
                    { session },
                ).exec();

                if (deletionResult.deletedCount !== 1) {
                    throw new NotFoundException('User not found');
                }
            });

            return {
                message: 'Account deleted successfully',
            };
        } finally {
            await session.endSession();
        }
    }

}