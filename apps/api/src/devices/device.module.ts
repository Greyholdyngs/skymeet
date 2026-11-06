import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schemas/device.schema.js';

import { KeyPackage, KeyPackageSchema } from './schemas/key-package.schema.js';
import { DevicesService } from './device.service.js';
import { AuthModule } from '../auth/auth.module.js';

import { DevicesController } from './device.controller.js';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            {
                name: Device.name,
                schema: DeviceSchema,
            },
            {
                name: KeyPackage.name,
                schema: KeyPackageSchema,
            },
        ]),
    ],
    providers: [DevicesService],
    controllers: [DevicesController],
    exports: [MongooseModule, DevicesService],
})
export class DevicesModule {}