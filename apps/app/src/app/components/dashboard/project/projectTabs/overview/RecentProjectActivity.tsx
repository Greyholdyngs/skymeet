import Link from "next/link";
import type { ProjectOverviewActivity } from "./types";

interface RecentProjectActivityProps {
    activities: ProjectOverviewActivity[];
    projectId: string;
}

const ACTION_LABELS: Record<string, string> = {
    task_created: "created a task",
    task_updated: "updated a task",
    task_started: "started a task",
    task_submitted_for_review: "submitted a task for review",
    task_reviewed: "reviewed a task",
    task_deleted: "deleted a task",
    project_created: "created the project",
    project_updated: "updated the project",
    project_deleted: "deleted the project",
    sprint_created: "created a sprint",
    sprint_updated: "updated a sprint",
    sprint_deleted: "deleted a sprint",
};

const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
};

const RecentProjectActivity = ({ activities, projectId }: RecentProjectActivityProps) => {
    return (
        <section className="rounded-xl border theme-border theme-surface p-5">
            <h3 className="font-semibold theme-text">Recent activity</h3>
            {activities.length === 0 ? (
                <p className="mt-5 text-sm theme-text-secondary"> No project activity yet. </p>
            ) : (
                <div className="mt-5 divide-y theme-border">
                    {activities.map((activity) => {

                        const actor = activity.actorId?.firstName || activity.actorId?.userName || "Someone";
                        const action = ACTION_LABELS[activity.action] || activity.action.replaceAll("_", " ");

                        const isTask = activity.entityType === "task";
                        const isDeleted = activity.action.endsWith("_deleted");

                        return (
                            <div
                                key={activity._id}
                                className="py-4 first:pt-0 last:pb-0"
                            >
                                <p className="text-sm leading-6 theme-text-secondary">
                                    <span className="font-medium theme-text"> {actor} </span>{" "} {action}{" "}
                                    {activity.entityTitle &&
                                        (isTask && !isDeleted ? (
                                            <Link
                                                href={`/dashboard/projects/${projectId}/tasks?taskId=${activity.entityId}`}
                                                className="font-medium text-[#00A1CC] hover:underline"
                                            >
                                                {activity.entityTitle}
                                            </Link>
                                        ) : (
                                            <span className="font-medium theme-text"> {activity.entityTitle} </span>
                                        ))}
                                </p>
                                <p className="mt-1 text-xs theme-text-muted"> {formatDate(activity.createdAt)} </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default RecentProjectActivity;