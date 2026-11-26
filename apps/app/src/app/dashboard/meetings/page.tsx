"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MeetingHeader from "@/app/components/dashboard/meeting/MeetingHeader";

import MeetingActions from "@/app/components/dashboard/meeting/MeetingAction";
import MeetingList from "@/app/components/dashboard/meeting/MeetingList";
import MeetingFilters from "@/app/components/dashboard/meeting/Meeting-Filter";

import ScheduleMeetingModal from "@/app/components/dashboard/meeting/ScheduleMeetingModal";
import MeetingDetailsDrawer from "@/app/components/dashboard/meeting/MeetingDetailsModal";
import type { ScheduleMeetingData } from "@/app/components/dashboard/meeting/schedule-form/schedule-meeting-types";

import { filterMeetings, type MeetingFilter } from "@/app/lib/meeting/meeting-util";
import type { Meeting } from "@/app/types/meeting";
import { getMeetings, createMeeting, respondToMeeting, cancelMeeting } from "@/app/lib/meeting/meeting-service";

import { apiFetch } from "@/app/lib/api";
import type { Project } from "@/app/types/project";
import { queryKeys } from "@/app/lib/queries/query-key";

interface CurrentUser {
    id: string;
}

const MeetingPage = () => {
    const queryClient = useQueryClient();

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
    const [filter, setFilter] = useState<MeetingFilter>("all");
    const [isMeetingActionSubmitting, setIsMeetingActionSubmitting] = useState(false);

    const [, setRefreshTick] = useState(0);

    const meetingsQuery = useQuery({
        queryKey: queryKeys.meetings.list(),
        queryFn: getMeetings,
    });

    const currentUserQuery = useQuery({
        queryKey: queryKeys.users.profile(),
        queryFn: () => apiFetch<CurrentUser>("/auth/me"),
    });

    const projectsQuery = useQuery({
        queryKey: queryKeys.projects.lists(),
        queryFn: () => apiFetch<Project[]>("/projects"),
    });

    const meetings = meetingsQuery.data ?? [];
    const projects = projectsQuery.data ?? [];
    const currentUserId = currentUserQuery.data?.id ?? null;

    const isLoading = meetingsQuery.isLoading;
    const filteredMeetings = filterMeetings(meetings, filter);

    const createMeetingMutation = useMutation({
        mutationFn: createMeeting,
        onSuccess: (newMeeting) => {
            queryClient.setQueryData<Meeting[]>(
                queryKeys.meetings.list(),
                (current) => [...(current ?? []), newMeeting],
            );
        },
    });

    const respondMutation = useMutation({
        mutationFn: ({ meetingId, response }: {
            meetingId: string;
            response: "accepted" | "declined";
        }) => respondToMeeting(meetingId, response),
    });

    const cancelMutation = useMutation({
        mutationFn: cancelMeeting,
    });

    useEffect(() => {
        if (meetings.length === 0) return;

        const meetingId = new URLSearchParams( window.location.search ).get("meetingId");

        if (!meetingId) return;

        const targetMeeting = meetings.find( (meeting) => meeting.id === meetingId, );

        if (targetMeeting) {
            setSelectedMeeting(targetMeeting);
            setIsDetailsDrawerOpen(true);
        }
    }, [meetings]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshTick((current) => current + 1);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleScheduleMeeting = async (data: ScheduleMeetingData) => {
        try {
            const startAt = new Date(`${data.date}T${data.time}`);

            if (Number.isNaN(startAt.getTime()) || startAt <= new Date()) {
                throw new Error("Please select a valid future date and time.");
            }

            const endAt = new Date(startAt.getTime() + 60 * 60 * 1000);

            await createMeetingMutation.mutateAsync({
                scope: data.scope,
                projectId: data.projectId,
                title: data.title,
                startAt: startAt.toISOString(),
                endAt: endAt.toISOString(),
                attendeeIds: data.attendeeIds,
                meetingLink: data.meetingLink,
            });

            setIsScheduleModalOpen(false);
        } catch (error) {
            console.error("Failed to schedule meeting:", error);

            alert( error instanceof Error ? error.message : "Failed to schedule meeting. Please try again.", );
        }
    };

    const handleMeetingResponse = async ( response: "accepted" | "declined" ) => {
        if (!selectedMeeting || !currentUserId) return;

        setIsMeetingActionSubmitting(true);

        try {
            await respondMutation.mutateAsync({
                meetingId: selectedMeeting.id,
                response,
            });

            const updatedMeeting = {
                ...selectedMeeting,
                participants: selectedMeeting.participants.map(
                    (participant) => participant.id === currentUserId ? { ...participant, response } : participant,
                ),
            };

            queryClient.setQueryData<Meeting[]>(
                queryKeys.meetings.list(),
                (current) => current?.map((meeting) => meeting.id === updatedMeeting.id ? updatedMeeting : meeting,),
            );

            setSelectedMeeting(updatedMeeting);
        } catch (error) {
            alert( error instanceof Error ? error.message : "Failed to update your invitation response.", );

        } finally {
            setIsMeetingActionSubmitting(false);
        }
    };

    const handleCancelMeeting = async () => {
        if (!selectedMeeting) return;

        if (!window.confirm("Are you sure you want to cancel this meeting?")) {
            return;
        }

        setIsMeetingActionSubmitting(true);

        try {
            await cancelMutation.mutateAsync(selectedMeeting.id);

            const updatedMeeting = {
                ...selectedMeeting,
                status: "cancelled" as const,
            };

            queryClient.setQueryData<Meeting[]>(
                queryKeys.meetings.list(),
                (current) => current?.map((meeting) => meeting.id === updatedMeeting.id ? updatedMeeting : meeting, ),
            );

            setSelectedMeeting(updatedMeeting);
        } catch (error) {
            alert( error instanceof Error ? error.message : "Failed to cancel this meeting.", );

        } finally {
            setIsMeetingActionSubmitting(false);
        }
    };

    return (
        <section className="space-y-8 p-6 md:p-8">
            <div className="space-y-6">
                <MeetingHeader />
                <MeetingActions
                    onSchedule={() => setIsScheduleModalOpen(true)}
                />
                <MeetingFilters
                    activeFilter={filter}
                    onChange={setFilter}
                />
                <MeetingList
                    meetings={filteredMeetings}
                    isLoading={isLoading}
                    userId={currentUserId}
                    onMeetingAction={(meeting) => {
                        setSelectedMeeting(meeting);
                        setIsDetailsDrawerOpen(true);
                    }}
                />
            </div>
            <ScheduleMeetingModal
                open={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSchedule={handleScheduleMeeting}
                projects={projects}
                currentUserId={currentUserId ?? ""}
            />
            <MeetingDetailsDrawer
                meeting={selectedMeeting}
                open={isDetailsDrawerOpen}
                currentUserId={currentUserId}
                isSubmitting={isMeetingActionSubmitting}
                projectName={projects.find((project) => project._id === selectedMeeting?.projectId)?.name}
                onRespond={handleMeetingResponse}
                onCancel={handleCancelMeeting}
                onClose={() => {
                    setIsDetailsDrawerOpen(false);
                    setSelectedMeeting(null);
                }}
            />
        </section>
    );
};

export default MeetingPage;

