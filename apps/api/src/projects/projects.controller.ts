import { Body, Controller, Get, Param, Delete,  Patch, Post, Req, NotFoundException, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateProjectDto } from './dto/create.project.dto.js';

import { ProjectsService } from './projects.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthRequest } from '../auth/types/auth-request.js';

import { UpdateProjectDto } from './dto/update.project.dto.js';
import { ProjectMembersService } from '../project-members/project-members.service.js';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly projectMembersService: ProjectMembersService,
    ) {}

    @Post()
    async createProject( @Body() body: CreateProjectDto, @Req() request: AuthRequest ) {
        const ownerId = new Types.ObjectId(request.user.sub);

        const project = await this.projectsService.create(
            body.name,
            body.description ?? '',
            ownerId,
        );

        await this.projectMembersService.createOwner( project._id, ownerId );
        return project;
    }

    @Get()
    async getProjects( @Req() request: AuthRequest ) {
        const ownerId = new Types.ObjectId(request.user.sub);

        return this.projectsService.findByOwner(ownerId);
    }

    @Get(':id')
    async getProject( @Param('id') id: string, @Req() request: AuthRequest ) {
        const ownerId = new Types.ObjectId(request.user.sub);

        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Project not found');
        }

        const project = await this.projectsService.findById(
            new Types.ObjectId(id),
            ownerId,
        );

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    @Patch(':id')
    async updateProject( @Param('id') id: string, @Body() body: UpdateProjectDto, @Req() request: AuthRequest ) {
        const ownerId = new Types.ObjectId(request.user.sub);

        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Project not found');
        }

        const project = await this.projectsService.update(
            new Types.ObjectId(id),
            ownerId,
            body,
        );

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    @Delete(':id')
    async deleteProject( @Param('id') id: string, @Req() request: AuthRequest ) {
        const ownerId = new Types.ObjectId(request.user.sub);

        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Project not found');
        }

        const project = await this.projectsService.delete(
            new Types.ObjectId(id),
            ownerId,
        );

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return {
            message: 'Project deleted successfully',
        };
    }
}