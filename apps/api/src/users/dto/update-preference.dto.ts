import { IsBoolean, IsIn, IsOptional, IsString, MaxLength, Matches} from 'class-validator';

export class UpdatePreferencesDto {
    @IsOptional()
    @IsIn(['system', 'light', 'dark'])
    appearance?: 'system' | 'light' | 'dark';

    @IsOptional()
    @IsString()
    @MaxLength(100)
    timezone?: string;

    @IsOptional()
    @IsBoolean()
    inAppNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    emailNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    commentNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    showChatHistoryToNewMembers?: boolean;
}
