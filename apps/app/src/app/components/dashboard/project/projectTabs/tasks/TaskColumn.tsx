
"use client";

import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "./types/types";

interface TaskColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    projectId: string;
    draggedTaskId: string | null;
    dragOverStatus: TaskStatus | null;
    onDragStart: (taskId: string) => void;
    onDragEnd: () => void;
    onDragOver: ( event: React.DragEvent<HTMLDivElement>, status: TaskStatus ) => void;
    onDragLeave: () => void;
    onDrop: ( event: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
    onTaskClick: (task: Task) => void;
}

const TaskColumn = ({ title, status, tasks, projectId, draggedTaskId, dragOverStatus, onDragStart, onDragEnd,
                     onDragOver, onDragLeave, onDrop, onTaskClick }: TaskColumnProps) => {
    return (
        <section className="max-h-105 overflow-y-auto rounded-2xl border theme-border theme-surface hide-scrollbar">
            <div className="flex items-center justify-between border-b theme-border-subtle px-4 py-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${ status === "todo" ? "bg-gray-400"
                                : status === "in_progress" ? "bg-blue-400" : status === "task_review" ? "bg-amber-400" : "bg-emerald-400" }`}
                    />
                    <h3 className="text-sm font-semibold theme-text"> {title} </h3>
                    <span className="text-xs theme-text-muted"> {tasks.length} </span>
                </div>
                <button
                    type="button"
                    className="rounded-lg p-1.5 theme-text-muted transition hover:theme-surface-hover hover:theme-text"
                    aria-label={`Add task to ${title}`}
                >
                    <Plus size={16} />
                </button>
            </div>
            <div
                className={`space-y-3 rounded-b-2xl p-3 transition-colors ${
                    dragOverStatus === status ? "bg-[#7C3AED]/10 ring-1 ring-inset ring-[#7C3AED]/40" : "" }`}
                onDragOver={(event) => onDragOver(event, status)}
                onDragLeave={onDragLeave}
                onDrop={(event) => onDrop(event, status)}
            >
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            projectId={projectId}
                            draggedTaskId={draggedTaskId}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onClick={onTaskClick}
                        />
                    ))
                ) : (
                    <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed theme-border">
                        <p className="text-xs theme-text-muted"> No tasks </p>
                    </div>
                )}
            </div>
            <button
                type="button"
                className="flex w-full items-center gap-2 px-4 pb-4 pt-1 text-sm theme-text-muted transition hover:theme-text"
            >
                <Plus size={15} />
                Add task
            </button>
        </section>
    );
};

export default TaskColumn;
