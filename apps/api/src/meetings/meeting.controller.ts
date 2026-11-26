import { Types } from 'mongoose';
import type { AuthRequest } from '../auth/types/auth-request.js';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { MeetingService } from './meeting.service.js';
import { CreateMeetingDto } from './dto/create-meeting.dto.js';
import { UpdateMeetingDto } from './dto/update-meeting.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller()
@UseGuards(JwtAuthGuard)
export class MeetingController {
    constructor(
        private readonly meetingService: MeetingService,
    ) {}

    @Post('meetings')
    create(@Req() req: AuthRequest, @Body() dto: CreateMeetingDto) {
        return this.meetingService.create(
            new Types.ObjectId(req.user.sub),
            dto,
        );
    }

    @Get('meetings')
    findAll(@Req() req: AuthRequest) {
        return this.meetingService.findAll( new Types.ObjectId(req.user.sub) );
    }

    @Get('projects/:projectId/meetings')
    findByProject( @Param('projectId') projectId: string, @Req() req: AuthRequest, ) {
        return this.meetingService.findByProject(
            projectId,
            new Types.ObjectId(req.user.sub),
        );
    }

    @Get('meetings/:meetingId')
    findOne( @Param('meetingId') meetingId: string, @Req() req: AuthRequest ) {

        return this.meetingService.findOne(
            meetingId,
            new Types.ObjectId(req.user.sub),
        );
    }

    @Patch('meetings/:meetingId')
    update( @Param('meetingId') meetingId: string, @Req() req: AuthRequest, @Body() dto: UpdateMeetingDto ) {
        return this.meetingService.update(
            meetingId,
            new Types.ObjectId(req.user.sub),
            dto,
        );
    }

    @Patch('meetings/:meetingId/respond')
    respond( @Param('meetingId') meetingId: string, @Req() req: AuthRequest, @Body('response') response: 'accepted' | 'declined' ) {
        return this.meetingService.respond(
            meetingId,
            new Types.ObjectId(req.user.sub),
            response,
        );
    }

    @Delete('meetings/:meetingId')
    cancel( @Param('meetingId') meetingId: string, @Req() req: AuthRequest ) {
        return this.meetingService.cancel(
            meetingId,
            new Types.ObjectId(req.user.sub),
        );
    }
}

