"use client";
import { useState } from "react";
import type { Project } from "@/app/types/project";
import type { CreateTaskInput, CustomField, TaskPriority } from "../types/types";

import TaskBasicFields from "./TaskBasicFields";
import TaskAssignmentFields from "./TaskAssignmentFields";
import CustomFieldsSection from "./CustomFieldsSection";

interface CreateTaskFormProps {
    project: Project;
    onCancel: () => void;
    onSubmit: () => void;
}

const CreateTaskForm = ({ project, onCancel, onSubmit }: CreateTaskFormProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [sprintDuration, setSprintDuration] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

    const [customFields, setCustomFields] = useState<CustomField[]>([]);
    const handleSubmit = ( event: React.FormEvent<HTMLFormElement> ) => {
        event.preventDefault();

        const input: CreateTaskInput = {
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate || undefined,
            sprintDuration: sprintDuration.trim() || undefined,
            assigneeIds,
            priority,
            customFields,
        };

        console.log("Create task:", input);
        onSubmit();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-col"
        >
            <div className="overflow-y-auto px-5 py-6 sm:px-6">
                <div className="space-y-6">
                    <TaskBasicFields
                        title={title}
                        description={description}
                        dueDate={dueDate}
                        sprintDuration={ sprintDuration }
                        priority={priority}
                        onTitleChange={setTitle}
                        onDescriptionChange={ setDescription }
                        onDueDateChange={setDueDate}
                        onSprintDurationChange={ setSprintDuration }
                        onPriorityChange={setPriority}
                    />
                    <TaskAssignmentFields
                        project={project}
                        assigneeIds={assigneeIds}
                        onChange={setAssigneeIds}
                    />
                    <CustomFieldsSection
                        fields={customFields}
                        onChange={setCustomFields}
                    />
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!title.trim()}
                    className="rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Create task
                </button>
            </div>
        </form>
    );
};
export default CreateTaskForm;