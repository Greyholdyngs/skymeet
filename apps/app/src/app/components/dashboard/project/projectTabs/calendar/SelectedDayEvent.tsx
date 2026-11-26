
"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import type { CalendarEvent } from "./types";

interface SelectedDayEventsProps {
    selectedDate: string | null;
    events: CalendarEvent[];
}

const SelectedDayEvents = ({ selectedDate, events }: SelectedDayEventsProps) => {
    const selectedEvents = selectedDate ? events.filter((event) => event.date === selectedDate) : [];

    return (
        <div className="mt-6 rounded-2xl border theme-border theme-surface p-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold theme-text">
                        {selectedDate ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString( "en-US",
                                  {
                                      weekday: "long",
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                  }
                              ) : "Select a day"}
                    </h3>
                    <p className="mt-1 text-xs theme-text-muted"> {selectedDate ? "Scheduled items for this day." : "Click a calendar date to view its scheduled items."} </p>
                </div>
                <CalendarDays size={18} className="text-[#A78BFA]" />
            </div>
            {selectedDate && (
                <div className="mt-5 space-y-3">
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between gap-4 rounded-xl border theme-border-subtle theme-surface-elevated p-4"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                            event.type === "task" ? "bg-blue-400/10 text-blue-500" : "bg-purple-400/10 text-purple-500" }`}
                                    >
                                        {event.type === "meeting" ? (
                                            <Clock3 size={16} />
                                        ) : (
                                            <CalendarDays size={16} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium theme-text"> {event.title} </p>
                                        <p className="mt-1 text-xs capitalize theme-text-muted"> {event.type} </p>
                                    </div>
                                </div>
                                {event.time && (
                                    <span className="shrink-0 text-xs theme-text-secondary"> {event.time} </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed theme-border p-8 text-center">
                            <p className="text-sm theme-text-muted"> No scheduled items for this day. </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectedDayEvents;
