"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";

import { queryKeys } from "@/app/lib/queries/query-key";
import type { Project } from "@/app/types/project";
import type { ProjectPeopleResponse, Sprint, SprintStatus, SprintTask,} from "../types";

interface SprintData {
    sprints: Sprint[];
    tasks: SprintTask[];
    isManager: boolean;
}

export const useProjectSprints = (project: Project) => {
    const queryClient = useQueryClient();
    const [actionError, setActionError] = useState("");

    const projectId = project._id;

    const { data, isPending, error, refetch } = useQuery({
        queryKey: queryKeys.projects.sprints(projectId),
        enabled: Boolean(projectId),
        queryFn: async (): Promise<SprintData> => {
            const [sprintData, taskData, peopleData, currentUser] =
                await Promise.all([
                    apiFetch<{ sprints: Sprint[] }>( `/projects/${projectId}/sprints`, ),
                    apiFetch<SprintTask[]>( `/projects/${projectId}/tasks`, ),
                    apiFetch<ProjectPeopleResponse>( `/projects/${projectId}/people`, ),
                    apiFetch<{ id: string }>("/auth/me"),
                ]);

            const currentMember = peopleData.members.find(
                (member) => member.user._id === currentUser.id,
            );

            return {
                sprints: sprintData.sprints,
                tasks: taskData,
                isManager: currentMember?.role === "owner" || currentMember?.role === "admin",
            };
        },
    });

    const actionMutation = useMutation< void, Error, () => Promise<void>>({
        mutationFn: (action) => action(),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: queryKeys.projects.sprints(projectId),
                }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.projects.tasks(projectId),
                }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.projects.overview(projectId),
                }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.projects.calendar(projectId),
                }),
            ]);
        },
    });

    const runAction = async ( action: () => Promise<void>,): Promise<boolean> => {
        try {
            setActionError("");
            await actionMutation.mutateAsync(action);
            return true;

        } catch (err) {
            setActionError( err instanceof Error ? err.message : "Unable to complete the action.",);
            return false;
        }
    };

    const createSprint = (data: { name: string; description: string; startDate: string; endDate: string; }) =>
        runAction(async () => {
            await apiFetch(`/projects/${projectId}/sprints`, {
                method: "POST",
                body: JSON.stringify(data),
            });
        });

    const updateSprintStatus = ( sprintId: string, status: SprintStatus, ) => runAction(async () => {
            await apiFetch(
                `/projects/${projectId}/sprints/${sprintId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                },
            );
        });

    const deleteSprint = (sprintId: string) => runAction(async () => {
            await apiFetch(
                `/projects/${projectId}/sprints/${sprintId}`,
                { method: "DELETE" },
            );
        });

    const assignTask = (taskId: string, sprintId: string) => runAction(async () => {
            await apiFetch(
                `/projects/${projectId}/tasks/${taskId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        sprintId: sprintId || null,
                    }),
                },
            );
        });

    const loadData = async () => {
        await refetch();
    };

    return {
        sprints: data?.sprints ?? [],
        tasks: data?.tasks ?? [],
        isManager: data?.isManager ?? false,
        loading: isPending,
        error: actionError || (error instanceof Error ? error.message : ""),
        setError: setActionError,
        actionLoading: actionMutation.isPending,
        createSprint,
        updateSprintStatus,
        deleteSprint,
        assignTask,
        loadData,
    };
};
