import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, } from 'class-validator';
import { ProjectMemberRole } from '../../project-members/schemas/project-member.schema.js';

export class CreateInvitationDto {
  @ValidateIf((o) => !o.userName)
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userName?: string;

  @IsEnum([
    ProjectMemberRole.ADMIN,
    ProjectMemberRole.TEAM_MEMBER,
  ])
  role: ProjectMemberRole.ADMIN | ProjectMemberRole.TEAM_MEMBER;
}
