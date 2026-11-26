"use client";

import type { ChecklistItem } from "../../types/types";

interface ChecklistFieldProps {
    items: ChecklistItem[];
    disabled: boolean;
    savingKeys: Set<string>;
    fieldId: string;
    onToggle: (itemId: string, completed: boolean) => void;
}

const ChecklistField = ({ items, disabled, savingKeys, fieldId, onToggle, }: ChecklistFieldProps) => {
    const completedCount = items.filter( (item) => item.completed,).length;

    const progress = items.length ? Math.round((completedCount / items.length) * 100) : 0;

    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs theme-text-muted"> {completedCount} of {items.length} completed </span>
                <span className="text-xs theme-text-muted"> {progress}% </span>
            </div>
            <div
                className="mb-4 h-1.5 overflow-hidden rounded-full bg-[var(--border)]"
                role="progressbar"
                aria-label="Checklist progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
            >
                <div
                    className="h-full rounded-full bg-[#7C3AED] transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {items.length > 0 ? (
                <ul className="space-y-3">
                    {items.map((item) => {
                        const savingKey = `${fieldId}:${item.id}`;
                        const isSaving = savingKeys.has(savingKey);

                        return (
                            <li
                                key={item.id}
                                className="flex items-start gap-3"
                            >
                                <input
                                    type="checkbox"
                                    checked={Boolean(item.completed)}
                                    disabled={disabled || isSaving}
                                    onChange={(event) => onToggle( item.id, event.target.checked,)}
                                    aria-label={item.label}
                                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#7C3AED] disabled:cursor-not-allowed"
                                />
                                <span
                                    className={`text-sm ${ item.completed ? "theme-text-muted line-through" : "theme-text-secondary" }`}
                                >
                                    {item.label}
                                    {isSaving && (
                                        <span className="ml-2 text-xs theme-text-muted"> Saving... </span>
                                    )}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-sm theme-text-muted"> No checklist items added. </p>
            )}
        </div>
    );
};

export default ChecklistField;
