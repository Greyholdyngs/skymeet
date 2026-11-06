import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100000)
    ciphertext: string;
} 