import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

import type { AuthRequest } from '../auth/types/auth-request.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

import { ReviewTaskDto } from './dto/review-task.dto.js';
import { TaskService } from './task.service.js'
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto.js';

@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(
        private readonly tasksService: TaskService,
    ) {}

    @Post()
    async create( @Param('projectId') projectId: string, @Body() dto: CreateTaskDto, @Req() request: AuthRequest ) {
        const userId = new Types.ObjectId(request.user.sub);
        return this.tasksService.create( projectId, userId, dto );
    }

    @Get()
    async findByProject( @Param('projectId') projectId: string, @Req() request: AuthRequest ) {
        const userId = new Types.ObjectId(request.user.sub);
        return this.tasksService.findByProject( projectId, userId, );
    }

    @Patch(':taskId')
    async update( @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Body() dto: UpdateTaskDto,
        @Req() request: AuthRequest ) {

        const userId = new Types.ObjectId(request.user.sub);
        return this.tasksService.update( projectId, taskId, userId, dto, );
    }

    @Patch(':taskId/start')
    async startTask( @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Req() request: AuthRequest, ) {
        return this.tasksService.startTask(
            projectId,
            taskId,
            new Types.ObjectId(request.user.sub),
        );
    }

    @Patch(':taskId/submit-review')
    async submitForReview( @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Req() request: AuthRequest, ) {
        return this.tasksService.submitForReview(
            projectId,
            taskId,
            new Types.ObjectId(request.user.sub),
        );
    }

    @Patch(':taskId/review')
    async reviewTask( @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Body() dto: ReviewTaskDto,
                        @Req() request: AuthRequest,) {
        return this.tasksService.reviewTask(
            projectId,
            taskId,
            new Types.ObjectId(request.user.sub),
            dto,
        );
    }

    @Delete(':taskId')
    async delete( @Param('projectId') projectId: string, @Param('taskId') taskId: string, @Req() request: AuthRequest ) {
        const userId = new Types.ObjectId(request.user.sub);

        return this.tasksService.delete( projectId, taskId, userId,
        );
    }

    @Patch(':taskId/return-to-progress')
    async returnToProgress( @Param('projectId') projectId: string, @Param('taskId') taskId: string,
                            @Req() request: AuthRequest, ) {
        return this.tasksService.returnToProgress(
            projectId,
            taskId,
            new Types.ObjectId(request.user.sub),
        );
    }

    @Patch(':taskId/custom-fields/:fieldId')
    async updateCustomField( @Param('projectId') projectId: string, @Param('taskId') taskId: string,
                            @Param('fieldId') fieldId: string, @Body() dto: UpdateCustomFieldDto,
                            @Req() request: AuthRequest, ) {

        return this.tasksService.updateCustomField(
            projectId,
            taskId,
            fieldId,
            new Types.ObjectId(request.user.sub),
            dto,
        );
    }
}
