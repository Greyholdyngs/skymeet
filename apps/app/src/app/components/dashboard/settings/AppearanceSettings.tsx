"use client";

import type { UserPreferences } from "@/app/types/user";

interface AppearanceSettingsProps {
    appearance: UserPreferences["appearance"];
    saving: boolean;
    onChange: (appearance: UserPreferences["appearance"]) => void;
}

const options: {
    value: UserPreferences["appearance"];
    label: string;
    description: string;
}[] = [
    {
        value: "system",
        label: "System default",
        description: "Follow your device's appearance preference.",
    },
    {
        value: "dark",
        label: "Dark mode",
        description: "Use the dark appearance.",
    },
    {
        value: "light",
        label: "Light mode",
        description: "Use the light appearance.",
    },
];

const AppearanceSettings = ({ appearance, saving, onChange,}: AppearanceSettingsProps) => {
    return (
        <section className="rounded-xl border theme-border theme-surface p-6">
            <div className="mb-5">
                <h2 className="text-base font-semibold theme-text"> Appearance </h2>
                <p className="mt-1 text-sm theme-text-secondary"> Choose how SkyMeet looks on your device. </p>
            </div>
            <div className="space-y-3">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition ${
                            appearance === option.value ? "border-[#7C5CFC] bg-[#7C5CFC]/10" : "theme-border theme-surface-elevated" }`}
                    >
                        <div>
                            <p className="text-sm font-medium theme-text"> {option.label} </p>
                            <p className="mt-1 text-xs theme-text-secondary"> {option.description} </p>
                        </div>
                        <input
                            type="radio"
                            name="appearance"
                            value={option.value}
                            checked={appearance === option.value}
                            disabled={saving}
                            onChange={() => onChange(option.value)}
                            className="h-4 w-4 accent-[#7C5CFC]"
                        />
                    </label>
                ))}
            </div>
        </section>
    );
};

export default AppearanceSettings;
