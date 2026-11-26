import { apiFetch } from "@/app/lib/api";
import type { UserProfile, UserPreferences } from "@/app/types/user";

export type UpdatePreferencesData = Partial<UserPreferences>;

export async function updateUserPreferences( data: UpdatePreferencesData ): Promise<UserProfile> {
    return apiFetch<UserProfile>("/users/me/preferences", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}