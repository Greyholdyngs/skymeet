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

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        private readonly otpService: OtpService,
        private readonly jwtService: JwtService,
    ) {}

    async signup(signupDto: SignupDto) {
        const {
            firstName,
            lastName,
            userName,
            email,
            password,
            confirmPassword,
        } = signupDto;

        if (password !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const existingEmail = await this.userModel.findOne({ email });

        if (existingEmail) {
            throw new ConflictException('Email is already registered');
        }

        const existingUserName = await this.userModel.findOne({ userName });

        if (existingUserName) {
            throw new ConflictException('Username is already taken');
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await this.userModel.create({
            firstName,
            lastName,
            userName,
            email,
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
        const user = await this.userModel.findOne({ email: resendOtpDto.email, });

        if (!user) {
            throw new BadRequestException( 'Invalid verification request');
        }

        if (resendOtpDto.purpose === 'email_verification' && user.isEmailVerified ) {
            throw new BadRequestException('Email is already verified');
        }

        const otpRecord = await this.otpService.getOtpRecord(
            user._id,
        );

        if (otpRecord) {
            const now = new Date();

            if (now < otpRecord.resendAvailableAt) {
            const remainingSeconds = Math.ceil(
                (otpRecord.resendAvailableAt.getTime() - now.getTime()) /
                1000,
            );

            throw new BadRequestException(
                `Please wait ${remainingSeconds} seconds before requesting a new code.`,
            );
            }
        }

        await this.otpService.createAndSendOtp(
            user._id,
            user.email,
            resendOtpDto.purpose,
        );

        return {
            message: 'A new verification code has been sent.',
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.userModel.findOne({
            email: loginDto.email,
        });

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
        const user = await this.userModel.findOne({email: forgotPasswordDto.email});

        if (user) {
            await this.otpService.createAndSendOtp(
                user._id,
                user.email,
                'password_reset',
            );
        }

        return {
            message:'If an account exists for this email, a reset code has been sent.',
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const user = await this.userModel.findOne({email: resetPasswordDto.email});

        if (!user) {
            throw new BadRequestException('Invalid password reset request');
        }

        await this.otpService.verifyPasswordResetOtp( user._id, resetPasswordDto.otp );

        const passwordHash = await bcrypt.hash(
            resetPasswordDto.newPassword,
            12,
        );

        user.passwordHash = passwordHash;
        await user.save();

        await this.otpService.deleteOtp(user._id);

        return {
            message: 'Password reset successful',
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
}

