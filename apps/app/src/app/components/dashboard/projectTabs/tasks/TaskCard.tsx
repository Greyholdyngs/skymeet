"use client";

import { CalendarDays, MoreHorizontal, User } from "lucide-react";
import type { Task } from "./types/types";

interface TaskCardProps {
    task: Task;
    projectId: string;
    draggedTaskId: string | null;
    onDragStart: (taskId: string) => void;
    onDragEnd: () => void;
    onClick: (task: Task) => void;
}

const TaskCard = ({ task, draggedTaskId, onDragStart, onDragEnd, onClick }: TaskCardProps) => {
    const isDragging = draggedTaskId === task.id;

    return (
        <article
            draggable
            onClick={() => onClick(task)}
            onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData( "text/plain", task.id);
                onDragStart(task.id);
            }}
            onDragEnd={onDragEnd}
            className={`group cursor-grab rounded-xl border border-white/10 bg-[#1A1A23] p-4 transition ${
                isDragging ? "scale-[0.98] cursor-grabbing opacity-40" : "hover:border-[#7C3AED]/40 hover:bg-[#1D1D27]"}`}>
            <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-medium leading-5 text-white"> {task.title} </h4>
                <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    className="shrink-0 rounded-md p-1 text-white/25 opacity-0 transition hover:bg-white/5 hover:text-white group-hover:opacity-100"
                    aria-label="Task options"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/30">
                    <User size={14} />
                </span>
                <span className="text-xs text-white/30"> Unassigned </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-white/30">
                <span className="flex items-center gap-1.5">
                    <CalendarDays size={13} /> No due date
                </span>
            </div>
        </article>
    );
};
export default TaskCard;