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
    onDrop: ( event: React.DragEvent<HTMLDivElement>, status: TaskStatus ) => void;
    onTaskClick: (task: Task) => void;
}

const TaskColumn = ({title, status, tasks, projectId, draggedTaskId, dragOverStatus, onDragStart, onDragEnd, 
                    onDragOver, onDragLeave, onDrop, onTaskClick}: TaskColumnProps) => {
    return (
        <section className="max-h-105 rounded-2xl border border-white/10 bg-[#14141B] overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full
                         ${ status === "todo" ? "bg-white/40" : status === "in_progress" ? "bg-blue-400" : status === "task_review" ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                    />
                    <h3 className="text-sm font-semibold text-white">
                        {title}
                    </h3>
                    <span className="text-xs text-white/30">
                        {tasks.length}
                    </span>
                </div>
                <button
                    type="button"
                    className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/5 hover:text-white"
                    aria-label={`Add task to ${title}`}
                >
                    <Plus size={16} />
                </button>
            </div>
            <div className="space-y-3 p-3">
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
                    <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-white/10">
                        <p className="text-xs text-white/25"> No tasks </p>
                    </div>
                )}
            </div>
            <button
                type="button"
                className="flex w-full items-center gap-2 px-4 pb-4 pt-1 text-sm text-white/30 transition hover:text-white"
            >
                <Plus size={15} />
                Add task
            </button>
        </section>
    );
}
export default TaskColumn