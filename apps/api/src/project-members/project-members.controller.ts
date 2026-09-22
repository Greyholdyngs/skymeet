import { Controller, Get, NotFoundException, Param, Req, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import type { AuthRequest } from '../auth/types/auth-request.js';
import { ProjectMembersService } from './project-members.service.js';


@Controller('projects/:projectId/members')
@UseGuards(JwtAuthGuard)
export class ProjectMembersController {
    constructor(
        private readonly projectMembersService: ProjectMembersService,
    ) {}

    @Get()
    async getMembers( @Param('projectId') projectId: string, @Req() request: AuthRequest ) {
        const userId = new Types.ObjectId(request.user.sub);

        if (!Types.ObjectId.isValid(projectId)) {
            throw new NotFoundException('Project not found');
        }

        const projectObjectId = new Types.ObjectId(projectId);

        const hasAccess = await this.projectMembersService.canAccessProject( projectObjectId, userId );

        if (!hasAccess) {
            throw new NotFoundException('Project not found');
        }

        return this.projectMembersService.findByProject( projectObjectId );
    }
}
