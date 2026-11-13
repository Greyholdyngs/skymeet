import { Controller, Body, Post, HttpCode, HttpStatus, Get, Req, Res,  UseGuards, Patch} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto.js';
import { AuthService } from './auth.service.js';

import { VerifyOtpDto } from './dto/verify-otp-dto.js';
import { ResendOtpDto } from './dto/resend-otp.dto.js';
import { LoginDto } from './dto/login.dto.js';

import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import type { AuthRequest } from './types/auth-request.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto.js';

import { RequestEmailChangeDto } from './dto/request-email-change.dto.js';
import { VerifyEmailChangeDto } from './dto/verify-email-change.dto.js';
import { Throttle } from '@nestjs/throttler';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('signup')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('verify-otp')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto);
    }

    @Post('resend-otp')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    resendOtp(@Body() resendOtpDto: ResendOtpDto) {
        return this.authService.resendOtp(resendOtpDto);
    }

    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    async login( @Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.login(loginDto);

        response.cookie('skymeet_access_token', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.skymeet.greyholdyngs.com' : undefined,
            maxAge: 9 * 60 * 60 * 1000,
            path: '/',
        });

        return result;
    }

    @Post('forgot-password')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getCurrentUser(@Req() request: AuthRequest) {
        return this.authService.getCurrentUser(request.user.sub);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('skymeet_access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.skymeet.greyholdyngs.com' : undefined,
            path: '/',
        });

        return {
            message: 'Logout successful',
        };
    }

    @Patch('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword( @Req() request: AuthRequest, @Body() dto: ChangePasswordDto,
                         @Res({ passthrough: true }) response: Response ) {

        const result = await this.authService.changePassword( request.user.sub, dto,
        );

        response.clearCookie('skymeet_access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.skymeet.greyholdyngs.com' : undefined,
            path: '/',
        });

        return result;
    }

    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logoutAll( @Req() request: AuthRequest, @Res({ passthrough: true }) response: Response ) {
        const result = await this.authService.logoutAll(request.user.sub);

        response.clearCookie('skymeet_access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.skymeet.greyholdyngs.com' : undefined,
            path: '/',
        });

        return result;
    }

    @Post('request-email-change')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    requestEmailChange( @Req() request: AuthRequest, @Body() dto: RequestEmailChangeDto, ) {
        return this.authService.requestEmailChange(
            request.user.sub,
            dto,
        );
    }

    @Post('verify-email-change')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async verifyEmailChange( @Req() request: AuthRequest, @Body() dto: VerifyEmailChangeDto,
                                @Res({ passthrough: true }) response: Response ) {

        const result = await this.authService.verifyEmailChange( request.user.sub, dto,);

        response.clearCookie('skymeet_access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.skymeet.greyholdyngs.com' : undefined,
            path: '/',
        });

        return result;
    }
}