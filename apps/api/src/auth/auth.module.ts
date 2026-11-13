import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller.js';

import { AuthService } from './auth.service.js';
import { EmailService } from './services/email.service.js';
import { User, UserSchema } from './schemas/user.schema.js';

import { Otp, OtpSchema } from './schemas/otp.schema.js';
import { OtpService } from './services/otp.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Module({
  imports: [
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '9h',
        },
      }),
    }),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Otp.name,
        schema: OtpSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, OtpService, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule, EmailService, MongooseModule]
})
export class AuthModule {}