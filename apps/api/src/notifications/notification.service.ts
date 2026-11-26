import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Notification, NotificationDocument } from './schemas/notification.schema.js';
import { NotificationGateway } from './notification.gateway.js';
import { User, UserDocument } from '../auth/schemas/user.schema.js';

interface CreateNotificationInput {
    recipientId: Types.ObjectId;
    actorId?: Types.ObjectId | null;
    type: Notification['type'];
    title: string;
    message: string;
    resourceType?: Notification['resourceType'];
    resourceId?: Types.ObjectId | null;
}

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<NotificationDocument>,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        private readonly notificationGateway: NotificationGateway,
    ) {}

    private isCommentNotification(type: Notification['type']): boolean {
        return type === 'comment_added' || type === 'comment_reply';
    }

    async create(input: CreateNotificationInput) {
        const recipient = await this.userModel.findById(input.recipientId)
            .select('preferences.inAppNotifications preferences.commentNotifications').lean().exec();

        if ( recipient?.preferences?.inAppNotifications === false || (this.isCommentNotification(input.type) &&
                recipient?.preferences?.commentNotifications === false) ) {

            return null;
        }

        const notification = await this.notificationModel.create({
            ...input,
            actorId: input.actorId ?? null,
            resourceType: input.resourceType ?? null,
            resourceId: input.resourceId ?? null,
        });

        this.notificationGateway.sendToUser(
            input.recipientId.toString(),
            notification,
        );

        return notification;
    }

    async createMany(inputs: CreateNotificationInput[]) {
        if (!inputs.length) return [];

        const recipientIds = [
            ...new Set(inputs.map((input) => input.recipientId.toString())),
        ];

        const recipients = await this.userModel.find({ _id: { $in: recipientIds } })
            .select('preferences.inAppNotifications preferences.commentNotifications').lean().exec();

        const preferencesByUser = new Map(
            recipients.map((user) => [
                user._id.toString(),
                user.preferences,
            ]),
        );

        const allowedInputs = inputs.filter((input) => {
            const preferences = preferencesByUser.get(input.recipientId.toString());

            if (preferences?.inAppNotifications === false) {
                return false;
            }

            if ( this.isCommentNotification(input.type) && preferences?.commentNotifications === false ) {
                return false;
            }

            return true;
        });

        if (!allowedInputs.length) return [];

        const notifications = await this.notificationModel.insertMany(
            allowedInputs.map((input) => ({
                ...input,
                actorId: input.actorId ?? null,
                resourceType: input.resourceType ?? null,
                resourceId: input.resourceId ?? null,
            })),
        );

        for (const notification of notifications) {
            this.notificationGateway.sendToUser(
                notification.recipientId.toString(),
                notification,
            );
        }

        return notifications;
    }

    async findForUser(userId: Types.ObjectId, page = 1, limit = 20) {
        const safePage = Math.max(1, Math.floor(page));
        const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
        const skip = (safePage - 1) * safeLimit;

        const filter = { recipientId: userId };

        const [notifications, total] = await Promise.all([
            this.notificationModel.find(filter).populate('actorId', 'firstName lastName userName')
                .sort({ createdAt: -1 }).skip(skip).limit(safeLimit).exec(),

            this.notificationModel.countDocuments(filter),
        ]);

        return {
            notifications,
            pagination: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }

    async getUnreadCount(userId: Types.ObjectId) {
        return {
            unreadCount: await this.notificationModel.countDocuments({
                recipientId: userId,
                isRead: false,
            }),
        };
    }

    async markAsRead(notificationId: string, userId: Types.ObjectId) {
        if (!Types.ObjectId.isValid(notificationId)) {
            throw new NotFoundException('Notification not found');
        }

        const notification = await this.notificationModel.findOneAndUpdate(
            {
                _id: new Types.ObjectId(notificationId),
                recipientId: userId,
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date(),
                },
            },
            { returnDocument: 'after' },
        ).exec();

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        return notification;
    }

    async markAllAsRead(userId: Types.ObjectId) {
        const result = await this.notificationModel.updateMany(
            {
                recipientId: userId,
                isRead: false,
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date(),
                },
            },
        ).exec();

        return {
            modifiedCount: result.modifiedCount,
        };
    }
}

