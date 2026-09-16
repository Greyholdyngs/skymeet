import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from '../types/auth-request.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const token = request.cookies?.skymeet_access_token ?? request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        throw new UnauthorizedException('Authentication required');
    }

    try {
        const payload = await this.jwtService.verifyAsync<{
            sub: string;
            email: string;
        }>(token);

        request.user = payload;

        return true;
    } catch {
        throw new UnauthorizedException('Invalid or expired token');
    }
}
}