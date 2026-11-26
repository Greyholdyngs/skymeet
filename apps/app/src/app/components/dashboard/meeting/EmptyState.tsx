import { Video } from "lucide-react";

const MeetingEmptyState = () => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed theme-border-subtle theme-surface px-6 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl theme-surface-elevated">
      <Video size={20} className="theme-text-muted" />
    </div>
    <h3 className="font-medium theme-text">No meetings found</h3>
    <p className="mt-2 max-w-sm text-sm theme-text-muted">You don't have any meetings </p>
  </div>
);

export default MeetingEmptyState;