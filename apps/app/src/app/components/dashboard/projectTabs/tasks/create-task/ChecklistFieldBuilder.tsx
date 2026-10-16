"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CustomField } from "../types/types";

interface ChecklistFieldBuilderProps {
    onCancel: () => void;
    onSave: (field: CustomField) => void;
}

const ChecklistFieldBuilder = ({ onCancel, onSave }: ChecklistFieldBuilderProps) => {
    const [name, setName] = useState("");
    const [items, setItems] = useState<string[]>([""]);

    const updateItem = ( index: number, value: string ) => {
        setItems((current) => current.map((item, itemIndex) => itemIndex === index ? value : item ),
        );
    };

    const addItem = () => {
        setItems((current) => [
            ...current,
            "",
        ]);
    };

    const removeItem = (index: number) => {
        setItems((current) =>
            current.filter(
                (_, itemIndex) =>
                    itemIndex !== index,
            ),
        );
    };

    const handleSave = () => {
        const cleanItems = items
            .map((item) => item.trim())
            .filter(Boolean);

        if (
            !name.trim() ||
            cleanItems.length === 0
        ) {
            return;
        }

        onSave({
            id: crypto.randomUUID(),
            name: name.trim(),
            type: "checklist",
            items: cleanItems.map((label) => ({
                id: crypto.randomUUID(),
                label,
            })),
        });
    };

    return (
        <div className="mt-4 rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 p-4">
            <p className="text-sm font-medium text-white"> Checklist field </p>
            <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Field name"
                className="mt-4 w-full rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]"
            />
            <div className="mt-4 space-y-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex gap-2"
                    >
                        <input
                            value={item}
                            onChange={(event) => updateItem( index, event.target.value )}
                            placeholder={`Checklist item ${index + 1}`}
                            className="flex-1 rounded-lg border border-white/10 bg-[#101017] px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]"
                        />
                        {
                            items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem( index )}
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
                onClick={addItem}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-violet-200"
            >
                <Plus size={13} />
                Add checklist item
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
export default ChecklistFieldBuilder;