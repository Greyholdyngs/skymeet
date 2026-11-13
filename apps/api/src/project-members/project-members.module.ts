import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectMember, ProjectMemberSchema } from './schemas/project-member.schema.js';

import { ProjectMembersService } from './project-members.service.js';
import { ProjectMembersController } from './project-members.controller.js';
import { Project, ProjectSchema } from '../projects/schema/project.schema.js';

import { User, UserSchema } from '../auth/schemas/user.schema.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            {
                name: ProjectMember.name,
                schema: ProjectMemberSchema,
            },
            {
                name: Project.name,
                schema: ProjectSchema,
            },
            {
                name: User.name,
                schema: UserSchema,
            }
        ]),
    ],
    controllers: [ProjectMembersController],
    providers: [ProjectMembersService],
    exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
