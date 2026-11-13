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
import { MlsModule } from './mls/mls.module.js';

import { DevicesModule } from './devices/device.module.js';
import { MeetingModule } from './meetings/meeting.module.js';
import { UsersModule } from './users/users.module.js';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
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
    MlsModule,
    DevicesModule,
    MeetingModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, { provide: APP_GUARD, useClass: ThrottlerGuard,},
  ],
})
export class AppModule {}
