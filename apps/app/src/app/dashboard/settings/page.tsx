"use client";

import AppearanceSettings from "@/app/components/dashboard/settings/AppearanceSettings";
import NotificationSettings from "@/app/components/dashboard/settings/NotificationSettings";
import PrivacySettings from "@/app/components/dashboard/settings/PrivacySettings";

import TimezoneSettings from "@/app/components/dashboard/settings/TimezoneSettings";
import { useUserSettings } from "@/app/components/dashboard/settings/hooks/useUserSettngs";
import { useTheme } from "@/app/components/providers/ThemeProvider";

const SettingsPage = () => {
    const { preferences, loading, saving, error, saveSettings } = useUserSettings();
    const { setAppearance } = useTheme();

    const handleAppearanceChange = async ( appearance: "system" | "light" | "dark", ) => {
        const previousAppearance = preferences?.appearance;

        setAppearance(appearance);

        const saved = await saveSettings({ appearance });

        if (!saved && previousAppearance) {
            setAppearance(previousAppearance);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm theme-text-muted"> Loading your settings... </p>
            </div>
        );
    }

    if (!preferences) {
        return (
            <div className="p-6">
                <p className="text-sm text-red-500"> {error || "Unable to load your settings."} </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8">
            <div>
                <h1 className="text-2xl font-semibold theme-text"> Settings </h1>
                <p className="mt-1 text-sm theme-text-secondary"> Manage your application preferences and privacy. </p>
            </div>
            {error && ( <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500"> {error} </p>)}
            <AppearanceSettings
                appearance={preferences.appearance}
                saving={saving}
                onChange={handleAppearanceChange}
            />
            <TimezoneSettings
                timezone={preferences.timezone}
                saving={saving}
                onChange={(timezone) => void saveSettings({ timezone })}
            />
            <NotificationSettings
                inAppNotifications={preferences.inAppNotifications}
                emailNotifications={preferences.emailNotifications}
                commentNotifications={preferences.commentNotifications}
                saving={saving}
                onChange={(updates) => void saveSettings(updates)}
            />
            <PrivacySettings
                enabled={preferences.showChatHistoryToNewMembers}
                saving={saving}
                onChange={(showChatHistoryToNewMembers) => void saveSettings({ showChatHistoryToNewMembers })}
            />
        </div>
    );
};

export default SettingsPage;
