"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";

import { queryKeys } from "@/app/lib/queries/query-key";
import type { AttendeeSource, AttendeeUser, MeetingAttendee, ProjectMember} from "./attendee-types";

interface UseMeetingAttendeesOptions {
    scope: "general" | "project";
    projectId?: string;
    currentUserId: string;
    initialAttendees?: MeetingAttendee[];
}

const getUserName = (user: AttendeeUser) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return fullName || user.userName || "SkyMeet user";
};

export const useMeetingAttendees = ({ scope,  projectId, currentUserId, initialAttendees = [],
                                    }: UseMeetingAttendeesOptions) => {

    const queryClient = useQueryClient();

    const [attendees, setAttendees] = useState<AttendeeSource[]>(() =>
        initialAttendees.filter((attendee) => attendee.id !== currentUserId).map((attendee) => ({
                attendee,
                projectIds: [],
                individuallyAdded: true,
            })),
    );

    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchQuery.trim());
        }, 350);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const projectMembersQuery = useQuery({
        queryKey: queryKeys.projects.attendeeMembers(projectId ?? ""),
        queryFn: () => apiFetch<ProjectMember[]>(`/projects/${projectId}/members`),
        enabled: scope === "project" && !!projectId,
    });

    const userSearchQuery = useQuery({
        queryKey: queryKeys.users.directory(debouncedSearch),
        queryFn: () => apiFetch<AttendeeUser[]>(
                `/users/directory?q=${encodeURIComponent(debouncedSearch)}`,
            ),
        enabled: scope === "general" && debouncedSearch.length >= 2,
    });

    const searchResults = useMemo(
        () => (userSearchQuery.data ?? []).filter( (user) => user._id !== currentUserId, ),
        [userSearchQuery.data, currentUserId],
    );

    const loadingProjects = scope === "project" && (projectMembersQuery.isLoading || projectMembersQuery.isFetching);

    const searching = scope === "general" && debouncedSearch.length >= 2 && (searchQuery.trim() !== debouncedSearch || userSearchQuery.isFetching);

    useEffect(() => {
        if (scope !== "project" || !projectId || !projectMembersQuery.data) {
            return;
        }

        setAttendees(
            projectMembersQuery.data.filter((member) => member.userId?._id !== currentUserId).map((member) => ({
                    attendee: {
                        id: member.userId._id,
                        name: getUserName(member.userId),
                        userName: member.userId.userName,
                    },
                    projectIds: [projectId],
                    individuallyAdded: false,
                })),
        );
    }, [scope, projectId, currentUserId, projectMembersQuery.data]);

    useEffect(() => {
        if (scope !== "project" || !projectMembersQuery.error) return;

        setError( projectMembersQuery.error instanceof Error ? projectMembersQuery.error.message : "Unable to load project members.",);
    }, [scope, projectMembersQuery.error]);

    useEffect(() => {
        if (scope === "general") {
            setSelectedProjectIds([]);
            setAttendees((previous) => previous.filter((item) => item.individuallyAdded),);
        }
    }, [scope]);

    useEffect(() => {
        if (scope !== "general") return;

        if (userSearchQuery.error) {
            setError( userSearchQuery.error instanceof Error ? userSearchQuery.error.message : "Unable to search users.",);

        } else if (debouncedSearch.length >= 2) {
            setError("");
        }
    }, [scope, userSearchQuery.error, debouncedSearch]);

    const addProjectMembers = useCallback(
        async (selectedProjectId: string) => {
            try {
                setError("");

                const members = await queryClient.fetchQuery({
                    queryKey: queryKeys.projects.attendeeMembers(selectedProjectId),
                    queryFn: () =>
                        apiFetch<ProjectMember[]>(
                            `/projects/${selectedProjectId}/members`,
                        ),
                });

                setAttendees((previous) => {
                    const updated = [...previous];

                    members.forEach((member) => {
                        const user = member.userId;

                        if (!user?._id || user._id === currentUserId) {
                            return;
                        }

                        const existingIndex = updated.findIndex(
                            (item) => item.attendee.id === user._id,
                        );

                        if (existingIndex >= 0) {
                            const existing = updated[existingIndex];

                            if (!existing.projectIds.includes(selectedProjectId)) {
                                updated[existingIndex] = {
                                    ...existing,
                                    projectIds: [
                                        ...existing.projectIds,
                                        selectedProjectId,
                                    ],
                                };
                            }

                            return;
                        }

                        updated.push({
                            attendee: {
                                id: user._id,
                                name: getUserName(user),
                                userName: user.userName,
                            },
                            projectIds: [selectedProjectId],
                            individuallyAdded: false,
                        });
                    });

                    return updated;
                });

                return true;
            } catch (err) {
                setError( err instanceof Error ? err.message : "Unable to load project members.", );

                return false;
            }
        },
        [currentUserId, queryClient],
    );

    const removeProjectMembers = useCallback((removedProjectId: string) => {
        setAttendees((previous) =>
            previous.map((item) => ({
                    ...item,
                    projectIds: item.projectIds.filter(
                        (id) => id !== removedProjectId,
                    ),
                })).filter((item) => item.individuallyAdded || item.projectIds.length > 0,),
        );
    }, []);

    const toggleProject = useCallback(
        async (id: string) => {
            if (selectedProjectIds.includes(id)) {
                setSelectedProjectIds((previous) => previous.filter((projectId) => projectId !== id),);

                removeProjectMembers(id);
                return;
            }

            const loaded = await addProjectMembers(id);

            if (loaded) {
                setSelectedProjectIds((previous) => previous.includes(id) ? previous : [...previous, id], );
            }
        },
        [selectedProjectIds, addProjectMembers, removeProjectMembers],
    );

    const addIndividualAttendee = useCallback(
        (user: AttendeeUser) => {
            if (user._id === currentUserId) return;

            setAttendees((previous) => {
                const existing = previous.find( (item) => item.attendee.id === user._id, );

                if (existing) {
                    return previous.map((item) => item.attendee.id === user._id ? { ...item, individuallyAdded: true } : item,);
                }

                return [
                    ...previous,
                    {
                        attendee: {
                            id: user._id,
                            name: getUserName(user),
                            userName: user.userName,
                        },
                        projectIds: [],
                        individuallyAdded: true,
                    },
                ];
            });

            setSearchQuery("");
            setDebouncedSearch("");
        },
        [currentUserId],
    );

    const removeAttendee = useCallback((id: string) => {
        setAttendees((previous) => previous.filter((item) => item.attendee.id !== id));
    }, []);

    const isSelected = useCallback(
        (id: string) => attendees.some((item) => item.attendee.id === id),
        [attendees],
    );

    const selectedAttendees = useMemo(
        () => attendees.map((item) => item.attendee),
        [attendees],
    );

    return {
        attendees: selectedAttendees,
        selectedProjectIds,
        searchQuery,
        searchResults,
        loadingProjects,
        searching,
        error,
        setSearchQuery,
        toggleProject,
        addIndividualAttendee,
        removeAttendee,
        isSelected,
    };
};

