import { Body, Controller, Post, Req, UseGuards, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { DevicesService } from './device.service.js';

import { RegisterDeviceDto } from './dto/register-device.dto.js';
import { UploadKeyPackageDto } from './dto/upload-key-package.dto.js';
import { CompleteDeviceEnrollmentDto } from './dto/complete-device-enrollment.dto.js';

interface AuthenticatedRequest {
    user: { sub: string; };
}

@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
    constructor(
        private readonly devicesService: DevicesService,
    ) {}

    @Post('register')
    async registerDevice( @Body() dto: RegisterDeviceDto, @Req() request: AuthenticatedRequest, ) {
        return this.devicesService.registerDevice(
            request.user.sub,
            dto,
        );
    }

    @Get()
    async getUserDevices( @Req() request: AuthenticatedRequest ) {
        return this.devicesService.getUserDevices(
            request.user.sub,
        );
    }

    @Post(':deviceId/revoke')
    async revokeDevice( @Param('deviceId') deviceId: string, @Req() request: AuthenticatedRequest ) {
        return this.devicesService.revokeDevice(
            request.user.sub,
            deviceId,
        );
    }

    @Post(':deviceId/key-packages')
    async uploadKeyPackage( @Param('deviceId') deviceId: string, @Body() dto: UploadKeyPackageDto,
                            @Req() request: AuthenticatedRequest ) {
        return this.devicesService.uploadKeyPackage(
            request.user.sub,
            deviceId,
            dto,
        );
    }

    @Post(':deviceId/enrollment-challenge')
    async createEnrollmentChallenge( @Param('deviceId') deviceId: string, @Req() request: AuthenticatedRequest ) {
        return this.devicesService.createEnrollmentChallenge(
            request.user.sub,
            deviceId,
        );
    }

    @Post(':deviceId/complete-enrollment')
    async completeDeviceEnrollment( @Param('deviceId') deviceId: string, @Body() dto: CompleteDeviceEnrollmentDto,
                                    @Req() request: AuthenticatedRequest ) {
        return this.devicesService.completeDeviceEnrollment(
            request.user.sub,
            deviceId,
            dto,
        );
    }

    @Get(':deviceId/key-packages')
    async getAvailableKeyPackages( @Param('deviceId') deviceId: string, @Req() request: AuthenticatedRequest ) {
        return this.devicesService.getAvailableKeyPackages(
            request.user.sub,
            deviceId,
        );
    }
}