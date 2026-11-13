import { IsString, IsNotEmpty, MaxLength, Matches, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    lastName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers and underscores' })
    userName?: string;
}
