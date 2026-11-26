import type { Meeting } from "@/app/types/meeting";
import { MeetingAction } from "@/app/lib/meeting/meeting-util";

import MeetingCard from "./MeetingCard";
import MeetingEmptyState from "./EmptyState";

interface MeetingListProps {
  meetings: Meeting[];
  isLoading?: boolean;
  userId: string | null;
  onMeetingAction?: (meeting: Meeting, action: MeetingAction) => void;
}

const MeetingList = ({meetings,isLoading = false, onMeetingAction, userId, }: MeetingListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-32 animate-pulse rounded-2xl theme-surface-elevated" />
        <div className="h-32 animate-pulse rounded-2xl theme-surface-elevated" />
        <div className="h-32 animate-pulse rounded-2xl theme-surface-elevated" />
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
          userId={userId}
        />
      ))}
    </div>
  );
};

export default MeetingList;