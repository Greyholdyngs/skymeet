import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCustomFieldDto {
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    value?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    itemId?: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}
