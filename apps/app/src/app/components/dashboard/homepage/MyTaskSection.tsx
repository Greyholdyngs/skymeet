import Link from "next/link";
import { CalendarDays, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { DashboardTask } from "../../../dashboard/hooks/useDashboardData";

interface MyTasksSectionProps {
    tasks: DashboardTask[];
    loading: boolean;
}

const statusLabels: Record<string, string> = {
    todo: "To do",
    in_progress: "In progress",
    task_review: "In review",
};

const priorityStyles: Record<string, string> = {
    low: "theme-text-muted",
    medium: "text-blue-500",
    high: "text-orange-500",
    urgent: "text-red-500",
};

const formatDueDate = (date: string | null) => {
    if (!date) return "No due date";

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const MyTasksSection = ({ tasks, loading }: MyTasksSectionProps) => {
    return (
        <section className="min-w-0 rounded-2xl border theme-border theme-surface p-4 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold theme-text">My Tasks</h2>
                    <p className="mt-1 text-sm theme-text-secondary"> Your most recently created tasks</p>
                </div>
                <span className="rounded-full theme-surface-elevated px-3 py-1 text-xs theme-text-secondary"> {loading ? "..." : `${tasks.length} shown`} </span>
            </div>
            {loading ? (
                <div className="space-y-3" aria-label="Loading tasks">
                    {[1, 2, 3].map((item) => (
                        <div
                        key={item}
                        className="h-20 animate-pulse rounded-xl theme-surface-elevated"
                        />
                    ))}
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center text-center">
                    <CheckCircle2 className="mb-3 theme-text-muted" size={28} />
                    <p className="text-sm font-medium theme-text"> No active tasks yet </p>
                    <p className="mt-1 text-xs theme-text-secondary"> Tasks assigned to you will appear here. </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.slice(0, 3).map((task) => (
                        <Link
                            key={task._id}
                            href={`/dashboard/projects/${task.projectId._id}/tasks?taskId=${task._id}`}
                            className="group block min-w-0 rounded-xl border theme-border-subtle theme-surface-elevated p-3 transition hover:border-[#7C3AED]/40 hover:bg-black/5 sm:p-4"
                        >
                            <div className="flex min-w-0 items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="wrap-break-word text-sm font-medium theme-text transition group-hover:text-[#7C3AED]"> {task.title} </h3>
                                    <p className="mt-1 truncate text-xs theme-text-secondary"> {task.projectId.name} </p>
                                </div>
                                <ArrowUpRight
                                    size={16}
                                    className="shrink-0 theme-text-muted transition group-hover:text-[#7C3AED]"
                                />
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                                <span className="theme-text-secondary"> {statusLabels[task.status] ?? task.status} </span>
                                <span className={priorityStyles[task.priority] ?? "theme-text-secondary"}>
                                    {task.priority}
                                </span>
                                <span className="flex items-center gap-1 theme-text-secondary">
                                    <CalendarDays size={13} />
                                    {formatDueDate(task.dueDate)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyTasksSection;