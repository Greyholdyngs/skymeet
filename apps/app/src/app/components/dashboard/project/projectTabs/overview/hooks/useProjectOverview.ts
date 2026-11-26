"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";
import { queryKeys } from "@/app/lib/queries/query-key";

import type { ProjectActivityResponse, ProjectOverviewActivity, ProjectOverviewTask } from "../types";

interface UseProjectOverviewResult {
    tasks: ProjectOverviewTask[];
    activities: ProjectOverviewActivity[];
    loading: boolean;
    error: string | null;
}

export function useProjectOverview( projectId: string ): UseProjectOverviewResult {
    const { data, isPending, error } = useQuery({
        queryKey: queryKeys.projects.overview(projectId),
        enabled: Boolean(projectId),
        queryFn: async () => {
            const [tasks, activityResponse] = await Promise.all([
                apiFetch<ProjectOverviewTask[]>( `/projects/${projectId}/tasks`, ),
                apiFetch<ProjectActivityResponse>(`/activity/projects/${projectId}?limit=5`, ),
            ]);

            return {
                tasks,
                activities: activityResponse.data,
            };
        },
    });

    return {
        tasks: data?.tasks ?? [],
        activities: data?.activities ?? [],
        loading: isPending,
        error: error instanceof Error ? error.message : null,
    };
}