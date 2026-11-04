import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';

import { ProjectsModule } from './projects/projects.module.js';
import { ProjectMembersModule } from './project-members/project-members.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';

import { TasksModule } from './tasks/tasks.module.js';
import { ActivityModule } from './activity/activity.module.js';
import { InvitationsModule } from './invitations/invitation.module.js';

import { SprintsModule } from './sprints/sprint.module.js';
import { CommentsModule } from './comments/comment.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ProjectsModule,
    ProjectMembersModule,
    DashboardModule,
    TasksModule,
    ActivityModule,
    InvitationsModule,
    SprintsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
