import { Video } from "lucide-react";

const MeetingEmptyState = () => {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/2 px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
        <Video size={20} className="text-white/50" />
      </div>

      <h3 className="font-medium text-white">
        No meetings found
      </h3>

      <p className="mt-2 max-w-sm text-sm text-white/40">
        You don't have any meetings in this category yet.
      </p>
    </div>
  );
}
export default MeetingEmptyState;   