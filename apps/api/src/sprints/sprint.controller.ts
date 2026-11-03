import { Body, Controller, Get, Post, Param, Req, UseGuards, Patch } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import { SprintsService } from './sprint.service.js';
import { CreateSprintDto } from './dto/create-sprint.dto.js';
import { UpdateSprintDto } from './dto/update-sprint.dto.js';

interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
        email: string;
    };
}

@Controller('projects/:projectId/sprints')
@UseGuards(JwtAuthGuard)
export class SprintsController {
    constructor(
        private readonly sprintsService: SprintsService,
    ) {}

    @Post()
    async createSprint( @Param('projectId') projectId: string, @Body() dto: CreateSprintDto, @Req() request: AuthenticatedRequest ) {
        return this.sprintsService.createSprint(
            projectId,
            request.user.sub,
            dto,
        );
    }

    @Get()
    async findProjectSprints( @Param('projectId') projectId: string, @Req() request: AuthenticatedRequest ) {
        return this.sprintsService.findProjectSprints(
            projectId,
            request.user.sub,
        );
    }

    @Patch(':sprintId')
    updateSprint( @Param('projectId') projectId: string, @Param('sprintId') sprintId: string, @Body() dto: UpdateSprintDto,
                 @Req() request: AuthenticatedRequest ) {
        return this.sprintsService.updateSprint(
            projectId,
            sprintId,
            request.user.sub,
            dto,
        );
    }
}
