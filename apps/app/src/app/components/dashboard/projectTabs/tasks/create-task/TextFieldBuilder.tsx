"use client";

import { useState } from "react";
import type { CustomField } from "../types/types";

interface TextFieldBuilderProps {
    onCancel: () => void;
    onSave: (field: CustomField) => void;
}

const TextFieldBuilder = ({ onCancel, onSave }: TextFieldBuilderProps) => {
    const [name, setName] = useState("");
    const handleSave = () => {
        if (!name.trim()) return;

        onSave({
            id: crypto.randomUUID(),
            name: name.trim(),
            type: "text",
        });
    };

    return (
        <div className="mt-4 rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 p-4">
            <p className="text-sm font-medium text-white"> Text field </p>
            <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Field name"
                className="mt-4 w-full rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]"
            />
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
export default TextFieldBuilder;