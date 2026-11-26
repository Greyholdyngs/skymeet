"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";

import { queryKeys } from "@/app/lib/queries/query-key";
import TaskColumn from "./TaskColumn";
import TaskDetails from "./task-details/TaskDetails";

import type { Task, TaskStatus, TaskAssignee, CustomField } from "./types/types";

interface TaskBoardProps {
    projectId: string;
}

interface TaskRecord {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: Task["priority"];
    assigneeIds?: (string | TaskAssignee)[];
    reviewerId?: string | TaskAssignee | null;
    dueDate?: string | null;
    sprintId?: string | null;
    customFields?: Task["customFields"];
}

interface StatusMutation {
    taskId: string;
    from: TaskStatus;
    to: TaskStatus;
}

interface ReviewMutation {
    taskId: string;
    decision: "approved" | "changes_requested";
    comment?: string;
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
    const queryClient = useQueryClient();
    const taskQueryKey = queryKeys.projects.tasks(projectId);

    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

    const [actionError, setActionError] = useState("");

    const { data: tasks = [], isPending, error } = useQuery({
        queryKey: taskQueryKey,
        enabled: Boolean(projectId),

        queryFn: async () => {
            const data = await apiFetch<TaskRecord[]>(
                `/projects/${projectId}/tasks`,
            );

            return data.map((task): Task => ({
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                assigneeIds: task.assigneeIds ?? [],
                reviewerId: task.reviewerId ?? null,
                dueDate: task.dueDate,
                sprintId: task.sprintId,
                customFields: task.customFields ?? [],
            }));
        },
    });

    const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;

