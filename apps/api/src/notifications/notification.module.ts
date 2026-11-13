import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification.schema.js';

import { NotificationService } from './notification.service.js';
import { NotificationGateway } from './notification.gateway.js';
import { AuthModule } from '../auth/auth.module.js';

import { NotificationsController } from './notification.controller.js';
import { User, UserSchema } from '../auth/schemas/user.schema.js';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            {
                name: Notification.name,
                schema: NotificationSchema,
            },
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [NotificationsController],
    providers: [NotificationService, NotificationGateway],
    exports: [NotificationService],
})
export class NotificationsModule {}
