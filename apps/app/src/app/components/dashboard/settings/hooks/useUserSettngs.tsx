"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/app/lib/user/user-service";

import { updateUserPreferences, type UpdatePreferencesData } from "@/app/lib/user/preferences-service";
import { queryKeys } from "@/app/lib/queries/query-key";
import type { UserPreferences, UserProfile } from "@/app/types/user";

export function useUserSettings() {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    const settingsQuery = useQuery({
        queryKey: queryKeys.users.preferences(),
        queryFn: async () => {
            const profile = await getUserProfile();
            return profile.preferences;
        },
    });

    const saveSettingsMutation = useMutation({
        mutationFn: (updates: UpdatePreferencesData) => updateUserPreferences(updates),
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData<UserPreferences>(
                queryKeys.users.preferences(),
                updatedProfile.preferences,
            );

            queryClient.setQueryData<UserProfile>(
                queryKeys.users.profile(),
                (currentProfile) => currentProfile ? { ...currentProfile, preferences: updatedProfile.preferences } : currentProfile,
            );

            setError(null);
        },

        onError: (err) => {
            setError( err instanceof Error ? err.message : "Failed to save your settings.",);
        },
    });

    const saveSettings = async ( updates: UpdatePreferencesData, _showSuccessMessage = true ) => {
        setError(null);

        try {
            await saveSettingsMutation.mutateAsync(updates);
            return true;
        } catch {
            return false;
        }
    };

    return {
        preferences: settingsQuery.data ?? null,
        loading: settingsQuery.isPending,
        saving: saveSettingsMutation.isPending,
        error: error ?? ( settingsQuery.error instanceof Error ? settingsQuery.error.message : null ),
        saveSettings,
    };
}