    const invalidateTaskQueries = async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: taskQueryKey, }),
            queryClient.invalidateQueries({ queryKey: queryKeys.projects.overview(projectId), }),
            queryClient.invalidateQueries({ queryKey: queryKeys.projects.calendar(projectId), }),
        ]);
    };

    const statusMutation = useMutation({
        mutationFn: async ({ taskId, from, to }: StatusMutation) => {
            let endpoint = "";

            if (from === "todo" && to === "in_progress") {
                endpoint = `/projects/${projectId}/tasks/${taskId}/start`;

            } else if (from === "in_progress" && to === "task_review") {
                endpoint = `/projects/${projectId}/tasks/${taskId}/submit-review`;

            } else if (from === "task_review" && to === "in_progress") {
                endpoint = `/projects/${projectId}/tasks/${taskId}/return-to-progress`;
            }

            if (!endpoint) {
                throw new Error("Invalid task status transition.");
            }

            await apiFetch(endpoint, { method: "PATCH" });
        },
        onSettled: invalidateTaskQueries,
    });

    const reviewMutation = useMutation({
        mutationFn: async ({ taskId, decision, comment, }: ReviewMutation) => {
            await apiFetch(
                `/projects/${projectId}/tasks/${taskId}/review`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        decision,
                        ...(comment !== undefined ? { comment } : {}),
                    }),
                },
            );
        },
        onSettled: invalidateTaskQueries,
    });

    const canMoveTask = (from: TaskStatus, to: TaskStatus) => {
        return (
            (from === "todo" && to === "in_progress") ||
            (from === "in_progress" && to === "task_review") ||
            (from === "task_review" && to === "in_progress")
        );
    };

    const handleDragStart = (taskId: string) => {
        setDraggedTaskId(taskId);
    };

    const handleDragEnd = () => {
        setDraggedTaskId(null);
        setDragOverStatus(null);
    };

    const handleDragOver = ( event: React.DragEvent<HTMLDivElement>, status: TaskStatus ) => {
        event.preventDefault();

        if (!draggedTaskId) return;

        const draggedTask = tasks.find( (task) => task.id === draggedTaskId );

        if (!draggedTask || !canMoveTask(draggedTask.status, status)) {
            return;
        }

        setDragOverStatus(status);
    };

    const handleDragLeave = () => {
        setDragOverStatus(null);
    };

    const handleDrop = async ( event: React.DragEvent<HTMLDivElement>, status: TaskStatus ) => {
        event.preventDefault();

        if (!draggedTaskId) return;

        const draggedTask = tasks.find(
            (task) => task.id === draggedTaskId,
        );

        if (!draggedTask || !canMoveTask(draggedTask.status, status)) {
            handleDragEnd();
            return;
        }

        if ( draggedTask.status === "in_progress" && status === "task_review" && !draggedTask.reviewerId ) {
            setActionError("Assign a reviewer before submitting this task.");
            handleDragEnd();
            return;
        }

        const previousTasks = tasks;
        const previousStatus = draggedTask.status;

        setActionError("");

        queryClient.setQueryData<Task[]>(taskQueryKey, (current) =>
            current?.map((task) => task.id === draggedTask.id ? { ...task, status } : task,),
        );

        handleDragEnd();

        try {
            await statusMutation.mutateAsync({
                taskId: draggedTask.id,
                from: previousStatus,
                to: status,
            });
        } catch (err) {
            queryClient.setQueryData(taskQueryKey, previousTasks);

            setActionError( err instanceof Error ? err.message : "Unable to update task status." );
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTaskId(task.id);
    };

    const handleApproveTask = async (taskId: string) => {
        setActionError("");

        try {
            await reviewMutation.mutateAsync({
                taskId,
                decision: "approved",
            });
        } catch (err) {
            setActionError( err instanceof Error ? err.message : "Unable to approve task.", );
        }
    };

    const handleRequestChanges = async ( taskId: string, comment: string, ) => {
        setActionError("");

        try {
            await reviewMutation.mutateAsync({
                taskId,
                decision: "changes_requested",
                comment,
            });
        } catch (err) {
            setActionError( err instanceof Error ? err.message : "Unable to request changes.", );
        }
    };

    const handleCustomFieldsUpdated = ( taskId: string, fieldId: string,
        update: | { value: string } | { itemId: string; completed: boolean } ) => {

        const updateFields = ( fields: CustomField[] | undefined ): CustomField[] =>
            (fields ?? []).map((field) => {
                if (field.id !== fieldId) return field;

                if ("value" in update) {
                    return { ...field, value: update.value };
                }

                return {
                    ...field,
                    items: (field.items ?? []).map((item) => item.id === update.itemId ? { ...item, completed: update.completed } : item, ),
                };
            });

        queryClient.setQueryData<Task[]>(taskQueryKey, (current) =>
            current?.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          customFields: updateFields(task.customFields),
                      } : task,
            ),
        );
    };

    const todoTasks = tasks.filter((task) => task.status === "todo");
    const inProgressTasks = tasks.filter( (task) => task.status === "in_progress", );
    const reviewTasks = tasks.filter( (task) => task.status === "task_review",);

    const completedTasks = tasks.filter( (task) => task.status === "completed",);

    if (isPending) {
        return (
            <div className="py-12 text-center text-sm theme-text-secondary"> Loading tasks... </div>
        );
    }

    return (
        <>
            {(actionError || error) && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                    {actionError || (error instanceof Error ? error.message : "Unable to load project tasks.")}
                </div>
            )}

            <div className="overflow-x-auto pb-4 hide-scrollbar">
                <div className="grid min-w-275 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <TaskColumn
                        title="To Do"
                        status="todo"
                        tasks={todoTasks}
                        projectId={projectId}
                        draggedTaskId={draggedTaskId}
                        dragOverStatus={dragOverStatus}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onTaskClick={handleTaskClick}
                    />
                    <TaskColumn
                        title="In Progress"
                        status="in_progress"
                        tasks={inProgressTasks}
                        projectId={projectId}
                        draggedTaskId={draggedTaskId}
                        dragOverStatus={dragOverStatus}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onTaskClick={handleTaskClick}
                    />
                    <TaskColumn
                        title="Task Review"
                        status="task_review"
                        tasks={reviewTasks}
                        projectId={projectId}
                        draggedTaskId={draggedTaskId}
                        dragOverStatus={dragOverStatus}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onTaskClick={handleTaskClick}
                    />
                    <TaskColumn
                        title="Complete"
                        status="completed"
                        tasks={completedTasks}
                        projectId={projectId}
                        draggedTaskId={draggedTaskId}
                        dragOverStatus={dragOverStatus}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onTaskClick={handleTaskClick}
                    />
                </div>
            </div>
            <TaskDetails
                task={selectedTask}
                isOpen={Boolean(selectedTask)}
                onClose={() => setSelectedTaskId(null)}
                onApproveTask={handleApproveTask}
                onRequestChanges={handleRequestChanges}
                projectId={projectId}
                onCustomFieldsUpdated={handleCustomFieldsUpdated}
            />
        </>
    );
};

export default TaskBoard;

