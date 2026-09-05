import type { Meeting } from "@/app/types/meeting";
import { MeetingAction } from "@/app/lib/meeting/meeting-util";

import MeetingCard from "./MeetingCard";
import MeetingEmptyState from "./EmptyState";

interface MeetingListProps {
  meetings: Meeting[];
  isLoading?: boolean;
  onMeetingAction?: ( meeting: Meeting, action: MeetingAction ) => void;
}

const MeetingList = ({ meetings, isLoading = false, onMeetingAction }: MeetingListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (meetings.length === 0) {
    return <MeetingEmptyState />;
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <MeetingCard
            key={meeting.id}
            meeting={meeting}
            onAction={onMeetingAction}
        />
      ))}
    </div>
  );
}
export default MeetingList;