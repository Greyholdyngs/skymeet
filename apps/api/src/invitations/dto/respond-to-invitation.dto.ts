import {IsIn, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf} from 'class-validator';

export class RespondToInvitationDto {
    @ValidateIf((dto) => !dto.invitationId)
    @IsString()
    @IsNotEmpty()
    @MinLength(32)
    token?: string;

    @ValidateIf((dto) => !dto.token)
    @IsString()
    @IsNotEmpty()
    invitationId?: string;

    @IsIn(['accept', 'decline'])
    action: 'accept' | 'decline';
}

