import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength} from 'class-validator';

export class CreateCommentDto {
    @IsOptional()
    @IsMongoId()
    taskId?: string | null;

    @IsOptional()
    @IsMongoId()
    parentCommentId?: string | null;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100000)
    ciphertext: string;
}
