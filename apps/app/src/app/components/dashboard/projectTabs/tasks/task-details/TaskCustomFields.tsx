"use client";
import { CheckSquare, ChevronDown, ListChecks, Type } from "lucide-react";

import type { CustomField } from "../types/types";

interface TaskCustomFieldProps {
    fields: CustomField[];
}

const TaskCustomFields = ({ fields }: TaskCustomFieldProps) => {
    if (fields.length === 0) {
        return null;
    }

    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-white"> Custom fields </h3>
                <p className="mt-1 text-xs text-white/35"> Additional information for this task. </p>
            </div>
            <div className="space-y-3">
                {fields.map((field) => (
                    <div
                        key={field.id}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                        <div className="mb-3 flex items-center gap-2">
                            <FieldIcon type={field.type} />
                            <h4 className="text-sm font-medium text-white/75"> {field.name} </h4>
                        </div>
                        {field.type === "text" && (
                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/55"> {field.value?.trim() || "No value added"} </p>
                        )}
                        {field.type === "dropdown" && (
                            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#14141B] px-3 py-2.5">
                                <span className="text-sm text-white/65"> {field.value || "No option selected"} </span>
                                <ChevronDown
                                    size={15}
                                    className="shrink-0 text-white/25"
                                />
                            </div>
                        )}
                        {field.type === "checklist" && (
                            <ChecklistDisplay field={field} />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

interface FieldIconProps {
    type: CustomField["type"];
}

const FieldIcon = ({ type }: FieldIconProps) => {
    const className = "text-white/35";

    switch (type) {
        case "text": return <Type size={15} className={className} />;
        case "dropdown": return <ChevronDown size={15} className={className} />;
        case "checklist": return <CheckSquare size={15} className={className} />;
    }
};

interface ChecklistDisplayProps {
    field: CustomField;
}

const ChecklistDisplay = ({ field }: ChecklistDisplayProps) => {
    const items = field.items ?? [];
    const completedCount = items.filter((item) => item.completed,).length;

    const progress = items.length ? Math.round((completedCount / items.length) * 100) : 0;

    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs text-white/40"> {completedCount} of {items.length} completed </span>
                <span className="text-xs text-white/40"> {progress}% </span>
            </div>
            <div
                className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label={`${field.name} progress`}
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
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-start gap-3"
                        >
                            <span
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                    item.completed ? "border-[#7C3AED] bg-[#7C3AED] text-white" : "border-white/20"}`}
                            >
                                {item.completed && ( <CheckSquare size={11} /> )}
                            </span>
                            <span
                                className={`text-sm ${ item.completed ? "text-white/35 line-through" : "text-white/65"
                                }`}
                            >
                                {item.label}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-white/35">
                    No checklist items added.
                </p>
            )}
            <ListChecks
                size={15}
                className="sr-only"
                aria-hidden="true"
            />
        </div>
    );
};

export default TaskCustomFields;
