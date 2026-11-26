import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comment.service.js';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto.js';

import { CreateCommentDto } from './dto/create-comment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

interface AuthenticatedRequest {
    user: { sub: string };
}

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
    ) {}

    @Get('projects/:projectId/comments')
    async findDiscussion( @Param('projectId') projectId: string, @Query() query: GetCommentsQueryDto,
                        @Req() request: AuthenticatedRequest, ) {
        return this.commentsService.findDiscussion(
            projectId,
            request.user.sub,
            query.taskId,
            query.page,
            query.limit,
        );
    }

    @Post('projects/:projectId/comments')
    async createComment( @Param('projectId') projectId: string, @Body() dto: CreateCommentDto,
                        @Req() request: AuthenticatedRequest, ) {
        return this.commentsService.createComment(
            projectId,
            request.user.sub,
            dto,
        );
    }
}

