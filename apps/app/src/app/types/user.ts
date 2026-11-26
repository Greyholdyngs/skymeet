export interface UserPreferences {
    appearance: "system" | "light" | "dark";
    timezone: string;
    inAppNotifications: boolean;
    emailNotifications: boolean;
    commentNotifications: boolean;
    showChatHistoryToNewMembers: boolean;
}

export interface UserProfile {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    pendingEmail: string | null;
    isEmailVerified: boolean;
    preferences: UserPreferences;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileData {
    firstName: string;
    lastName: string;
    userName: string;
}
