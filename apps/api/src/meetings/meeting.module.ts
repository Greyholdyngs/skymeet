import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Meeting, MeetingSchema } from './schemas/meeting.schema.js';

import { MeetingService } from './meeting.service.js';
import { MeetingController } from './meeting.controller.js';
import { ProjectsModule } from '../projects/projects.module.js';

import { ProjectMembersModule } from '../project-members/project-members.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsModule } from '../notifications/notification.module.js';

import { User, UserSchema } from '../auth/schemas/user.schema.js';

@Module({
    imports: [
        AuthModule,
        NotificationsModule,
        MongooseModule.forFeature([
            { name: Meeting.name, schema: MeetingSchema },
            { name: User.name, schema: UserSchema },
        ]),
        ProjectsModule,
        ProjectMembersModule,
    ],
    controllers: [MeetingController],
    providers: [MeetingService],
    exports: [MeetingService],
})
export class MeetingModule {}
