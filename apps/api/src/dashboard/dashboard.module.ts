import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module.js';
import { DashboardController } from './dashboard.controller.js';

import { DashboardService } from './dashboard.service.js';
import {AuthModule} from "../auth/auth.module.js";
import {TasksModule} from "../tasks/tasks.module.js";

import {ActivityModule} from "../activity/activity.module.js";

@Module({
    imports: [
        AuthModule,
        ProjectsModule,
        TasksModule,
        ActivityModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}

