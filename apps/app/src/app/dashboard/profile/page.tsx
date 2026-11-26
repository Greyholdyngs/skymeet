"use client";

import ProfileHeader from "@/app/components/dashboard/profile/ProfileHeader";
import ProfileInformationForm from "@/app/components/dashboard/profile/ProfileInformationForm";
import { useUserProfile } from "@/app/components/dashboard/profile/hooks/useUserProfile";

const ProfilePage = () => {
    const { profile, loading, saving, error, successMessage, saveProfile } = useUserProfile();

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm theme-text-muted">Loading your profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-6">
                <p className="text-sm text-red-500"> {error || "Unable to load your profile."} </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8 px-6 py-8">
            <div>
                <h1 className="text-2xl font-semibold theme-text">My Profile</h1>
                <p className="mt-1 text-sm theme-text-secondary"> Manage your personal information and account details. </p>
            </div>
            <ProfileHeader profile={profile} />
            <ProfileInformationForm
                profile={profile}
                saving={saving}
                error={error}
                successMessage={successMessage}
                onSave={saveProfile}
            />
        </div>
    );
};

export default ProfilePage;
