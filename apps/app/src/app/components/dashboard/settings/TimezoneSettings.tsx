
"use client";

interface TimezoneSettingsProps {
    timezone: string;
    saving: boolean;
    onChange: (timezone: string) => void;
}

const timezones = [
    "Africa/Lagos",
    "UTC",
    "Europe/London",
    "Europe/Paris",
    "America/New_York",
    "America/Los_Angeles",
    "America/Chicago",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
];

const TimezoneSettings = ({ timezone, saving, onChange }: TimezoneSettingsProps) => {
    const options = timezones.includes(timezone) ? timezones : [timezone, ...timezones];

    return (
        <section className="rounded-xl border theme-border theme-surface p-6">
            <div className="mb-4">
                <h2 className="text-base font-semibold theme-text"> Timezone </h2>
                <p className="mt-1 text-sm theme-text-secondary"> Choose the timezone used to display dates and meeting times. </p>
            </div>
            <select
                value={timezone}
                disabled={saving}
                onChange={(event) => onChange(event.target.value)}
                className="w-full max-w-md rounded-lg border theme-border theme-surface-elevated px-4 py-3 text-sm theme-text outline-none focus:border-[#7C5CFC] disabled:opacity-50"
            >
                {options.map((zone) => (
                    <option key={zone} value={zone}>
                        {zone.replaceAll("_", " ")}
                    </option>
                ))}
            </select>
        </section>
    );
};

export default TimezoneSettings;
