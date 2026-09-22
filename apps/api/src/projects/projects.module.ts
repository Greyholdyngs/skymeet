import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schema/project.schema.js';

import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { AuthModule } from '../auth/auth.module.js';

import { ProjectMembersModule } from '../project-members/project-members.module.js';
import { ProjectMember, ProjectMemberSchema } from '../project-members/schemas/project-member.schema.js';

@Module({
    imports: [
        AuthModule,
        ProjectMembersModule,
        
        MongooseModule.forFeature([
            {
                name: Project.name,
                schema: ProjectSchema,
            },
            {
                name: ProjectMember.name,
                schema: ProjectMemberSchema,
            },
        ]),
    ],
    
    controllers: [ProjectsController],
    providers: [ProjectsService],
    exports: [ProjectsService],
})
export class ProjectsModule {}