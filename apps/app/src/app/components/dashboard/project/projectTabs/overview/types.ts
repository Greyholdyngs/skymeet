import type { TaskStatus } from "../tasks/types/types";

export interface ProjectOverviewTask {
    _id: string;
    title: string;
    status: TaskStatus;
}

export interface ProjectOverviewActivity {
    _id: string;
    projectId: { _id: string; name: string; };
    actorId: {
        _id: string;
        firstName: string;
        lastName: string;
        userName: string;
    } | null;
    entityType: "project" | "task" | "sprint";
    entityId: string;
    action: string;
    entityTitle: string;
    fromStatus: string | null;
    toStatus: string | null;
    reviewDecision: string | null;
    createdAt: string;
}

export interface ProjectActivityResponse {
    data: ProjectOverviewActivity[];
}