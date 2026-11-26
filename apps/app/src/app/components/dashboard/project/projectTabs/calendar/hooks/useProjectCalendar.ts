"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";
import { getProjectMeetings } from "@/app/lib/meeting/meeting-service";

import { queryKeys } from "@/app/lib/queries/query-key";
import type { CalendarEvent } from "../types";
import { formatDateKey, formatEventTime } from "../utils";

interface ProjectTask {
    _id: string;
    title: string;
    dueDate?: string | null;
}

interface UseProjectCalendarResult {
    events: CalendarEvent[];
    isLoading: boolean;
    error: string | null;
}

export function useProjectCalendar( projectId: string ): UseProjectCalendarResult {
    const { data, isPending, error } = useQuery({
        queryKey: queryKeys.projects.calendar(projectId),
        enabled: Boolean(projectId),
        queryFn: async () => {
            const [tasks, meetings] = await Promise.all([
                apiFetch<ProjectTask[]>(
                    `/projects/${projectId}/tasks`,
                ),
                getProjectMeetings(projectId),
            ]);

            const taskEvents: CalendarEvent[] = tasks.filter((task) => task.dueDate).map((task) => ({
                    id: `task-${task._id}`,
                    title: task.title,
                    date: formatDateKey(new Date(task.dueDate!)),
                    type: "task",
                }));

            const meetingEvents: CalendarEvent[] = meetings.filter((meeting) => meeting.status === "scheduled")
                .map((meeting) => ({
                    id: `meeting-${meeting.id}`,
                    title: meeting.title,
                    date: formatDateKey(new Date(meeting.scheduledFor)),
                    type: "meeting",
                    time: formatEventTime(meeting.scheduledFor),
                }));

            return [...taskEvents, ...meetingEvents];
        },
    });

    return {
        events: data ?? [],
        isLoading: isPending,
        error: error instanceof Error ? error.message : null,
    };
}
