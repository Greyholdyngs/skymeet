import type { MeetingStatus } from "@/app/types/meeting";

interface MeetingStatusBadgeProps {
  status: MeetingStatus;
}

const labels: Record<MeetingStatus, string> = {
  scheduled: "Scheduled",
  active: "Live",
  ended: "Ended",
  cancelled: "Cancelled",
};

const statusStyles: Record<MeetingStatus, string> = {
  scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  active: "bg-green-500/10 text-green-600 dark:text-green-400",
  ended: "bg-gray-500/10 theme-text-secondary",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const MeetingStatusBadge = ({ status }: MeetingStatusBadgeProps) => {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

export default MeetingStatusBadge;