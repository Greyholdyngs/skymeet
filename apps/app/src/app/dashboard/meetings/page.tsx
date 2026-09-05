"use client";
import MeetingHeader, { MeetingView } from "@/app/components/dashboard/meeting/MeetingHeader";
import MeetingActions from "@/app/components/dashboard/meeting/MeetingAction";
import MeetingList from "@/app/components/dashboard/meeting/MeetingList";

import MeetingFilters from "@/app/components/dashboard/meeting/Meeting-Filter";
import { useEffect, useState } from "react";
import { filterMeetings, MeetingFilter, MeetingAction } from "@/app/lib/meeting/meeting-util";

import ScheduleMeetingModal, { ScheduleMeetingData } from "@/app/components/dashboard/meeting/ScheduleMeetingModal";
import { Meeting } from "@/app/types/meeting";
import { getMeetings } from "@/app/lib/meeting/meeting-service";

import JoinMeetingModal from "@/app/components/dashboard/meeting/JoinMeetingModal";
import MeetingDetailsDrawer from "@/app/components/dashboard/meeting/MeetingDetailsModal";

const MeetingPage = () => {
    const [view, setView] = useState<MeetingView>("meetings");
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [filter, setFilter] = useState<MeetingFilter>("all");

    const [isLoading, setIsLoading] = useState(true);
    const filteredMeetings = filterMeetings( meetings, filter );

    useEffect(() => {
        async function loadMeetings() {
            try {
                const data = await getMeetings();
                setMeetings(data);
            } catch (error) {
                console.error("Failed to load meetings:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadMeetings();
    }, []);

    const handleInstantMeeting = () => {
        console.log("Starting instant meeting...");
    };

    const handleScheduleMeeting = (data: ScheduleMeetingData ) => {
        console.log("Scheduling meeting:", data);

        const newMeeting: Meeting = {
            id: crypto.randomUUID(),
            title: data.title,
            date: data.date,
            time: data.time,
            status: "scheduled",
            hostId: "current-user",
            participants: [],
        };

        setMeetings((current) => [
            newMeeting,
            ...current,
        ]);

        setIsScheduleModalOpen(false);
    };

    const handleJoinMeeting = ( meetingCode: string) => {
        console.log("Joining meeting:", meetingCode);
        setIsJoinModalOpen(false);
    };

    const handleMeetingAction = ( meeting: Meeting, action: MeetingAction ) => {
        switch (action) {
            case "details":
            setSelectedMeeting(meeting);

            setIsDetailsDrawerOpen(true);
            break;

            case "start":
            console.log("Starting meeting:", meeting);
            break;

            case "continue":
            console.log("Continuing meeting:", meeting);
            break;

            case "join":
            console.log("Joining meeting:", meeting);
            break;
        }
    };

    return (
        <section className="space-y-8 p-6 md:p-8">
            <div className="space-y-6">
                <MeetingHeader activeView={view} onViewChange={setView} />
                {
                    view === "meetings" ? (
                    <>
                        <MeetingActions
                            onCreateInstant={handleInstantMeeting}
                            onSchedule={() => setIsScheduleModalOpen(true)}
                            onJoin={() => setIsJoinModalOpen(true)}
                        />
                        <MeetingFilters
                            activeFilter={filter}
                            onChange={setFilter}
                        />
                        <MeetingList
                            meetings={filteredMeetings}
                            onMeetingAction={handleMeetingAction}
                        />
                    </>
                    ) : (
                    <>
                        <div className="flex flex-col justify-center items-center min-h-screen">
                            <h2 className="text-2xl font-semibold text-white">Recordings</h2>
                            <p className="mt-1 text-sm text-white/40">Recordings from your completed meetings will appear here.</p>
                        </div>
                    </>
                )}
            </div>
            <ScheduleMeetingModal
                open={isScheduleModalOpen}
                onClose={() =>
                setIsScheduleModalOpen(false)
                }
                onSchedule={handleScheduleMeeting}
            />
            <JoinMeetingModal
                open={isJoinModalOpen}
                onClose={() =>
                setIsJoinModalOpen(false)
                }
                onJoin={handleJoinMeeting}
            />
            <MeetingDetailsDrawer
                meeting={selectedMeeting}
                open={isDetailsDrawerOpen}
                onClose={() => {
                    setIsDetailsDrawerOpen(false);
                    setSelectedMeeting(null);
                }}
            />
        </section>
    )
}

export default MeetingPage