import { IsBase64, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CompleteDeviceEnrollmentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    publicKey: string;

    @IsString()
    @IsNotEmpty()
    @IsBase64()
    @MaxLength(200)
    signature: string;
}