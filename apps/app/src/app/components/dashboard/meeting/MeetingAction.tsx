"use client";
import { Plus, CalendarPlus, Link } from "lucide-react";

interface MeetingActionsProps {
  onCreateInstant?: () => void;
  onSchedule?: () => void;
  onJoin?: () => void;
}

const MeetingActions = ({ onCreateInstant, onSchedule, onJoin }: MeetingActionsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
        <button
            type="button"
            onClick={onCreateInstant}
            className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2.5 text-sm font-medium border-y-2  border-white/10 text-[#ffffff] transition hover:bg-[#6D28D9]"
        >
            <Plus size={17} />
            Instant Meeting
        </button>
        <button
            type="button"
            onClick={onSchedule}
            className="inline-flex items-center gap-2 rounded-xl border-y-2 border-white/10 bg-[#181521] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
        >
            <CalendarPlus size={17} />
            Schedule Meeting
        </button>
        <button
            type="button"
            onClick={onJoin}
            className="inline-flex items-center gap-2 rounded-xl border-y-2 border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
            <Link size={17} />
            Join with Code
        </button>
    </div>
  );
}
export default MeetingActions;