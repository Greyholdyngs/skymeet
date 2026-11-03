import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sprint, SprintSchema } from './schemas/sprint.schema.js';

import { SprintsService } from './sprint.service.js';
import { SprintsController } from './sprint.controller.js';
import { ProjectMembersModule } from '../project-members/project-members.module.js';

import { AuthModule } from '../auth/auth.module.js';
import { Task, TaskSchema } from '../tasks/schema/task.schema.js';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            {
                name: Sprint.name,
                schema: SprintSchema,
            },
            { 
                name: Task.name, 
                schema: TaskSchema 
            },
        ]),
        ProjectMembersModule,
    ],
    controllers: [SprintsController],
    providers: [SprintsService],
    exports: [SprintsService],
})
export class SprintsModule {}
