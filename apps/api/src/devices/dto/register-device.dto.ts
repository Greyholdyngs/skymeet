import { IsIn, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class RegisterDeviceDto {
    @IsUUID()
    deviceId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    deviceName: string;

    @IsIn(['web', 'desktop', 'mobile'])
    platform: 'web' | 'desktop' | 'mobile';
}
