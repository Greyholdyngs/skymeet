"use client";

import { useCallback, useState } from "react";
import { X } from "lucide-react";
import MeetingAttendeeSelector from "./attendee-selector/MeetingAttendeeSelector";

import MeetingScopeFields from "./schedule-form/MeetingScopeFields";
import MeetingDetailsFields from "./schedule-form/MeetingDetailField";
import ScheduleMeetingActions from "./schedule-form/ScheduleMeetingAction";

import type { MeetingAttendee } from "./attendee-selector/attendee-types";
import type { ScheduleMeetingData, ScheduleMeetingModalProps,} from "./schedule-form/schedule-meeting-types";

const ScheduleMeetingModal = ({ open, onClose, onSchedule, projects, currentUserId}: ScheduleMeetingModalProps) => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [scope, setScope] = useState<"general" | "project">("general");
    const [projectId, setProjectId] = useState("");
    const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);

    const [meetingLink, setMeetingLink] = useState("");

    const handleAttendeesChange = useCallback(
        (nextAttendees: MeetingAttendee[]) => {
            setAttendees(nextAttendees);
        },
        []
    );

    const handleScopeChange = (nextScope: "general" | "project") => {
        setScope(nextScope);
        setProjectId("");
        setAttendees([]);
    };

    const handleProjectChange = (nextProjectId: string) => {
        setProjectId(nextProjectId);
        setAttendees([]);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!currentUserId || !title.trim() || !date || !time) return;
        if (attendees.length === 0) return;
        if (scope === "project" && !projectId) return;

        const data: ScheduleMeetingData = {
            title: title.trim(),
            date,
            time,
            scope,
            projectId: scope === "project" ? projectId : undefined,
            attendeeIds: attendees.map((attendee) => attendee.id),
            meetingLink: meetingLink.trim(),
        };

        onSchedule?.(data);
        if (!meetingLink.trim()) return;
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
            <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border theme-border theme-surface shadow-2xl .hide-scrollbar">
                <header className="flex shrink-0 items-center justify-between border-b theme-border px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold theme-text"> Schedule Meeting </h2>
                        <p className="mt-1 text-sm theme-text-secondary"> Set up your meeting and choose its attendees. </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="flex h-9 w-9 items-center justify-center rounded-lg theme-text-muted transition theme-surface-hover"
                    >
                        <X size={18} />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto p-6">
                <MeetingScopeFields
                    scope={scope}
                    projectId={projectId}
                    projects={projects}
                    onScopeChange={handleScopeChange}
                    onProjectChange={handleProjectChange}
                />
                <MeetingDetailsFields
                    title={title}
                    date={date}
                    time={time}
                    onTitleChange={setTitle}
                    onDateChange={setDate}
                    onTimeChange={setTime}
                    meetingLink={meetingLink}
                    onMeetingLinkChange={setMeetingLink}
                />
                {currentUserId && (
                    <MeetingAttendeeSelector
                    scope={scope}
                    projects={projects}
                    projectId={projectId || undefined}
                    currentUserId={currentUserId}
                    onChange={handleAttendeesChange}
                    />
                )}
                {currentUserId && attendees.length === 0 && (
                    <p className="text-xs text-amber-500"> Select at least one attendee. </p>
                )}
                <ScheduleMeetingActions
                    disabled={ !currentUserId || !title.trim() || !date || !time || attendees.length === 0 ||
                                (scope === "project" && !projectId) || !meetingLink.trim() }
                    onCancel={onClose}
                />
                </form>
            </div>
        </div>
    );
};

export default ScheduleMeetingModal;
