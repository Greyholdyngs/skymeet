"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "@/app/lib/user/user-service";

import { queryKeys } from "@/app/lib/queries/query-key";
import type { UserProfile, UpdateProfileData } from "@/app/types/user";

export function useUserProfile() {
    const queryClient = useQueryClient();

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");

    const profileQuery = useQuery({ queryKey: queryKeys.users.profile(), queryFn: getUserProfile});

    const saveProfileMutation = useMutation({
        mutationFn: (data: UpdateProfileData) => updateUserProfile(data),
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData<UserProfile>(
                queryKeys.users.profile(),
                updatedProfile,
            );

            setError(null);
            setSuccessMessage("Profile updated successfully.");
        },
        onError: (err) => {
            setError( err instanceof Error ? err.message : "Failed to update your profile.");
            setSuccessMessage("");
        },
    });

    const saveProfile = async (data: UpdateProfileData) => {
        setError(null);
        setSuccessMessage("");

        try {
            await saveProfileMutation.mutateAsync(data);
            return true;

        } catch {
            return false;
        }
    };

    const refreshProfile = async () => {
        setError(null);

        try {
            await profileQuery.refetch();
        } catch (err) {
            setError( err instanceof Error ? err.message : "Failed to load your profile.");
        }
    };

    return {
        profile: profileQuery.data ?? null,
        loading: profileQuery.isPending,
        saving: saveProfileMutation.isPending,
        error: error ?? ( profileQuery.error instanceof Error ? profileQuery.error.message : null ),
        successMessage,
        saveProfile,
        refreshProfile,
    };
}
