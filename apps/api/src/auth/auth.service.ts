import { Injectable, BadRequestException, ConflictException, UnauthorizedException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema.js';
import bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto.js';

import { OtpService } from './services/otp.service.js';
import { VerifyOtpDto } from './dto/verify-otp-dto.js';
import { ResendOtpDto } from './dto/resend-otp.dto.js';

import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';

import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { RequestEmailChangeDto } from './dto/request-email-change.dto.js';

import { VerifyEmailChangeDto } from './dto/verify-email-change.dto.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        private readonly otpService: OtpService,
        private readonly jwtService: JwtService,
    ) {}

    async signup(signupDto: SignupDto) {
        const { firstName, lastName, userName, email, password, confirmPassword, } = signupDto;
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUserName = userName.trim().toLowerCase();

        if (password !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const existingEmail = await this.userModel.findOne({ email: normalizedEmail, });

        if (existingEmail) {
            throw new ConflictException('Email is already registered');
        }

        const existingUserName = await this.userModel.findOne({ userName: normalizedUserName, });

        if (existingUserName) {
            throw new ConflictException('Username is already taken');
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await this.userModel.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            userName: normalizedUserName,
            email: normalizedEmail,
            passwordHash,
        });

        await this.otpService.createAndSendOtp(
            user._id,
            user.email,
            'email_verification',
        );

        return {
            message: 'Account created successfully. Please check your email for the verification code.',
            userId: user._id,
        };
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        await this.otpService.verifyOtp(
            verifyOtpDto.email,
            verifyOtpDto.otp,
        );

        return {
            message: 'Email verified successfully',
        };
    }

    async resendOtp(resendOtpDto: ResendOtpDto) {
        const normalizedEmail = resendOtpDto.email.trim().toLowerCase();

        const user = resendOtpDto.purpose === 'email_change' ? await this.userModel.findOne({ pendingEmail: normalizedEmail })
                                                             : await this.userModel.findOne({ email: normalizedEmail });

        if (!user) {
            throw new BadRequestException('Invalid verification request');
        }

        if ( resendOtpDto.purpose === 'email_verification' && user.isEmailVerified ) {
            throw new BadRequestException('Email is already verified');
        }

        if ( resendOtpDto.purpose === 'email_change' && user.pendingEmail !== normalizedEmail ) {
            throw new BadRequestException('No pending email change request');
        }

        const otpRecord = await this.otpService.getOtpRecord( user._id, resendOtpDto.purpose, );

        if (otpRecord) {
            const now = new Date();

            if (now < otpRecord.resendAvailableAt) {
                const remainingSeconds = Math.ceil( (otpRecord.resendAvailableAt.getTime() - now.getTime()) / 1000, );

                throw new BadRequestException( `Please wait ${remainingSeconds} seconds before requesting a new code.` );
            }
        }

        const targetEmail = resendOtpDto.purpose === 'email_change' ? user.pendingEmail! : user.email;

        await this.otpService.createAndSendOtp(
            user._id,
            targetEmail,
            resendOtpDto.purpose,
        );

        return {
            message: 'A new verification code has been sent.',
        };
    }

    async login(loginDto: LoginDto) {
        const normalizedEmail = loginDto.email.trim().toLowerCase();
        const user = await this.userModel.findOne({ email: normalizedEmail, });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password',);
        }

        if (!user.isEmailVerified) {
            throw new UnauthorizedException('Please verify your email before logging in');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: user._id.toString(),
            email: user.email,
            tokenVersion: user.tokenVersion ?? 0,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
            },
        };
    }
 
    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.userModel.findOne({ email: forgotPasswordDto.email.trim().toLowerCase(),});

        if (user) {
            const otpRecord = await this.otpService.getOtpRecord( user._id, 'password_reset',);
            const now = new Date();

            if (!otpRecord || now >= otpRecord.resendAvailableAt) {
                await this.otpService.createAndSendOtp(
                    user._id,
                    user.email,
                    'password_reset',
                );
            }
        }

        return {
            message: 'If an account exists for this email, a reset code has been sent.',
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const user = await this.userModel.findOne({ email: resetPasswordDto.email.trim().toLowerCase(),});
        if (!user) {
            throw new BadRequestException('Invalid password reset request');
        }

        await this.otpService.verifyPasswordResetOtp( user._id, resetPasswordDto.otp );

        const passwordHash = await bcrypt.hash(
            resetPasswordDto.newPassword,
            12,
        );

        user.passwordHash = passwordHash;
        user.tokenVersion = (user.tokenVersion ?? 0) + 1;
        await user.save();

        await this.otpService.deleteOtp(user._id);

        return {
            message: 'Password reset successful',
        };
    }

    async logoutAll(userId: string) {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User no longer exists');
        }

        user.tokenVersion = (user.tokenVersion ?? 0) + 1;
        await user.save();

        return {
            message: 'Successfully logged out of all devices. Please log in again.',
        };
    }

    async requestEmailChange( userId: string, dto: RequestEmailChangeDto, ) {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User no longer exists');
        }

        const newEmail = dto.newEmail.trim().toLowerCase();

        if (newEmail === user.email) {
            throw new BadRequestException( 'New email must be different from your current email', );
        }

        const existingUser = await this.userModel.findOne({ email: newEmail });

        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }

        const otpRecord = await this.otpService.getOtpRecord( user._id, 'email_change' );

        if (otpRecord) {
            const now = new Date();

            if (now < otpRecord.resendAvailableAt) {
                const remainingSeconds = Math.ceil( (otpRecord.resendAvailableAt.getTime() - now.getTime()) / 1000, );

                throw new BadRequestException( `Please wait ${remainingSeconds} seconds before requesting a new code.` );
            }
        }

        await this.otpService.createAndSendOtp( user._id, newEmail, 'email_change', );
        user.pendingEmail = newEmail;
        await user.save();

        return {
            message: 'A verification code has been sent to your new email address.',
        };
    }

    async verifyEmailChange( userId: string, dto: VerifyEmailChangeDto, ) {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User no longer exists');
        }

        if (!user.pendingEmail) {
            throw new BadRequestException('No pending email change request');
        }

        const existingUser = await this.userModel.findOne({
            email: user.pendingEmail,
            _id: { $ne: user._id },
        });

        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }
        await this.otpService.verifyEmailChangeOtp( user._id, dto.otp );

        user.email = user.pendingEmail;
        user.pendingEmail = null;
        user.tokenVersion = (user.tokenVersion ?? 0) + 1;

        await user.save();

        await this.otpService.deleteEmailChangeOtp(user._id);

        return {
            message: 'Email address changed successfully. Please log in again.',
            email: user.email,
        };
    }

    async getCurrentUser(userId: string) {
        const user = await this.userModel.findById(userId).select('-passwordHash');

        if (!user) {
            throw new UnauthorizedException('User no longer exists');
        }

        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
        };
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        if (dto.newPassword !== dto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User no longer exists');
        }

        const isCurrentPasswordValid = await bcrypt.compare( dto.currentPassword, user.passwordHash );

        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        if (dto.currentPassword === dto.newPassword) {
            throw new BadRequestException( 'New password must be different from current password' );
        }

        user.passwordHash = await bcrypt.hash(dto.newPassword, 12);
        user.tokenVersion = (user.tokenVersion ?? 0) + 1;

        await user.save();

        return {
            message: 'Password changed successfully. Please log in again.',
        };
    }
}

