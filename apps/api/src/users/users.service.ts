import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument } from '../auth/schemas/user.schema.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdatePreferencesDto } from './dto/update-preference.dto.js';

import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import bcrypt from 'bcrypt';

import { AccountDeletionService } from './account-deletion.service.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectConnection()
        private readonly connection: Connection,

        private readonly accountDeletionService: AccountDeletionService,
    ) {}

    async getProfile(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new NotFoundException('User not found');
        }

        const user = await this.userModel.findById(userId).select('-passwordHash -tokenVersion').lean().exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async searchUsers(userId: string, query: string, type?: string) {
        const search = query.trim();

        if (search.length < 2) {
            return [];
        }

        const currentUserId = new Types.ObjectId(userId);

        if (type === 'email') {
            const email = search.toLowerCase();

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return [];
            }

            return this.userModel.findOne({_id: { $ne: currentUserId },email,})
                .select('_id firstName lastName userName email').lean().exec().then((user) => user ? [user] : []);
        }

        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escapedSearch, 'i');

        return this.userModel.find({
            _id: { $ne: currentUserId },
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { userName: searchRegex },
            ],
        }).select('_id firstName lastName userName').sort({ firstName: 1, lastName: 1 }).limit(20).lean().exec();
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new NotFoundException('User not found');
        }

        const updates: Partial<UpdateProfileDto> = {};

        if (dto.firstName !== undefined) {
            updates.firstName = dto.firstName.trim();
        }

        if (dto.lastName !== undefined) {
            updates.lastName = dto.lastName.trim();
        }

        if (dto.userName !== undefined) {
            updates.userName = dto.userName.trim().toLowerCase();

            const existingUser = await this.userModel.exists({
                userName: updates.userName,
                _id: { $ne: new Types.ObjectId(userId) },
            });

            if (existingUser) {
                throw new ConflictException('Username is already taken');
            }
        }

        if (Object.keys(updates).length === 0) {
            throw new BadRequestException('No profile changes provided');
        }

        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                    userId,
                    { $set: updates },
                    { returnDocument: 'after', runValidators: true }
                ).select('-passwordHash -tokenVersion').lean().exec();

            if (!updatedUser) {
                throw new NotFoundException('User not found');
            }

            return updatedUser;
        } catch (error) {
            if ( error instanceof Error && 'code' in error && error.code === 11000 ) {
                throw new ConflictException('Username is already taken');
            }

            throw error;
        }
    }

    async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new NotFoundException('User not found');
        }

        const updates: Record<string, unknown> = {};

        if (dto.appearance !== undefined) {
            updates['preferences.appearance'] = dto.appearance;
        }

        if (dto.timezone !== undefined) {
            try {
                new Intl.DateTimeFormat('en-US', {
                    timeZone: dto.timezone,
                });
            } catch {
                throw new BadRequestException('Invalid timezone');
            }

            updates['preferences.timezone'] = dto.timezone;
        }

        if (dto.inAppNotifications !== undefined) {
            updates['preferences.inAppNotifications'] = dto.inAppNotifications;
        }

        if (dto.emailNotifications !== undefined) {
            updates['preferences.emailNotifications'] = dto.emailNotifications;
        }

        if (dto.commentNotifications !== undefined) {
            updates['preferences.commentNotifications'] = dto.commentNotifications;
        }

        if (dto.showChatHistoryToNewMembers !== undefined) {
            updates['preferences.showChatHistoryToNewMembers'] = dto.showChatHistoryToNewMembers;
        }

        if (Object.keys(updates).length === 0) {
            throw new BadRequestException('No preference changes provided');
        }

        const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                { $set: updates },
                { returnDocument: 'after', runValidators: true }
            ).select('-passwordHash -tokenVersion').lean().exec();

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        return updatedUser;
    }

    async deleteAccount(userId: string, currentPassword: string) {
        return this.accountDeletionService.deleteAccount( userId, currentPassword,);
    }

}
