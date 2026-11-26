import { apiFetch } from "@/app/lib/api";
import type { UserProfile, UpdateProfileData } from "@/app/types/user";

export async function getUserProfile(): Promise<UserProfile> {
    return apiFetch<UserProfile>("/users/me");
}

export async function updateUserProfile( data: UpdateProfileData ): Promise<UserProfile> {
    return apiFetch<UserProfile>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}
