
import { IsArray, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, 
        MaxLength, MinLength } from 'class-validator';
import { TaskPriority } from '../schema/task.schema.js';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(200)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(10000)
    description?: string;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    assigneeIds?: string[];

    @IsOptional()
    @IsMongoId()
    reviewerId?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string | null;

    @IsOptional()
    @IsMongoId()
    sprintId?: string | null;
}
