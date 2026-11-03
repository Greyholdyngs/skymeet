import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { SprintStatus } from '../schemas/sprint.schema.js';

export class UpdateSprintDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsEnum(SprintStatus)
    status?: SprintStatus;
}
