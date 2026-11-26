
"use client";

import { CalendarDays, MoreHorizontal, User } from "lucide-react";
import type { Task, TaskAssignee } from "./types/types";

interface TaskCardProps {
    task: Task;
    projectId: string;
    draggedTaskId: string | null;
    onDragStart: (taskId: string) => void;
    onDragEnd: () => void;
    onClick: (task: Task) => void;
}

const TaskCard = ({ task, draggedTaskId, onDragStart, onDragEnd, onClick,}: TaskCardProps) => {
    const isDragging = draggedTaskId === task.id;

    const assignees = (task.assigneeIds ?? []).filter((assignee): assignee is TaskAssignee => typeof assignee !== "string");

    const formattedDueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
          }) : "No due date";

    const priorityStyles = {
        low: "bg-slate-500/10 text-slate-500",
        medium: "bg-blue-500/10 text-blue-500",
        high: "bg-orange-500/10 text-orange-500",
        urgent: "bg-red-500/10 text-red-500",
    };

    const priority = task.priority ?? "medium";

    return (
        <article
            draggable
            onClick={() => onClick(task)}
            onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", task.id);
                onDragStart(task.id);
            }}
            onDragEnd={onDragEnd}
            className={`group min-w-0 cursor-grab rounded-xl border theme-border theme-surface-elevated p-3 transition sm:p-4 ${
                isDragging ? "scale-[0.98] cursor-grabbing opacity-40" : "hover:border-[#7C3AED]/40 hover:theme-surface-hover" }`}
        >
            <div className="flex min-w-0 items-start justify-between gap-2">
                <h4 className="min-w-0 wrap-break-word text-sm font-medium leading-5 theme-text"> {task.title} </h4>
                <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    className="shrink-0 rounded-md p-1 theme-text-muted transition hover:theme-surface-hover hover:theme-text sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Task options"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>
            <div className="mt-3">
                <span  className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium capitalize ${priorityStyles[priority]}`}> {priority} </span>
            </div>
            <div className="mt-3 flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg theme-surface-hover theme-text-muted">
                    <User size={14} />
                </span>
                {assignees.length > 0 ? (
                    <span className="min-w-0 truncate text-xs theme-text-secondary"> {assignees.map((assignee) => assignee.userName).join(", ")} </span>
                ) : (
                    <span className="text-xs theme-text-muted"> Unassigned </span>
                )}
            </div>
            <div className="mt-3 flex min-w-0 items-center gap-1.5 text-xs theme-text-secondary">
                <CalendarDays size={13} className="shrink-0" />
                <span className="truncate">{formattedDueDate}</span>
            </div>
        </article>
    );
};

export default TaskCard;

