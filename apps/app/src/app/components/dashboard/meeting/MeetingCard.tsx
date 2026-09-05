"use client";

import { Calendar, Clock, Users } from "lucide-react";
import type { Meeting } from "@/app/types/meeting";

import {getMeetingAction, type MeetingAction} from "@/app/lib/meeting/meeting-util";

import MeetingStatusBadge from "./MeetingStatus";

interface MeetingCardProps {
  meeting: Meeting;
  onAction?: ( meeting: Meeting, action: MeetingAction ) => void;
}

const CURRENT_USER_ID = "user_001";

export default function MeetingCard({ meeting, onAction }: MeetingCardProps) {
    const action = getMeetingAction( meeting, CURRENT_USER_ID,);
    const isHost = meeting.hostId === CURRENT_USER_ID;

    return (
        <article className="rounded-3xl border-y-2 border-white/10 bg-white/3 p-5 transition hover:bg-white/5 hover:border-[#6D28D9]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <h3 className="truncate font-medium text-white">{meeting.title}</h3>
                        <MeetingStatusBadge status={meeting.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/40">
                        {meeting.scheduledFor && (
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar size={15} />
                            {new Date(
                            meeting.scheduledFor,
                            ).toLocaleString()}
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
                    <p className="mt-2 text-xs text-white/30">
                        {isHost ? "You are hosting" : "You are invited"}
                    </p>
                </div>
                <MeetingActionButton action={action} onClick={() => onAction && onAction(meeting, action)} />
            </div>
        </article>
    );
}

function MeetingActionButton({ action, onClick }: { action: MeetingAction; onClick: () => void }) {
  const labels = {
    start: "Start Meeting",
    continue: "Continue Meeting",
    join: "Join Meeting",
    details: "View Details",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-medium text-[#ffffff] cursor-pointer transition hover:bg-[#6D28D9]"
    
    >
      {labels[action]}
    </button>
  );
}