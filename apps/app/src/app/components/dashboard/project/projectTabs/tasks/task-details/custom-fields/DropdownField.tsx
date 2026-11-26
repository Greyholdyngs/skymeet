"use client";

import { ChevronDown } from "lucide-react";

interface DropdownFieldProps {
    value?: string;
    options: string[];
    disabled: boolean;
    saving: boolean;
    onChange: (value: string) => void;
}

const DropdownField = ({ value, options, disabled, saving, onChange}: DropdownFieldProps) => {
    return (
        <div>
            <div className="relative">
                <select
                    value={value ?? ""}
                    disabled={disabled || saving}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full appearance-none rounded-lg border theme-border theme-surface-elevated px-3 py-2.5 pr-9 text-sm theme-text outline-none transition focus:border-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" disabled> Select an option </option>
                    {options.map((option) => (
                        <option
                            key={option}
                            value={option}
                            className="theme-surface-elevated"
                        >
                            {option}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 theme-text-muted"
                />
            </div>
            {saving && (
                <p className="mt-2 text-xs theme-text-muted">
                    Saving...
                </p>
            )}
        </div>
    );
};

export default DropdownField;
