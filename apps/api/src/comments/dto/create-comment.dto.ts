import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength} from 'class-validator';

export class CreateCommentDto {
    @IsOptional()
    @IsMongoId()
    taskId?: string | null;

    @IsOptional()
    @IsMongoId()
    parentCommentId?: string | null;

    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value,)
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    content: string;
}
