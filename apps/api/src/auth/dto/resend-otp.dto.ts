import { IsEmail, IsIn } from 'class-validator';

export class ResendOtpDto {
  @IsEmail()
  email: string;

  @IsIn(['email_verification', 'password_reset'])
  purpose: 'email_verification' | 'password_reset';
}