import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module.js';

import { ProjectMembersModule } from '../project-members/project-members.module.js';
import { Comment, CommentSchema } from './schemas/comment.schema.js';
import { CommentsService } from './comment.service.js';

import { CommentsGateway } from './comment.gateway.js';
import { Task, TaskSchema } from '../tasks/schema/task.schema.js';
import { CommentsController } from './comment.controller.js';

import { NotificationsModule } from '../notifications/notification.module.js';

@Module({
    imports: [
        AuthModule,
        ProjectMembersModule,
        NotificationsModule,
        MongooseModule.forFeature([
            {
                name: Comment.name,
                schema: CommentSchema,
            },
            {
                name: Task.name,
                schema: TaskSchema,
            },
        ]),
    ],
    controllers: [CommentsController],
    providers: [ CommentsService, CommentsGateway,],
    exports: [ CommentsService ],
})
export class CommentsModule {}
