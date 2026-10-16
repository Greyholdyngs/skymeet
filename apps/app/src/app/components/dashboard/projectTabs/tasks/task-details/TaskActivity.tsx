"use client";

import { Activity, ArrowRightLeft, CheckCircle2, ClipboardList, MessageSquare, UserRound, } from "lucide-react";
import type { Task } from "../types/types";

interface TaskActivityProps {
    task: Task;
}

type ActivityType =
    | "created"
    | "status_changed"
    | "assigned"
    | "review_submitted"
    | "commented";

interface ActivityEvent {
    id: string;
    taskId: string;
    actor: string;
    type: ActivityType;
    description: string;
    createdAt: string;
}

const MOCK_ACTIVITY: Record<string, ActivityEvent[]> = {
    "1": [
        {
            id: "activity-1",
            taskId: "1",
            actor: "Emmanuel Grey",
            type: "created",
            description: "created this task",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        },
        {
            id: "activity-2",
            taskId: "1",
            actor: "Emmanuel Grey",
            type: "status_changed",
            description: "moved the task to In Progress",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        },
    ],
    "4": [
        {
            id: "activity-3",
            taskId: "4",
            actor: "Jane Smith",
            type: "created",
            description: "created this task",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
            id: "activity-4",
            taskId: "4",
            actor: "Jane Smith",
            type: "review_submitted",
            description: "submitted the task for review",
            createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
    ],
};

const ACTIVITY_ICONS = {
    created: ClipboardList,
    status_changed: ArrowRightLeft,
    assigned: UserRound,
    review_submitted: CheckCircle2,
    commented: MessageSquare,
};

const TaskActivity = ({ task }: TaskActivityProps) => {
    const activities = MOCK_ACTIVITY[task.id] ?? [];

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Activity size={17} className="text-white/40" />
                <h3 className="text-sm font-semibold text-white"> Activity </h3>
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/40"> {activities.length} </span>
            </div>
            {activities.length > 0 ? (
                <div className="relative space-y-5 pl-1">
                    <div className="absolute bottom-3 left-[13px] top-3 w-px bg-white/10" />

                    {activities.map((event) => {
                        const Icon = ACTIVITY_ICONS[event.type];

                        return (
                            <article
                                key={event.id}
                                className="relative flex items-start gap-3"
                            >
                                <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#17171F]">
                                    <Icon
                                        size={13}
                                        className="text-white/50"
                                    />
                                </div>
                                <div className="min-w-0 flex-1 pt-0.5">
                                    <p className="text-sm leading-6 text-white/60">
                                        <span className="font-medium text-white/85"> {event.actor} </span>{" "} {event.description}
                                    </p>
                                    <time
                                        dateTime={event.createdAt}
                                        className="mt-1 block text-xs text-white/30"
                                    >
                                        {formatActivityTime(event.createdAt)}
                                    </time>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
                    <p className="text-sm text-white/45"> No activity yet </p>
                    <p className="mt-1 text-xs text-white/30"> Task updates will appear here. </p>
                </div>
            )}
        </section>
    );
};

const formatActivityTime = (value: string): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown time";
    }

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export default TaskActivity;