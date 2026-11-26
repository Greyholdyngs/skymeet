
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { queryKeys } from "../../lib/queries/query-key";

import type { DashboardProject } from "../../components/dashboard/homepage/DashboardProjectSection";

interface DashboardUser {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
}

interface DashboardProjectReference {
    _id: string;
    name: string;
}

export interface DashboardTask {
    _id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
    projectId: DashboardProjectReference;
}

export interface DashboardActivity {
    _id: string;
    projectId: DashboardProjectReference;
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

interface DashboardSummary {
    totalProjects: number;
    recentProjects: DashboardProject[];
    myTasksCount: number;
    myTasks: DashboardTask[];
    overdueTasks: number;
    upcomingDeadline: {
        taskId: string;
        title: string;
        dueDate: string;
        project: DashboardProjectReference;
    } | null;
    upcomingDeadlinesCount: number;
    recentActivityCount: number;
    recentActivity: DashboardActivity[];
}

export const useDashboardData = () => {
    const { data, isPending, error: queryError, refetch } = useQuery({
        queryKey: queryKeys.dashboard.summary(),
        queryFn: async () => {
            const [projects, summary, user] = await Promise.all([
                apiFetch<DashboardProject[]>("/projects"),
                apiFetch<DashboardSummary>("/dashboard/summary"),
                apiFetch<DashboardUser>("/auth/me"),
            ]);

            return { projects, summary, user };
        },
    });

    const projects = data?.projects ?? [];
    const summary = data?.summary ?? null;
    const user = data?.user ?? null;

    const loading = isPending;
    const error = queryError instanceof Error ? queryError.message : "";

    const isNewUser = !loading && !error && projects.length === 0;

    return {
        projects,
        summary,
        user,
        loading,
        error,
        isNewUser,
        reload: refetch,
    };
};
