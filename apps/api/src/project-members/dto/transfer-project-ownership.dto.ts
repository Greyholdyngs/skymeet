import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TransferProjectOwnershipDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}