import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module.js';

import { User, UserSchema } from '../auth/schemas/user.schema.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

import { AccountDeletionService } from './account-deletion.service.js';
import { UsersDirectoryController } from './user-directory.controller.js';
import { ProjectMembersModule } from '../project-members/project-members.module.js';

@Module({
    imports: [
        AuthModule,
        ProjectMembersModule,
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [UsersController, UsersDirectoryController],
    providers: [UsersService, AccountDeletionService],
    exports: [UsersService],
})
export class UsersModule {}
