import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Activity, ActivitySchema } from './schemas/activity.schema.js';
import { ActivityService } from './activity.service.js';
import { ActivityController } from './activity.controller.js';

import { AuthModule } from '../auth/auth.module.js';
import { ProjectMembersModule } from '../project-members/project-members.module.js';
import { ActivityGateway } from './activity.gateway.js';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Activity.name, schema: ActivitySchema },
        ]),
        AuthModule,
        ProjectMembersModule,
    ],
    controllers: [ActivityController],
    providers: [ActivityService, ActivityGateway],
    exports: [ActivityService],
})
export class ActivityModule {}
