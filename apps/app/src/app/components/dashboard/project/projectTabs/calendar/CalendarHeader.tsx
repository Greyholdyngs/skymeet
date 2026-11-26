
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
    monthName: string;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
}

const CalendarHeader = ({ monthName, onPreviousMonth, onNextMonth, onToday }: CalendarHeaderProps) => {
    return (
        <div className="flex flex-col gap-4 border-b theme-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onPreviousMonth}
                    aria-label="Previous month"
                    className="rounded-lg border theme-border p-2 theme-text-secondary transition hover:theme-surface-hover hover:theme-text"
                >
                    <ChevronLeft size={17} />
                </button>
                <h3 className="min-w-36 text-center text-base font-semibold theme-text"> {monthName} </h3>
                <button
                    type="button"
                    onClick={onNextMonth}
                    aria-label="Next month"
                    className="rounded-lg border theme-border p-2 theme-text-secondary transition hover:theme-surface-hover hover:theme-text"
                >
                    <ChevronRight size={17} />
                </button>
            </div>
            <button
                type="button"
                onClick={onToday}
                className="rounded-lg border theme-border px-3 py-2 text-sm font-medium theme-text-secondary transition hover:theme-surface-hover hover:theme-text"
            >
                Today
            </button>
        </div>
    );
};

export default CalendarHeader;
