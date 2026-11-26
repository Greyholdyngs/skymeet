"use client";

interface NotificationSettingsProps {
    inAppNotifications: boolean;
    emailNotifications: boolean;
    commentNotifications: boolean;
    saving: boolean;
    onChange: (updates: {
        inAppNotifications?: boolean;
        emailNotifications?: boolean;
        commentNotifications?: boolean;
    }) => void;
}

const NotificationSettings = ({ inAppNotifications, emailNotifications, commentNotifications,
                                saving, onChange }: NotificationSettingsProps) => {

    const settings = [
        {
            key: "inAppNotifications" as const,
            title: "In-app notifications",
            description: "Receive notifications inside SkyMeet about project activity, tasks and meetings.",
            enabled: inAppNotifications,
            note: "Turning this off disables all new in-app notifications.",
        },
        {
            key: "emailNotifications" as const,
            title: "Email notifications",
            description: "Choose whether to receive non-essential activity updates by email.",
            enabled: emailNotifications,
            note: "Verification codes, password resets and essential account emails are unaffected.",
        },
        {
            key: "commentNotifications" as const,
            title: "Project and task comments",
            description: "Receive alerts when someone adds a comment or replies to a discussion.",
            enabled: commentNotifications,
            note: "This controls comment alerts independently of other notification types.",
        },
    ];

    return (
        <section className="rounded-xl border theme-border theme-surface p-6">
            <div className="mb-5">
                <h2 className="text-base font-semibold theme-text"> Notifications </h2>
                <p className="mt-1 text-sm theme-text-secondary"> Manage how SkyMeet keeps you updated. </p>
            </div>
            <div className="divide-y theme-border">
                {settings.map((setting) => (
                    <div
                        key={setting.key}
                        className="flex items-start justify-between gap-4 py-5 first:pt-0 last:pb-0"
                    >
                        <div>
                            <h3 className="text-sm font-semibold theme-text"> {setting.title} </h3>
                            <p className="mt-1 max-w-xl text-sm theme-text-secondary"> {setting.description} </p>
                            <p className="mt-2 text-xs theme-text-muted"> {setting.note} </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-label={setting.title}
                            aria-checked={setting.enabled}
                            disabled={saving}
                            onClick={() => onChange({ [setting.key]: !setting.enabled,})}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                        setting.enabled ? "bg-[#7C5CFC]" : "bg-gray-400" }`}
                        >
                            <span  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                                            setting.enabled ? "left-6" : "left-1" }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NotificationSettings;

