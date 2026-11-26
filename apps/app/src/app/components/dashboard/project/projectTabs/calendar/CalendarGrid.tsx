
"use client";

import type { CalendarEvent } from "./types";
import { formatDateKey, isCalendarToday } from "./utils";

interface CalendarGridProps {
    days: { date: Date; isCurrentMonth: boolean }[];
    events: CalendarEvent[];
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getEventStyle = (type: CalendarEvent["type"]) => {
    return type === "task" ? "bg-blue-400/10 text-blue-500" : "bg-purple-400/10 text-purple-500";
};

const CalendarGrid = ({ days, events, selectedDate, onSelectDate }: CalendarGridProps) => {
    return (
        <>
            <div className="grid grid-cols-7 border-b theme-border">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="border-r theme-border-subtle px-2 py-3 text-center text-xs font-medium theme-text-muted last:border-r-0"
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {days.map(({ date, isCurrentMonth }) => {
                    const dateKey = formatDateKey(date);
                    const dayEvents = events.filter((event) => event.date === dateKey);
                    const selected = selectedDate === dateKey;

                    return (
                        <button
                            key={dateKey}
                            type="button"
                            onClick={() => onSelectDate(dateKey)}
                            aria-label={`Select ${date.toDateString()}`}
                            aria-pressed={selected}
                            className={`relative min-h-28 border-b border-r theme-border-subtle p-2 text-left transition ${
                                        selected ? "bg-[#7C3AED]/10" : "hover:theme-surface-hover" }`}
                        >
                            <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                                            isCalendarToday(date) ? "bg-[#7C3AED] text-white" : isCurrentMonth ? "theme-text-secondary" : "theme-text-muted opacity-50" }`}
                            >
                                {date.getDate()}
                            </span>
                            <div className="mt-2 space-y-1">
                                {dayEvents.slice(0, 2).map((event) => (
                                    <div
                                        key={event.id}
                                        className={`truncate rounded-md px-1.5 py-1 text-[10px] font-medium ${getEventStyle(event.type)}`}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}

                                {dayEvents.length > 2 && (
                                    <p className="px-1.5 text-[10px] theme-text-muted"> +{dayEvents.length - 2} more </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </>
    );
};

export default CalendarGrid;
