
import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RespondToInvitationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  token: string;

  @IsIn(['accept', 'decline'])
  action: 'accept' | 'decline';
}
