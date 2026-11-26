
"use client";

interface PrivacySettingsProps {
    enabled: boolean;
    saving: boolean;
    onChange: (enabled: boolean) => void;
}

const PrivacySettings = ({ enabled, saving, onChange }: PrivacySettingsProps) => {
    return (
        <section className="rounded-xl border theme-border theme-surface p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold theme-text"> Chat history visibility </h2>
                    <p className="mt-1 max-w-xl text-sm theme-text-secondary"> Allow new members joining your projects to see previous chat history. </p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    disabled={saving}
                    onClick={() => onChange(!enabled)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                enabled ? "bg-[#7C5CFC]" : "bg-gray-400" }`}
                >
                    <span  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${ enabled ? "left-6" : "left-1"}`} />
                </button>
            </div>
        </section>
    );
};

export default PrivacySettings;
