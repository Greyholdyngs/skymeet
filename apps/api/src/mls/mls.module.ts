import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesModule } from '../devices/device.module.js';

import { ProjectMlsGroup, ProjectMlsGroupSchema} from './schemas/project-mls-group.schema.js';
import { MlsGroupEvent, MlsGroupEventSchema } from './schemas/mls-group-event.schema.js';
import { MlsWelcome, MlsWelcomeSchema } from './schemas/mls-welcome.schema.js';

@Module({
    imports: [
        DevicesModule,
        MongooseModule.forFeature([
            {
                name: ProjectMlsGroup.name,
                schema: ProjectMlsGroupSchema,
            },
            {
                name: MlsGroupEvent.name,
                schema: MlsGroupEventSchema,
            },
            {
                name: MlsWelcome.name,
                schema: MlsWelcomeSchema,
            },
        ]),
    ],
    providers: [],
    controllers: [],
    exports: [MongooseModule],
})
export class MlsModule {}