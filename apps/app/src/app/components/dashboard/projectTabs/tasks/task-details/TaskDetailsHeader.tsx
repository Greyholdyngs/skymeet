"use client";

import { X } from "lucide-react";
import type { Task } from "../types/types";

interface TaskDetailsHeaderProps {
    task: Task;
    onClose: () => void;
}

const statusLabels = {
    todo: "To Do",
    in_progress: "In Progress",
    task_review: "Task Review",
    completed: "Completed",
};

const TaskDetailsHeader = ({ task, onClose }: TaskDetailsHeaderProps) => {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="min-w-0">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-white/30"> Task </p>
                <h2 className="truncate text-lg font-semibold text-white"> {task.title} </h2>
                <span className="mt-2 inline-flex rounded-md bg-white/5 px-2 py-1 text-xs text-white/50"> {statusLabels[task.status]} </span>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                aria-label="Close task details"
            >
                <X size={18} />
            </button>
        </div>
    );
};
export default TaskDetailsHeader;