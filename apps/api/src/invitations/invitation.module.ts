import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module.js';

import { ProjectMembersModule } from '../project-members/project-members.module.js';
import { Invitation, InvitationSchema } from './schemas/invitation.schema.js';
import { User, UserSchema } from '../auth/schemas/user.schema.js';

import { InvitationsService } from './invitations.service.js';
import { InvitationsController } from './invitations.controller.js';
import { Project, ProjectSchema } from '../projects/schema/project.schema.js';

import { NotificationsModule } from '../notifications/notification.module.js';

@Module({
    imports: [
        AuthModule,
        ProjectMembersModule,
        NotificationsModule,
        MongooseModule.forFeature([
            {
                name: Invitation.name,
                schema: InvitationSchema,
            },
            { 
                name: User.name, 
                schema: UserSchema 
            },
            {
                name: Project.name,
                schema: ProjectSchema,
            },
        ]),
    ],
    providers: [InvitationsService],
    controllers: [InvitationsController],
    exports: [MongooseModule],
})
export class InvitationsModule {}
