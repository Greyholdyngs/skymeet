"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project } from "@/app/types/project";

import type { CreateTaskInput, CustomField, TaskPriority } from "../types/types";
import TaskBasicFields from "./TaskBasicFields";
import TaskAssignmentFields from "./TaskAssignmentFields";

import CustomFieldsSection from "./CustomFieldsSection";
import { apiFetch } from "@/app/lib/api";
import { queryKeys } from "@/app/lib/queries/query-key";

interface SprintOption {
    _id: string;
    name: string;
    status: "planned" | "active" | "completed";
}

interface CreateTaskFormProps {
    project: Project;
    initialSprintId?: string | null;
    onCancel: () => void;
    onSubmit: () => void;
}

const CreateTaskForm = ({ project, initialSprintId, onCancel, onSubmit }: CreateTaskFormProps) => {
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
    const [customFields, setCustomFields] = useState<CustomField[]>([]);

    const [sprintId, setSprintId] = useState(initialSprintId ?? "");
    const [submitError, setSubmitError] = useState("");
    const [reviewerId, setReviewerId] = useState("");

    const sprintsQuery = useQuery({
        queryKey: queryKeys.projects.sprints(project._id),
        queryFn: async () => {
            const data = await apiFetch<{ sprints: SprintOption[] }>(
                `/projects/${project._id}/sprints`,
            );

            return data.sprints.filter(
                (sprint) => sprint.status !== "completed",
            );
        },
        enabled: Boolean(project._id),
    });

    const createTaskMutation = useMutation({
        mutationFn: (payload: CreateTaskInput) =>
            apiFetch(`/projects/${project._id}/tasks`, {
                method: "POST",
                body: JSON.stringify(payload),
            }),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.projects.tasks(project._id), }),
                queryClient.invalidateQueries({ queryKey: queryKeys.projects.overview(project._id), }),
                queryClient.invalidateQueries({ queryKey: queryKeys.projects.calendar(project._id), }),
                queryClient.invalidateQueries({ queryKey: queryKeys.projects.sprints(project._id), }),
            ]);

            onSubmit();
        },
    });

    const creating = createTaskMutation.isPending;
    const sprints = sprintsQuery.data ?? [];

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim() || !reviewerId || creating) return;

        setSubmitError("");

        const payload: CreateTaskInput = {
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate || undefined,
            sprintId: sprintId || null,
            assigneeIds,
            reviewerId: reviewerId || undefined,
            priority,
            customFields,
        };

        try {
            await createTaskMutation.mutateAsync(payload);
        } catch (error) {
            setSubmitError( error instanceof Error ? error.message : "Unable to create task.", );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
            <div className="overflow-y-auto px-5 py-6 sm:px-6">
                <div className="space-y-6">
                    <TaskBasicFields
                        title={title}
                        description={description}
                        dueDate={dueDate}
                        priority={priority}
                        onTitleChange={setTitle}
                        onDescriptionChange={setDescription}
                        onDueDateChange={setDueDate}
                        onPriorityChange={setPriority}
                    />
                    <div>
                        <label
                            htmlFor="task-sprint"
                            className="mb-2 block text-sm font-medium text-white/70"
                        >
                            Sprint
                        </label>
                        <select
                            id="task-sprint"
                            value={sprintId}
                            onChange={(event) => setSprintId(event.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white outline-none focus:border-[#7C3AED]"
                        >
                            <option value="">Backlog — No sprint</option>
                            {sprints.map((sprint) => (
                                <option key={sprint._id} value={sprint._id}>
                                    {sprint.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <TaskAssignmentFields
                        project={project}
                        assigneeIds={assigneeIds}
                        onChange={setAssigneeIds}
                        reviewerId={reviewerId}
                        onReviewerChange={setReviewerId}
                    />
                    <CustomFieldsSection
                        fields={customFields}
                        onChange={setCustomFields}
                    />
                </div>
            </div>
            {submitError && ( <p role="alert" className="px-5 text-sm text-red-400 sm:px-6"> {submitError} </p> )}
            {sprintsQuery.error && (
                <p role="alert" className="px-5 text-sm text-red-400 sm:px-6">
                    {sprintsQuery.error instanceof Error ? sprintsQuery.error.message : "Unable to load sprints."}
                </p>
            )}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!title.trim() || !reviewerId || creating}
                >
                    {creating ? "Creating..." : "Create task"}
                </button>
            </div>
        </form>
    );
};

export default CreateTaskForm;

