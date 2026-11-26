"use client";

import { Calendar, Clock, Users, X, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type { Meeting } from "@/app/types/meeting";

import MeetingStatusBadge from "./MeetingStatus";

interface MeetingDetailsDrawerProps {
    meeting: Meeting | null;
    open: boolean;
    currentUserId: string | null;
    onClose: () => void;
    onRespond: (response: "accepted" | "declined") => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    projectName?: string;
}

const MeetingDetailsDrawer = ({meeting, open, currentUserId, onClose, onRespond, onCancel,
                                isSubmitting = false, projectName, }: MeetingDetailsDrawerProps) => {

    if (!open || !meeting) return null;

    const isOrganizer = currentUserId === meeting.hostId;
    const currentAttendee = meeting.participants.find((participant) => participant.id === currentUserId);
    const canRespond = !isOrganizer && currentAttendee?.response === "pending" && meeting.status === "scheduled";

    const canCancel = isOrganizer && meeting.status === "scheduled";
    const startTime = new Date(meeting.scheduledFor).getTime();
    const endTime = startTime + meeting.duration * 60 * 1000;

    const now = Date.now();
    const isMeetingActive = now >= startTime && now < endTime;
    const canJoin = meeting.status === "scheduled" && Boolean(meeting.meetingLink) && isMeetingActive &&
                                                    (isOrganizer || currentAttendee?.response === "accepted");

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
        <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md translate-x-0 flex-col border-l theme-border theme-surface shadow-2xl transition-transform duration-1000 ease-in-out">
            <div className="flex items-center justify-between border-b theme-border px-6 py-5">
                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider theme-text-muted"> Meeting details </p>
                    <h2 className="mt-1 truncate text-lg font-semibold theme-text"> {meeting.title} </h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl theme-text-muted transition theme-surface-hover"
                    aria-label="Close meeting details"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                    <MeetingStatusBadge status={meeting.status} />
                    <div className="space-y-3">
                        <DetailRow
                            icon={<Users size={17} />}
                            label="Meeting type"
                            value={ meeting.scope === "project" ? "Project meeting" : "General meeting" }
                        />
                        {meeting.scope === "project" && (
                            <DetailRow
                            icon={<Calendar size={17} />}
                            label="Project"
                            value={projectName || "Project"}
                            />
                        )}
                    </div>
                    <div className="space-y-3">
                        <DetailRow
                            icon={<Calendar size={17} />}
                            label="Date"
                            value={new Date(meeting.scheduledFor).toLocaleString()}
                        />
                        <DetailRow
                            icon={<Clock size={17} />}
                            label="Duration"
                            value={`${meeting.duration} minutes`}
                        />
                        <DetailRow
                            icon={<Users size={17} />}
                            label="Participants"
                            value={`${meeting.participants.length} ${
                            meeting.participants.length === 1 ? "person" : "people"
                            }`}
                        />
                    </div>
                    {meeting.description && (
                        <div>
                            <p className="mb-2 text-xs font-medium theme-text-muted"> Description </p>
                            <p className="whitespace-pre-wrap text-sm leading-6 theme-text-secondary"> {meeting.description} </p>
                        </div>
                    )}
                    {meeting.meetingLink && (
                        <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl border theme-border theme-surface-elevated px-4 py-3 text-sm theme-text transition theme-surface-hover"
                        >
                            Open meeting link
                            <ExternalLink size={16} />
                        </a>
                    )}
                    <div>
                    <p className="mb-3 text-xs font-medium theme-text-muted"> Attendees </p>
                    {meeting.participants.length === 0 ? (
                        <p className="text-sm theme-text-muted"> No attendees have been invited. </p>
                    ) : (
                        <div className="space-y-2">
                            {meeting.participants.map((participant) => (
                                <div
                                    key={participant.id}
                                    className="flex items-center justify-between gap-3 rounded-xl border theme-border theme-surface-elevated px-4 py-3"
                                 >
                                    <span className="min-w-0 truncate text-sm theme-text">
                                        {participant.name}
                                        {participant.id === currentUserId ? " (You)" : ""}
                                    </span>
                                    <span className="shrink-0 text-xs capitalize theme-text-muted"> {participant.response} </span>
                                </div>
                            ))}
                        </div>
                    )}
                    </div>
                </div>
            </div>
            {(canRespond || canCancel || canJoin) && (
                <div className="space-y-3 border-t theme-border p-6">
                    {canJoin && (
                        <button
                            type="button"
                            onClick={() => window.open( meeting.meetingLink!, "_blank", "noopener,noreferrer")}
                            className="w-full rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
                        >
                            Join Meeting
                        </button>
                    )}
                    {canRespond && (
                        <>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => onRespond("accepted")}
                                className="w-full rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Accept invitation
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => onRespond("declined")}
                                className="w-full rounded-xl border theme-border px-4 py-3 text-sm font-medium theme-text-secondary transition theme-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Decline invitation
                            </button>
                        </>
                    )}
                    {canCancel && (
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onCancel}
                            className="w-full rounded-xl border border-red-500/20 px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel meeting
                        </button>
                    )}
                </div>
            )}
        </aside>
        </>
    );
};

export default MeetingDetailsDrawer;

function DetailRow({ icon, label, value,}: { icon: ReactNode; label: string; value: string;}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border theme-border theme-surface-elevated px-4 py-3">
            <div className="theme-text-muted">{icon}</div>
            <div className="min-w-0">
                <p className="text-xs theme-text-muted">{label}</p>
                <p className="mt-0.5 truncate text-sm theme-text">{value}</p>
            </div>
        </div>
    );
}