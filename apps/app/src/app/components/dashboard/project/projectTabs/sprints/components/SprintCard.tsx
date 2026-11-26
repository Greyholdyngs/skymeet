
"use client";

import { CalendarDays, CheckCircle2, Trash2, Plus } from "lucide-react";
import { formatSprintDate, getSprintProgress } from "../sprint-utils";
import type { Sprint, SprintStatus, SprintTask } from "../types";

interface SprintCardProps {
    sprint: Sprint;
    sprints: Sprint[];
    tasks: SprintTask[];
    isManager: boolean;
    actionLoading: boolean;
    onStatusChange: (id: string, status: SprintStatus) => void;
    onDelete: (sprint: Sprint) => void;
    onAssignTask: (taskId: string, sprintId: string) => void;
    onCreateTask: (sprintId: string) => void;
}

const statusStyles: Record<SprintStatus, string> = {
    planned: "bg-blue-500/10 text-blue-400",
    active: "bg-emerald-500/10 text-emerald-400",
    completed: "theme-surface-elevated theme-text-muted",
};

const SprintCard = ({ sprint, sprints, tasks, isManager, actionLoading, onStatusChange, onDelete,
                     onAssignTask, onCreateTask, }: SprintCardProps) => {
    const progress = getSprintProgress(tasks);

    return (
        <div className="min-w-0 rounded-xl border theme-border theme-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h3 className="wrap-break-word font-semibold theme-text"> {sprint.name} </h3>
                    {sprint.description && (
                        <p className="mt-1 wrap-break-word text-sm theme-text-secondary"> {sprint.description} </p>
                    )}
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs capitalize ${statusStyles[sprint.status]}`}> {sprint.status} </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs theme-text-secondary">
                <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {formatSprintDate(sprint.startDate)}
                </span>
                <span>to</span>
                <span>{formatSprintDate(sprint.endDate)}</span>
            </div>
            <div className="mt-5">
                <div className="flex justify-between gap-2 text-xs">
                    <span className="theme-text-secondary">Sprint progress</span>
                    <span className="theme-text">{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full theme-surface-elevated">
                    <div
                        className="h-full rounded-full bg-[#7C3AED] transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="mt-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <h4 className="text-sm font-medium theme-text">
                            Sprint tasks
                        </h4>
                        <span className="text-xs theme-text-muted">
                            {tasks.length} tasks
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => onCreateTask(sprint._id)}
                        className="flex items-center gap-1.5 rounded-lg bg-[#7C3AED]/10 px-2.5 py-1.5 text-xs font-medium text-purple-500 transition hover:bg-[#7C3AED]/20"
                    >
                        <Plus size={14} />
                        Add task
                    </button>
                </div>
                {tasks.length === 0 ? (
                    <p className="rounded-lg border border-dashed theme-border p-4 text-center text-xs theme-text-muted"> No tasks assigned to this sprint. </p>
                ) : (
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg theme-surface-elevated p-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="wrap-break-word text-sm theme-text"> {task.title} </p>
                                    <p className="mt-1 text-xs capitalize theme-text-muted"> {task.status.replace("_", " ")} </p>
                                </div>
                                {isManager && (
                                    <select
                                        value={task.sprintId ?? ""}
                                        disabled={actionLoading}
                                        onChange={(event) => onAssignTask(task._id, event.target.value)}
                                        aria-label={`Change sprint for ${task.title}`}
                                        className="max-w-full min-w-0 rounded-md border theme-border theme-surface px-2 py-1.5 text-xs theme-text outline-none focus:border-[#7C3AED]"
                                    >
                                        <option value="">Backlog</option>
                                        {sprints.filter((option) => option.status !== "completed").map((option) => (
                                                <option key={option._id} value={option._id}>
                                                    {option.name}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {isManager && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t theme-border-subtle pt-4">
                    <div className="flex flex-wrap gap-2">
                        {sprint.status === "planned" && (
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => onStatusChange(sprint._id, "active")}
                                className="rounded-lg bg-[#7C3AED] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#6D28D9] disabled:opacity-40"
                            >
                                Start sprint
                            </button>
                        )}
                        {sprint.status === "active" && (
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => onStatusChange(sprint._id, "completed")}
                                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-40"
                            >
                                <CheckCircle2 size={14} className="mr-1 inline" />
                                Complete sprint
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => onDelete(sprint)}
                        aria-label={`Delete ${sprint.name}`}
                        className="rounded-lg p-2 theme-text-muted transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SprintCard;
