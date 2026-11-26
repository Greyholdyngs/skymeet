"use client";

import { Calendar, Clock, Users } from "lucide-react";
import type { Meeting } from "@/app/types/meeting";
import { getMeetingAction, type MeetingAction } from "@/app/lib/meeting/meeting-util";

import MeetingStatusBadge from "./MeetingStatus";

interface MeetingCardProps {
  meeting: Meeting;
  onAction?: (meeting: Meeting, action: MeetingAction) => void;
  userId: string | null;
}

const MeetingCard = ({meeting, onAction, userId,}: MeetingCardProps) => {
  const action = userId ? getMeetingAction(meeting, userId) : "details";
  const isHost = userId !== null && meeting.hostId === userId;

  const currentAttendee = meeting.participants.find(
    (participant) => participant.id === userId,
  );

  return (
    <article className="rounded-3xl border theme-border theme-surface p-5 transition hover:border-[#6D28D9] hover:shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="truncate font-medium theme-text"> {meeting.title} </h3>
            <MeetingStatusBadge status={meeting.status} />
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm theme-text-secondary">
            {meeting.scheduledFor && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={15} />
                {new Date(meeting.scheduledFor).toLocaleString()}
              </span>
            )}
            {meeting.duration && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} />
                {meeting.duration} min
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Users size={15} />
              {meeting.participants.length}
            </span>
          </div>
          <p className="mt-2 text-xs theme-text-muted">
            {isHost ? "You are hosting" : currentAttendee?.response === "accepted" ? "Invitation accepted"
                    : currentAttendee?.response === "declined" ? "Invitation declined" : "Awaiting your response"}
          </p>
        </div>
        <MeetingActionButton
          action={action}
          onClick={() => {
            if (action === "join" && meeting.meetingLink) {
              window.open(meeting.meetingLink, "_blank", "noopener,noreferrer");
              return;
            }

            onAction?.(meeting, action);
          }}
        />
      </div>
    </article>
  );
}
export default MeetingCard

function MeetingActionButton({ action, onClick,}: { action: MeetingAction; onClick: () => void;}) {
  const labels: Record<MeetingAction, string> = {
    details: "View Details",
    join: "Join Meeting",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 cursor-pointer rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
    >
      {labels[action]}
    </button>
  );
}