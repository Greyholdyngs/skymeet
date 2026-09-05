"use client";

import { Video, PlaySquare } from "lucide-react";
export type MeetingView = "meetings" | "recordings";

interface MeetingHeaderProps {
    activeView: MeetingView;
    onViewChange: (view: MeetingView) => void;
}

const MeetingHeader = ({ activeView, onViewChange }: MeetingHeaderProps) => {
  return (
    <header className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-semibold text-white">Meetings</h1>
            <p className="mt-2 text-sm text-white/50">Create, manage and join your meetings.</p>
        </div>
        <div className="flex w-fit items-center gap-1 rounded-xl border-y border-white/10 bg-[#181521] p-1">
            <button
                type="button"
                onClick={() => onViewChange("meetings")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
                    activeView === "meetings" ? "bg-white/8 font-semibold text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
            >
                <Video size={16} />
                <span>Meetings</span>
            </button>
            <button
            type="button"
            onClick={() => onViewChange("recordings")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
                activeView === "recordings" ? "bg-white/8 font-semibold text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
            >
                <PlaySquare size={16} />
                <span>Recordings</span>
            </button>
        </div>
    </header>
  );
}
export default MeetingHeader
