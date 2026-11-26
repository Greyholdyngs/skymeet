import { Body,Get, Controller, Param, Post, Req, UseGuards, BadRequestException} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { CreateInvitationDto } from './dto/create-invitation.dto.js';
import { InvitationsService } from './invitations.service.js';
import { RespondToInvitationDto } from './dto/respond-to-invitation.dto.js';

interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
        email: string;
    };
}

@Controller()
export class InvitationsController {
    constructor(
        private readonly invitationsService: InvitationsService,
    ) {}

    @Post('projects/:projectId/invitations')
    @UseGuards(JwtAuthGuard)
    async createInvitation( @Param('projectId') projectId: string, @Body() dto: CreateInvitationDto,
                             @Req() request: AuthenticatedRequest ) {

        return this.invitationsService.createInvitation(
            projectId,
            request.user.sub,
            dto,
        );
    }

    @Get('projects/:projectId/invitations/pending')
    @UseGuards(JwtAuthGuard)
    async getPendingInvitation( @Param('projectId') projectId: string, @Req() request: AuthenticatedRequest, ) {

        return this.invitationsService.getPendingInvitation(
            projectId,
            request.user.sub,
            request.user.email,
        );
    }

    @Post('invitations/respond')
    @UseGuards(JwtAuthGuard)
    async respondToInvitation( @Body() dto: RespondToInvitationDto, @Req() request: AuthenticatedRequest,) {
        if (dto.invitationId) {
            return this.invitationsService.respondToInvitationById(
                dto.invitationId,
                dto.action,
                request.user.sub,
                request.user.email,
            );
        }

        if (!dto.token) {
            throw new BadRequestException('An invitation token or ID is required.');
        }

        if (dto.action === 'accept') {
            return this.invitationsService.acceptInvitation(
                dto.token,
                request.user.sub,
                request.user.email,
            );
        }

        return this.invitationsService.declineInvitation(
            dto.token,
            request.user.sub,
            request.user.email,
        );
    }

    @Get('projects/:projectId/people')
    @UseGuards(JwtAuthGuard)
    async getProjectPeople( @Param('projectId') projectId: string, @Req() request: AuthenticatedRequest ) {
        return this.invitationsService.getProjectPeople(
            projectId,
            request.user.sub,
        );
    }
}
