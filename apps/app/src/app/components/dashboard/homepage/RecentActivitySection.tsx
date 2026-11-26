import Link from "next/link";
import { Activity, ArrowUpRight, FolderKanban, ListTodo, Zap } from "lucide-react";
import type { DashboardActivity } from "../../../dashboard/hooks/useDashboardData";

interface RecentActivitySectionProps {
  activities: DashboardActivity[];
  loading: boolean;
}

const actionMessages: Record<string, string> = {
    task_created: "created a task",
    task_updated: "updated a task",
    task_started: "started working on a task",
    task_submitted_for_review: "submitted a task for review",
    task_reviewed: "reviewed a task",
    task_deleted: "deleted a task",
    project_created: "created a project",
    project_updated: "updated a project",
    project_deleted: "deleted a project",
    sprint_created: "created a sprint",
    sprint_updated: "updated a sprint",
    sprint_deleted: "deleted a sprint",
};

const getActivityHref = (activity: DashboardActivity) => {
    const projectId = activity.projectId._id;

    if (activity.entityType === "project") {
        return `/dashboard/projects/${activity.entityId}`;
    }

    if (activity.entityType === "task") {
        if (activity.action === "task_deleted") {
        return `/dashboard/projects/${projectId}/tasks`;
        }

        return `/dashboard/projects/${projectId}/tasks?taskId=${activity.entityId}`;
    }

    return `/dashboard/projects/${projectId}/tasks?sprintId=${activity.entityId}`;
};

const getActivityIcon = (entityType: string) => {
    switch (entityType) {
        case "project":
        return FolderKanban;

        case "task":
        return ListTodo;

        case "sprint":
        return Zap;

        default:
        return Activity;
    }
};

const formatActivityDate = (date: string) => {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
};

const RecentActivitySection = ({ activities, loading }: RecentActivitySectionProps) => {
    return (
        <section className="min-w-0 rounded-2xl border theme-border theme-surface p-4 sm:p-6">
            <div className="mb-5">
                <h2 className="text-lg font-semibold theme-text">Recent Activity</h2>
                <p className="mt-1 text-sm theme-text-secondary"> The latest updates across your projects </p>
            </div>
            {loading ? (
                <div className="space-y-4" aria-label="Loading activity">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                        key={item}
                        className="h-14 animate-pulse rounded-xl theme-surface-elevated"
                        />
                    ))}
                </div>
            ) : activities.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center text-center">
                    <Activity className="mb-3 theme-text-muted" size={28} />
                    <p className="text-sm font-medium theme-text">No recent activity</p>
                    <p className="mt-1 text-xs theme-text-secondary"> Project and task updates will appear here. </p>
                </div>
            ) : (
                <div className="space-y-2">
                {activities.slice(0, 5).map((activity) => {
                    const Icon = getActivityIcon(activity.entityType);
                    const actorName = activity.actorId ? `${activity.actorId.firstName} ${activity.actorId.lastName}`.trim() : "Someone";

                    return (
                    <Link
                        key={activity._id}
                        href={getActivityHref(activity)}
                        className="group flex min-w-0 items-start gap-3 rounded-xl p-3 transition hover:bg-black/5"
                    >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#7C3AED]/10 text-[#7C3AED]">
                            <Icon size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="wrap-break-word text-sm leading-5 theme-text-secondary">
                                <span className="font-medium theme-text">{actorName}</span>{" "} {actionMessages[activity.action] ?? "updated"}{" "}
                                <span className="font-medium theme-text"> {activity.entityTitle} </span>
                            </p>
                            <p className="mt-1 truncate text-xs theme-text-muted">
                                {activity.projectId.name} ·{" "}
                                {formatActivityDate(activity.createdAt)}
                            </p>
                        </div>
                        <ArrowUpRight
                            size={15}
                            className="mt-1 shrink-0 theme-text-muted transition group-hover:text-[#7C3AED]"
                        />
                    </Link>
                    );
                })}
                </div>
            )}
        </section>
    );
};

export default RecentActivitySection;
