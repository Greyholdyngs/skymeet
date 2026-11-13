import { Controller, Get, Param, Query, Req, UseGuards, BadRequestException, NotFoundException} from '@nestjs/common';
import { Types } from 'mongoose';
import { ActivityService } from './activity.service.js';

import { ProjectMembersService } from '../project-members/project-members.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthRequest } from '../auth/types/auth-request.js';

@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
    constructor(
        private readonly activityService: ActivityService,
        private readonly projectMembersService: ProjectMembersService,
    ) {}

    @Get()
    async getActivity( @Req() request: AuthRequest, @Query('page') pageQuery?: string, @Query('limit') limitQuery?: string ) {
        const userId = new Types.ObjectId(request.user.sub);
        const { page, limit } = this.getPagination(pageQuery, limitQuery);

        const projectIds =
            await this.projectMembersService.findAccessibleProjectIds(userId);

        return this.activityService.findForProjects(projectIds, page, limit);
    }

    @Get('projects/:projectId')
    async getProjectActivity( @Param('projectId') projectId: string, @Req() request: AuthRequest,
                                 @Query('page') pageQuery?: string, @Query('limit') limitQuery?: string, ) {

        if (!Types.ObjectId.isValid(projectId)) {
            throw new NotFoundException('Project not found.');
        }

        const userId = new Types.ObjectId(request.user.sub);
        const projectObjectId = new Types.ObjectId(projectId);
        const hasAccess = await this.projectMembersService.canAccessProject( projectObjectId, userId,);

        if (!hasAccess) {
            throw new NotFoundException('Project not found.');
        }

        const { page, limit } = this.getPagination(pageQuery, limitQuery);

        return this.activityService.findForProjects(
            [projectObjectId],
            page,
            limit,
        );
    }

    private getPagination( pageQuery?: string, limitQuery?: string, ): { page: number; limit: number } {
        const page = pageQuery === undefined ? 1 : Number(pageQuery);
        const limit = limitQuery === undefined ? 20 : Number(limitQuery);

        if ( !Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100 ) {
            throw new BadRequestException('Invalid pagination parameters.');
        }

        return { page, limit };
    }
}
