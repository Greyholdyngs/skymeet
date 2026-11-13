import { IsArray, IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, ArrayUnique, IsIn } from 'class-validator';

export class CreateMeetingDto {
    @IsIn(['general', 'project'])
    scope: 'general' | 'project';

    @IsOptional()
    @IsMongoId()
    projectId?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;

    @IsDateString()
    startAt: string;

    @IsDateString()
    endAt: string;

    @IsOptional()
    @IsString()
    @IsUrl({
        protocols: ['http', 'https'],
        require_protocol: true,
    })
    meetingLink?: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsMongoId({ each: true })
    attendeeIds?: string[];
}
