import { IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    showChatHistoryToNewMembers?: boolean | null;
}