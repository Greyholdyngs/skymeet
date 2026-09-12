import {BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';

import { Model, Types } from 'mongoose';
import { EmailService } from './email.service.js';
import { Otp, OtpDocument } from '../schemas/otp.schema.js';
import { User, UserDocument } from '../schemas/user.schema.js';
//import { VerifyOtpDto } from '../dto/verify-otp-dto.js';

@Injectable()
export class OtpService {
    constructor(
        @InjectModel(Otp.name)
        private readonly otpModel: Model<OtpDocument>,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        private readonly emailService: EmailService,
    ) {}

    private generateOtp(): string {
        return randomInt(100000, 1000000).toString();
    }

    async createAndSendOtp( userId: Types.ObjectId, email: string, purpose: 'email_verification' | 'password_reset' ): Promise<void> {
        const otp = this.generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        const now = new Date();

        const expiresAt = new Date(now.getTime() + 60 * 1000,);

        const resendAvailableAt = new Date(now.getTime() + 30 * 1000,);

        await this.otpModel.findOneAndUpdate(
            { userId },
            {
                otpHash,
                purpose,
                expiresAt,
                attempts: 0,
                resendAvailableAt,
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            },
        );

        const subject = purpose === 'email_verification' ? 'Your SkyMeet verification code' : 'Your SkyMeet password reset code';

        const html = purpose === 'email_verification'
            ? `
                <h2>Verify your SkyMeet account</h2>
                <p>Your verification code is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 1 minute.</p>
                <p>If you did not create this account, you can ignore this email.</p>
            `
            : `
                <h2>Reset your SkyMeet password</h2>
                <p>Your password reset code is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 1 minute.</p>
                <p>If you did not request a password reset, you can ignore this email.</p>
            `;

        await this.emailService.sendEmail(
            email,
            subject,
            html,
        );
    }

    async verifyOtp( email: string, otp: string ): Promise<void> {
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new BadRequestException('Invalid verification request');
        }

        if (user.isEmailVerified) {
            throw new BadRequestException('Email is already verified');
        }

        const otpRecord = await this.otpModel.findOne({userId: user._id, purpose: 'email_verification', });

        if (!otpRecord) {
            throw new BadRequestException('Verification code not found. Please request a new code.');
        }

        if (new Date() > otpRecord.expiresAt) {
            await this.otpModel.deleteOne({_id: otpRecord._id});
            throw new BadRequestException('Verification code has expired. Please request a new code.');
        }

        if (otpRecord.attempts >= 5) {
            throw new BadRequestException('Maximum verification attempts reached. Please request a new code.');
        }

        const isValid = await bcrypt.compare(otp, otpRecord.otpHash,);

        if (!isValid) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            const remainingAttempts = 5 - otpRecord.attempts;

            if (remainingAttempts === 0) {
                throw new BadRequestException('Maximum verification attempts reached. Please request a new code.');
            }

            throw new BadRequestException(`Invalid verification code. ${remainingAttempts} attempts remaining.`);
        }

        user.isEmailVerified = true;
        await user.save();

        await this.otpModel.deleteOne({_id: otpRecord._id});
    }

    async getOtpRecord(userId: Types.ObjectId) {
        return this.otpModel.findOne({ userId,});
    }

    async verifyPasswordResetOtp( userId: Types.ObjectId, otp: string ): Promise<void> {
        const otpRecord = await this.otpModel.findOne({ userId, purpose: 'password_reset' });

        if (!otpRecord) {
            throw new BadRequestException('Invalid password reset request');
        }

        if (new Date() > otpRecord.expiresAt) {
            await this.otpModel.deleteOne({ _id: otpRecord._id,});
            throw new BadRequestException('Reset code has expired. Please request a new code.' );
        }

        if (otpRecord.attempts >= 5) {
            throw new BadRequestException('Maximum reset attempts reached. Please request a new code.');
        }

        const isValid = await bcrypt.compare( otp, otpRecord.otpHash );

        if (!isValid) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            const remainingAttempts = 5 - otpRecord.attempts;

            if (remainingAttempts === 0) {
                throw new BadRequestException('Maximum reset attempts reached. Please request a new code.');
            }

            throw new BadRequestException(`Invalid reset code. ${remainingAttempts} attempts remaining.`);
        }

    }

    async deleteOtp(userId: Types.ObjectId) {
        await this.otpModel.deleteOne({
            userId,
            purpose: 'password_reset',
        });
    }
}