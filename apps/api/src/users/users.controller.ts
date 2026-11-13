import { Body, Controller, Get, Patch, Req, UseGuards, Delete} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthRequest } from '../auth/types/auth-request.js';

import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UsersService } from './users.service.js';
import { UpdatePreferencesDto } from './dto/update-preference.dto.js';
import { DeleteAccountDto } from './dto/delete-account.dto.js';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get()
    async getProfile(@Req() req: AuthRequest) {
        return this.usersService.getProfile(req.user.sub);
    }

    @Patch()
    async updateProfile(
        @Req() req: AuthRequest,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(
            req.user.sub,
            dto,
        );
    }

    @Patch('preferences')
    async updatePreferences( @Req() req: AuthRequest, @Body() dto: UpdatePreferencesDto ) {
        return this.usersService.updatePreferences(
            req.user.sub,
            dto,
        );
    }

    @Delete()
    async deleteAccount( @Req() req: AuthRequest, @Body() dto: DeleteAccountDto, ) {
        return this.usersService.deleteAccount(
            req.user.sub,
            dto.currentPassword,
        );
    }
}
