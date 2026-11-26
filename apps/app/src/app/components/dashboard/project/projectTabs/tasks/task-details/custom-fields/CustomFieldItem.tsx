"use client";

import { CheckSquare, ChevronDown, Type,} from "lucide-react";
import type { CustomField } from "../../types/types";
import DropdownField from "./DropdownField";

import ChecklistField from "./CheckListField";

interface CustomFieldItemProps {
    field: CustomField;
    disabled: boolean;
    savingKeys: Set<string>;
    onDropdownChange: (fieldId: string, value: string) => void;
    onChecklistToggle: ( fieldId: string, itemId: string, completed: boolean ) => void;
}

const CustomFieldItem = ({ field, disabled, savingKeys, onDropdownChange, onChecklistToggle }: CustomFieldItemProps) => {
    const iconClass = "theme-text-muted";

    const saving = savingKeys.has(field.id);

    return (
        <div className="rounded-xl theme-border border theme-surface-elevated p-4">
            <div className="mb-3 flex items-center gap-2">
                {field.type === "text" && (
                    <Type size={15} className={iconClass} />
                )}
                {field.type === "dropdown" && (
                    <ChevronDown size={15} className={iconClass} />
                )}
                {field.type === "checklist" && (
                    <CheckSquare size={15} className={iconClass} />
                )}
                <h4 className="text-sm font-medium theme-text"> {field.name} </h4>
            </div>
            {field.type === "text" && (
                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 theme-text-secondary"> {field.value?.trim() || "No value added"} </p>
            )}
            {field.type === "dropdown" && (
                <DropdownField
                    value={field.value}
                    options={field.options ?? []}
                    disabled={disabled}
                    saving={saving}
                    onChange={(value) => onDropdownChange(field.id, value) }
                />
            )}
            {field.type === "checklist" && (
                <ChecklistField
                    fieldId={field.id}
                    items={field.items ?? []}
                    disabled={disabled}
                    savingKeys={savingKeys}
                    onToggle={(itemId, completed) => onChecklistToggle( field.id, itemId, completed,)}
                />
            )}
            {disabled && field.type !== "text" && (
                <p className="mt-2 text-xs theme-text-muted"> Read-only in this task status. </p>
            )}
        </div>
    );
};

export default CustomFieldItem;
