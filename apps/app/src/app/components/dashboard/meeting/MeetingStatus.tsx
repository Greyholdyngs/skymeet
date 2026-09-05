import type { MeetingStatus } from "@/app/types/meeting"

interface MeetingStatusBadgeProps {
  status: MeetingStatus;
}

const labels: Record<MeetingStatus, string> = {
  scheduled: "Scheduled",
  active: "Live",
  ended: "Ended",
  cancelled: "Cancelled",
};

const MeetingStatusBadge = ({ status }: MeetingStatusBadgeProps) => {
  return (
    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/50">
      {labels[status]}
    </span>
  );
}

export default MeetingStatusBadge;