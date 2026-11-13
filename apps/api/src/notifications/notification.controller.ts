import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { NotificationService } from './notification.service.js';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @Get()
    findForUser( @Req() req: any, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
                 @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number) {

        return this.notificationService.findForUser(
            new Types.ObjectId(req.user.sub),
            page,
            limit,
        );
    }

    @Get('unread-count')
    getUnreadCount(@Req() req: any) {
        return this.notificationService.getUnreadCount( new Types.ObjectId(req.user.sub) );
    }

    @Patch('read-all')
    markAllAsRead(@Req() req: any) {
        return this.notificationService.markAllAsRead( new Types.ObjectId(req.user.sub) );
    }

    @Patch(':notificationId/read')
    markAsRead( @Req() req: any, @Param('notificationId') notificationId: string, ) {
        return this.notificationService.markAsRead(
            notificationId,
            new Types.ObjectId(req.user.sub),
        );
    }
}