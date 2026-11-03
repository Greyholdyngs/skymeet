import { IsEnum, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { TaskReviewDecision } from '../schema/task.schema.js';

export class ReviewTaskDto {
    @IsEnum(TaskReviewDecision)
    decision: TaskReviewDecision;

    @ValidateIf((dto: ReviewTaskDto) => dto.decision === TaskReviewDecision.CHANGES_REQUESTED )
    @IsString()
    @MaxLength(2000)
    comment: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    approvalComment?: string;
}
