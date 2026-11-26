"use client";

interface ScheduleMeetingActionsProps {
    disabled?: boolean;
    onCancel: () => void;
}

const ScheduleMeetingActions = ({disabled = false, onCancel,}: ScheduleMeetingActionsProps) => {
    return (
        <div className="flex justify-end gap-3 border-t theme-border pt-5">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-xl px-4 py-2.5 text-sm font-medium theme-text-secondary transition theme-surface-hover"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={disabled}
                className="rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-40"
            >
                Schedule Meeting
            </button>
        </div>
    );
};

export default ScheduleMeetingActions;
