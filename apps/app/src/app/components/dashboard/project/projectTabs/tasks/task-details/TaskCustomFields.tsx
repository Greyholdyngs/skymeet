"use client";
import type { CustomField, TaskStatus} from "../types/types";
import CustomFieldItem from "./custom-fields/CustomFieldItem";
import { useCustomFieldUpdates } from "./custom-fields/useCustomFieldUpdates";

interface TaskCustomFieldProps {
    fields: CustomField[];
    projectId: string;
    taskId: string;
    status: TaskStatus;
    onUpdated: (
        fieldId: string,
        update: | { value: string } | { itemId: string; completed: boolean },
    ) => void;
}

const TaskCustomFields = ({ fields, projectId, taskId, status, onUpdated }: TaskCustomFieldProps) => {

    const { updateField, savingKeys, error, } = useCustomFieldUpdates({ projectId,taskId, onUpdated,});
    const canEdit = status === "in_progress" || status === "task_review";

    if (fields.length === 0) return null;

    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold theme-text"> Custom fields </h3>
                <p className="mt-1 text-xs theme-text-muted"> Additional information for this task. </p>
            </div>
            {error && (
                <p className="text-xs text-red-400" role="alert"> {error} </p>
            )}
            <div className="space-y-3">
                {fields.map((field) => (
                    <CustomFieldItem
                        key={field.id}
                        field={field}
                        disabled={!canEdit}
                        savingKeys={savingKeys}
                        onDropdownChange={(fieldId, value) => void updateField(fieldId, fieldId, { value })}
                        onChecklistToggle={( fieldId, itemId, completed, ) => void updateField(
                                             fieldId,`${fieldId}:${itemId}`, { itemId, completed }, )
                        }
                    />
                ))}
            </div>
        </section>
    );
};

export default TaskCustomFields;


