"use client";

import { CalendarPlus } from "lucide-react";

interface MeetingActionsProps {
  onSchedule?: () => void;
}

const MeetingActions = ({ onSchedule }: MeetingActionsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onSchedule}
        className="inline-flex items-center gap-2 rounded-xl border theme-border theme-surface px-4 py-2.5 text-sm font-medium theme-text transition theme-surface-hover"
      >
        <CalendarPlus size={17} />
        Schedule Meeting
      </button>
    </div>
  );
};

export default MeetingActions;
