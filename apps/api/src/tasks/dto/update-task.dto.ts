import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString, MaxLength, IsNotEmpty, ValidateNested,
         IsIn, IsBoolean,} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority } from '../schema/task.schema.js';

class ChecklistItemDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    label: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}

class CustomFieldDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsIn(['text', 'dropdown', 'checklist'])
    type: 'text' | 'dropdown' | 'checklist';

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    value?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @MaxLength(200, { each: true })
    options?: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChecklistItemDto)
    items?: ChecklistItemDto[];
}

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

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

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CustomFieldDto)
    customFields?: CustomFieldDto[];
}

