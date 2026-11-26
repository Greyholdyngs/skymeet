import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthRequest } from '../auth/types/auth-request.js';

import { UsersService } from './users.service.js';
import { ProjectMembersService } from '../project-members/project-members.service.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersDirectoryController {
    constructor(
        private readonly usersService: UsersService,
        private readonly projectMembersService: ProjectMembersService,
    ) {}

    @Get('directory')
    async searchUsers( @Req() req: AuthRequest, @Query('q') query: string, @Query('type') type?: string,) {
        return this.usersService.searchUsers(
            req.user.sub,
            query || '',
            type,
        );
    }

    @Get('people')
    async getWorkspacePeople(@Req() req: AuthRequest) {
        return this.projectMembersService.getWorkspacePeople(req.user.sub,);
    }
}