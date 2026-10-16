"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CustomField, CustomFieldType } from "../types/types";

import AddFieldMenu from "./AddFieldMenu";
import CustomFieldBuilder from "./CustomFieldBuilder";

interface CustomFieldsSectionProps {
    fields: CustomField[];
    onChange: (fields: CustomField[]) => void;
}

const CustomFieldsSection = ({ fields, onChange }: CustomFieldsSectionProps) => {
    
    const [isAdding, setIsAdding] = useState(false);
    const [fieldType, setFieldType] = useState<CustomFieldType | null>(null);
    const handleTypeSelect = ( type: CustomFieldType ) => {
        setFieldType(type);
        setIsAdding(false);
    };

    const handleAdd = (field: CustomField) => {
        onChange([...fields, field]);
        setFieldType(null);
    };
    const removeField = (id: string) => {
        onChange( fields.filter( (field) => field.id !== id ) );
    };

    return (
        <section>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-white/70"> Custom fields </h3>
                    <p className="mt-1 text-xs text-white/30"> Add extra information specific to this task. </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsAdding( (current) => !current )
                    }
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                >
                    <Plus size={14} />
                    Add field
                </button>
            </div>
            {isAdding && (
                <AddFieldMenu
                    onSelect={handleTypeSelect}
                />
            )}
            {fieldType && (
                <CustomFieldBuilder
                    type={fieldType}
                    onCancel={() => setFieldType(null)}
                    onSave={handleAdd}
                />
            )}
            {fields.length > 0 && (
                <div className="mt-4 space-y-2">
                    {fields.map((field) => (
                        <div
                            key={field.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#101017] p-3"
                        >
                            <div>
                                <p className="text-sm font-medium text-white"> {field.name} </p>
                                <p className="mt-1 text-xs capitalize text-white/30"> {field.type} </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeField( field.id )}
                                className="rounded-md p-2 text-white/30 transition hover:bg-red-400/10 hover:text-red-400"
                                aria-label={`Remove ${field.name}`}
                            >
                                <Trash2
                                    size={15}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default CustomFieldsSection;