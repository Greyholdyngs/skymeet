import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class DeleteAccountDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(72)
    currentPassword: string;
}