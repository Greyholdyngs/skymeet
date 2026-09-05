"use client";

import { Calendar, Clock, Copy, ExternalLink, Users, X } from "lucide-react";
import type { Meeting } from "@/app/types/meeting";

import MeetingStatusBadge from "./MeetingStatus";
import type { ReactNode } from "react";

interface MeetingDetailsDrawerProps {
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
}

const MeetingDetailsDrawer = ({ meeting, open, onClose }: MeetingDetailsDrawerProps) => {
    if (!open || !meeting) {
        return null;
    }

    return (
        <>
        <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        />
        <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0B0B0F] shadow-2xl translate-x-0 transition-transform duration-1000 ease-in-out">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/40"> Meeting details</p>
                    <h2 className="mt-1 text-lg font-semibold text-white">{meeting.title}</h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-white/50 transition hover:bg-white/5 hover:text-white"
                    aria-label="Close meeting details"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                    <div>
                        <MeetingStatusBadge status={meeting.status} />
                    </div>
                    <div className="space-y-3">
                        {meeting.scheduledFor && (
                            <DetailRow
                                icon={<Calendar size={17} />}
                                label="Date"
                                value={new Date( meeting.scheduledFor, ).toLocaleString()}
                            />
                        )}
                        {meeting.duration && (
                            <DetailRow
                                icon={<Clock size={17} />}
                                label="Duration"
                                value={`${meeting.duration} minutes`}
                            />
                        )}
                        <DetailRow
                            icon={<Users size={17} />}
                            label="Participants"
                            value={`${meeting.participants.length} ${ meeting.participants.length === 1 ? "person" : "people"}`}
                        />
                    </div>
                    {meeting.joinCode && (
                        <div>
                            <p className="mb-2 text-xs font-medium text-white/40">Meeting code</p>
                            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-4 py-3">
                                <span className="font-mono text-sm text-white">
                                    {meeting.joinCode}
                                </span>
                                <button
                                    type="button"
                                    className="text-white/40 transition hover:text-white"
                                    onClick={() => {
                                        const joinCode = meeting.joinCode;
                                        if (!joinCode) return;
                                        
                                        navigator.clipboard.writeText(joinCode)
                                    }}
                                    aria-label="Copy meeting code"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                    <div>
                        <p className="mb-2 text-xs font-medium text-white/40">Provider</p>
                        <div className="rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white">
                            {meeting.provider === "google_meet" ? "Google Meet" : "SkyMeet"}
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10 p-6">
                <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
                >
                    {meeting.status === "active" ? "Continue Meeting" : meeting.status === "scheduled" ? "Start Meeting" : "View Recording"}
                    <ExternalLink size={16} />
                </button>
            </div>
        </aside>
        </>
    );
}
export default MeetingDetailsDrawer;

function DetailRow({ icon, label, value }: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-4 py-3">
      <div className="text-white/40">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/40">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm text-white">
          {value}
        </p>
      </div>
    </div>
  );
}