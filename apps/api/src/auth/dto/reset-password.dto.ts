import { IsEmail, IsString, IsNotEmpty, Length, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail() email: string;

  @IsString()
  @Length(6, 6)
  otp: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72)
  confirmPassword: string;
}