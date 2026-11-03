import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthRequest } from '../auth/types/auth-request.js';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
    ) {}

    @Get('summary')
    async getSummary(@Req() request: AuthRequest) {
        const userId = new Types.ObjectId(request.user.sub);

        return this.dashboardService.getSummary(userId);
    }
}
