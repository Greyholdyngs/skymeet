import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schema/project.schema.js';

import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { ProjectMember, ProjectMemberSchema,} from '../project-members/schemas/project-member.schema.js';

import { Task, TaskSchema } from '../tasks/schema/task.schema.js';
import { Sprint, SprintSchema } from '../sprints/schemas/sprint.schema.js';
import { Invitation, InvitationSchema,} from '../invitations/schemas/invitation.schema.js';

import { Comment as ProjectComment, CommentSchema} from '../comments/schemas/comment.schema.js';
import { Meeting, MeetingSchema } from '../meetings/schemas/meeting.schema.js';
import { Activity, ActivitySchema } from '../activity/schemas/activity.schema.js';

import { Notification, NotificationSchema} from '../notifications/schemas/notification.schema.js';
import { AuthModule } from '../auth/auth.module.js';
import { ProjectMembersModule } from '../project-members/project-members.module.js';

import { ActivityModule } from '../activity/activity.module.js';

@Module({
    imports: [
        AuthModule,
        ProjectMembersModule,
        ActivityModule,
        MongooseModule.forFeature([
            { name: Project.name, schema: ProjectSchema },
            { name: ProjectMember.name, schema: ProjectMemberSchema },
            { name: Task.name, schema: TaskSchema },
            { name: Sprint.name, schema: SprintSchema },
            { name: Invitation.name, schema: InvitationSchema },
            { name: ProjectComment.name, schema: CommentSchema },
            { name: Meeting.name, schema: MeetingSchema },
            { name: Activity.name, schema: ActivitySchema },
            { name: Notification.name, schema: NotificationSchema },
        ]),
    ],
    controllers: [ProjectsController],
    providers: [ProjectsService],
    exports: [ProjectsService],
})
export class ProjectsModule {}
