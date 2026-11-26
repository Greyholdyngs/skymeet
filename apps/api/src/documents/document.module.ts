import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Document, DocumentSchema } from './schemas/document.schema.js';
import { DocumentsService } from './document.service.js';
import { DocumentsController } from './document.controller.js';

import { ProjectMembersModule } from '../project-members/project-members.module.js';
import { ActivityModule } from '../activity/activity.module.js';
import { StorageModule } from '../storage/storage.module.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Document.name, schema: DocumentSchema },
        ]),
        ProjectMembersModule,
        ActivityModule,
        StorageModule,
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
    exports: [DocumentsService],
})
export class DocumentsModule {}