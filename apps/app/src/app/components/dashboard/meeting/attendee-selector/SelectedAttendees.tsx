"use client";

import { Users, X } from "lucide-react";
import type { MeetingAttendee } from "./attendee-types";

interface SelectedAttendeesProps {
    attendees: MeetingAttendee[];
    onRemove: (id: string) => void;
}

const SelectedAttendees = ({attendees,onRemove }: SelectedAttendeesProps) => {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium theme-text-secondary"> Selected attendees </label>
                <span className="text-xs theme-text-muted"> {attendees.length} selected </span>
            </div>
        {attendees.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl border border-dashed theme-border p-4">
                <Users size={18} className="theme-text-muted" />
                <p className="text-sm theme-text-muted"> No attendees selected yet. </p>
            </div>
        ) : (
            <div className="flex flex-wrap gap-2">
                {attendees.map((attendee) => (
                    <div
                        key={attendee.id}
                        className="flex max-w-full items-center gap-2 rounded-full border theme-border theme-surface-elevated py-2 pl-3 pr-2"
                    >
                        <span className="truncate text-sm theme-text"> {attendee.name} </span>
                        <button
                            type="button"
                            onClick={() => onRemove(attendee.id)}
                            aria-label={`Remove ${attendee.name}`}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full theme-text-muted transition theme-surface-hover"
                        >
                            <X size={13} />
                        </button>
                    </div>
                ))}
            </div>
        )}
        </div>
    );
};

export default SelectedAttendees;
