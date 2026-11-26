"use client";

import { useEffect, useState } from "react";
import type { UserProfile, UpdateProfileData } from "@/app/types/user";

interface ProfileInformationFormProps {
    profile: UserProfile;
    saving: boolean;
    error: string | null;
    successMessage: string;
    onSave: (data: UpdateProfileData) => Promise<boolean>;
}

const ProfileInformationForm = ({ profile, saving, error, successMessage, onSave }: ProfileInformationFormProps) => {
    const [formData, setFormData] = useState<UpdateProfileData>({
        firstName: profile.firstName,
        lastName: profile.lastName,
        userName: profile.userName,
    });

    useEffect(() => {
        setFormData({
            firstName: profile.firstName,
            lastName: profile.lastName,
            userName: profile.userName,
        });
    }, [profile]);

    const handleChange = (field: keyof UpdateProfileData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await onSave({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            userName: formData.userName.trim().toLowerCase(),
        });
    };

    const inputClassName = "w-full rounded-lg border theme-border theme-surface-elevated px-4 py-3 text-sm theme-text outline-none focus:border-[#7C5CFC]";

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border theme-border theme-surface p-6"
        >
            <div className="mb-6">
                <h2 className="text-base font-semibold theme-text"> Personal information </h2>
                <p className="mt-1 text-sm theme-text-secondary"> Update the personal details associated with your account. </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm theme-text-secondary"> First name </label>
                    <input
                        required
                        maxLength={50}
                        value={formData.firstName}
                        onChange={(event) => handleChange("firstName", event.target.value)}
                        className={inputClassName}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm theme-text-secondary"> Last name </label>
                    <input
                        required
                        maxLength={50}
                        value={formData.lastName}
                        onChange={(event) => handleChange("lastName", event.target.value)}
                        className={inputClassName}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm theme-text-secondary"> Username </label>
                    <input
                        required
                        maxLength={30}
                        pattern="[a-zA-Z0-9_]+"
                        value={formData.userName}
                        onChange={(event) => handleChange("userName", event.target.value)}
                        className={inputClassName}
                    />
                    <p className="mt-1 text-xs theme-text-muted"> Letters, numbers and underscores only. </p>
                </div>
                <div>
                    <label className="mb-2 block text-sm theme-text-secondary"> Email address </label>
                    <input
                        disabled
                        value={profile.email}
                        className="w-full cursor-not-allowed rounded-lg border theme-border theme-surface-elevated px-4 py-3 text-sm theme-text-muted opacity-70"
                    />
                    <p className="mt-1 text-xs theme-text-muted"> Email address cannot be changed here. </p>
                </div>
            </div>
            {error && (
                <p className="mt-5 text-sm text-red-500">{error}</p>
            )}

            {successMessage && (
                <p className="mt-5 text-sm text-green-500">{successMessage}</p>
            )}
            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-[#7C5CFC] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6B4CE6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save changes"}
                </button>
            </div>
        </form>
    );
};

export default ProfileInformationForm;
