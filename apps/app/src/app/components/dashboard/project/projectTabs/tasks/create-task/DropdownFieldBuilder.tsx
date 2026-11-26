"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CustomField } from "../types/types";

interface DropdownFieldBuilderProps {
    onCancel: () => void;
    onSave: (field: CustomField) => void;
}

const DropdownFieldBuilder = ({ onCancel, onSave }: DropdownFieldBuilderProps) => {
    const [name, setName] = useState("");
    const [options, setOptions] = useState<string[]>([""]);

    const updateOption = ( index: number, value: string ) => {
        setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? value : option) );
    };

    const addOption = () => {
        setOptions((current) => [
            ...current,
            "",
        ]);
    };

    const removeOption = (index: number) => {
        setOptions((current) => current.filter( (_, optionIndex) => optionIndex !== index ));
    };

    const handleSave = () => {
        const cleanOptions = options.map((option) => option.trim()).filter(Boolean);
        if ( !name.trim() || cleanOptions.length === 0) {
            return;
        }

        onSave({
            id: crypto.randomUUID(),
            name: name.trim(),
            type: "dropdown",
            options: cleanOptions,
        });
    };

    return (
        <div className="mt-4 rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 p-4">
            <p className="text-sm font-medium text-white"> Dropdown field</p>
            <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Field name"
                className="mt-4 w-full rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]"
            />
            <div className="mt-4 space-y-2">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className="flex gap-2"
                    >
                        <input
                            value={option}
                            onChange={(event) => updateOption(
                                    index,
                                    event.target.value,
                            )}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 rounded-lg border border-white/10 bg-[#101017] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]"
                        />
                        {options.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeOption( index )}
                                className="rounded-lg border border-white/10 px-3 text-white/30 hover:bg-red-400/10 hover:text-red-400"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={addOption}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-violet-200"
            >
                <Plus size={13} />
                Add option
            </button>
            <div className="mt-4 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg px-3 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!name.trim()}
                    className="rounded-lg bg-[#7C3AED] px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                >
                    Add field
                </button>
            </div>
        </div>
    );
};
export default DropdownFieldBuilder;