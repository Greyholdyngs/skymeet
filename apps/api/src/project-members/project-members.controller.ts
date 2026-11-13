import { Controller, Get, NotFoundException, Param, Req, UseGuards,Delete } from '@nestjs/common';
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

    @Delete('me')
    async leaveProject( @Param('projectId') projectId: string, @Req() request: AuthRequest, ) {
        if (!Types.ObjectId.isValid(projectId)) {
            throw new NotFoundException('Project not found');
        }

        return this.projectMembersService.leaveProject(
            new Types.ObjectId(projectId),
            new Types.ObjectId(request.user.sub),
        );
    }

    @Delete(':memberUserId')
    async removeMember( @Param('projectId') projectId: string, @Param('memberUserId') memberUserId: string,
                        @Req() request: AuthRequest, ) {
                            
        if ( !Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(memberUserId) ) {
            throw new NotFoundException('Project or member not found');
        }

        return this.projectMembersService.removeMember(
            new Types.ObjectId(projectId),
            new Types.ObjectId(request.user.sub),
            new Types.ObjectId(memberUserId),
        );
    }
}
