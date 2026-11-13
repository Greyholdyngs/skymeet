import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module.js';

import { ProjectsModule } from '../projects/projects.module.js';
import { ProjectMembersModule } from '../project-members/project-members.module.js';
import { Task, TaskSchema } from './schema/task.schema.js';

import { TasksController } from './tasks.controller.js';
import { TaskService } from './task.service.js';
import { ActivityModule } from '../activity/activity.module.js';

import { Sprint, SprintSchema } from '../sprints/schemas/sprint.schema.js';
import { NotificationsModule } from '../notifications/notification.module.js';

@Module({
    imports: [
        AuthModule,
        ProjectsModule,
        ProjectMembersModule,
        ActivityModule,
        NotificationsModule,
        MongooseModule.forFeature([ 
            { 
                name: Task.name, 
                schema: TaskSchema 
            },
            {
                name: Sprint.name,
                schema: SprintSchema,
            }
         ]),
    ],
    controllers: [TasksController],
    providers: [TaskService],
    exports: [TaskService],
})
export class TasksModule {}
