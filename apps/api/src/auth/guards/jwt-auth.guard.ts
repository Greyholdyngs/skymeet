import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from '../types/auth-request.js';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthRequest>();

        const token = request.cookies?.skymeet_access_token ?? request.headers.authorization?.replace(/^Bearer\s+/i, '');

        if (!token) {
            throw new UnauthorizedException('Authentication required');
        }

        let payload: {
            sub: string;
            email: string;
            tokenVersion?: number;
        };

        try {
            payload = await this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const user = await this.userModel.findById(payload.sub).select('tokenVersion');

        if (!user || (payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
            throw new UnauthorizedException('Session is no longer valid');
        }

        request.user = payload;

        return true;
    }
}