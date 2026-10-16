"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus } from "lucide-react";
import type { Project } from "@/app/types/project";

interface ProjectCalendarProps {
    project: Project;
}

type CalendarEventType =
    | "task"
    | "meeting"
    | "milestone";

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: CalendarEventType;
    time?: string;
}

const getMockEvents = (): CalendarEvent[] => {
    const today = new Date();

    const createDate = (daysFromToday: number) => {
        const date = new Date(today);
        date.setDate(date.getDate() + daysFromToday);

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");
    };

    return [
        {
            id: "1",
            title: "Authentication task due",
            date: createDate(2),
            type: "task",
        },
        {
            id: "2",
            title: "Project review",
            date: createDate(5),
            type: "meeting",
            time: "10:00 AM",
        },
        {
            id: "3",
            title: "MVP milestone",
            date: createDate(9),
            type: "milestone",
        },
        {
            id: "4",
            title: "Dashboard task due",
            date: createDate(14),
            type: "task",
        },
    ];
};

const weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];

const ProjectCalendar = ({ project }: ProjectCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric",
        },
    );

    const daysInMonth = new Date(year,month + 1, 0, ).getDate();
    const firstDayOfMonth = new Date( year, month, 1).getDay();
    const previousMonthDays = new Date( year, month, 0).getDate();

    const mockEvents = useMemo( () => getMockEvents(),[]);

    const calendarDays = useMemo(() => {
        const days: {
            date: Date;
            isCurrentMonth: boolean;
        }[] = [];

        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            days.push({
                date: new Date(
                    year,
                    month - 1,
                    previousMonthDays - i,
                ),
                isCurrentMonth: false,
            });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                date: new Date(year, month, day),
                isCurrentMonth: true,
            });
        }

        let nextMonthDay = 1;

        while (days.length < 42) {
            days.push({
                date: new Date(
                    year,
                    month + 1,
                    nextMonthDay,
                ),
                isCurrentMonth: false,
            });

            nextMonthDay++;
        }

        return days;
    }, [ year, month, daysInMonth, firstDayOfMonth, previousMonthDays]);

    const formatDateKey = (date: Date) => {
        const dateYear = date.getFullYear();
        const dateMonth = String(
            date.getMonth() + 1,
        ).padStart(2, "0");
        const dateDay = String(
            date.getDate(),
        ).padStart(2, "0");

        return `${dateYear}-${dateMonth}-${dateDay}`;
    };

    const getEventsForDate = (date: Date) => {
        const dateKey = formatDateKey(date);

        return mockEvents.filter(
            (event) => event.date === dateKey,
        );
    };

    const isToday = (date: Date) => {
        const today = new Date();

        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const goToPreviousMonth = () => {
        setCurrentDate(
            new Date(year, month - 1, 1),
        );
    };

    const goToNextMonth = () => {
        setCurrentDate(
            new Date(year, month + 1, 1),
        );
    };

    const goToToday = () => {
        const today = new Date();

        setCurrentDate(
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1,
            ),
        );

        setSelectedDate(formatDateKey(today));
    };

    const selectedEvents = selectedDate
        ? mockEvents.filter(
              (event) => event.date === selectedDate,
          )
        : [];

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Calendar
                    </h2>

                    <p className="mt-1 text-sm text-white/40">
                        View deadlines, meetings, milestones,
                        and scheduled work for{" "}
                        {project.name}.
                    </p>
                </div>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
                >
                    <Plus size={16} />
                    Add event
                </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#14141B]">
                <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="rounded-lg border border-white/10 p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={17} />
                        </button>

                        <h3 className="min-w-36 text-center text-base font-semibold text-white">
                            {monthName}
                        </h3>

                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="rounded-lg border border-white/10 p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                            aria-label="Next month"
                        >
                            <ChevronRight size={17} />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={goToToday}
                        className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                    >
                        Today
                    </button>
                </div>

                <div className="grid grid-cols-7 border-b border-white/10">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="border-r border-white/5 px-2 py-3 text-center text-xs font-medium text-white/30 last:border-r-0"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {calendarDays.map(
                        ({ date, isCurrentMonth }, index) => {
                            const dateKey =
                                formatDateKey(date);

                            const events =
                                getEventsForDate(date);

                            const selected =
                                selectedDate === dateKey;

                            return (
                                <button
                                    key={`${dateKey}-${index}`}
                                    type="button"
                                    onClick={() =>
                                        setSelectedDate(
                                            dateKey,
                                        )
                                    }
                                    className={`relative min-h-28 border-b border-r border-white/5 p-2 text-left transition last:border-r-0 ${
                                        selected
                                            ? "bg-[#7C3AED]/10"
                                            : "hover:bg-white/[0.025]"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <span
                                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                                                isToday(
                                                    date,
                                                )
                                                    ? "bg-[#7C3AED] text-white"
                                                    : isCurrentMonth
                                                      ? "text-white/70"
                                                      : "text-white/15"
                                            }`}
                                        >
                                            {date.getDate()}
                                        </span>
                                    </div>

                                    <div className="mt-2 space-y-1">
                                        {events
                                            .slice(0, 2)
                                            .map(
                                                (
                                                    event,
                                                ) => (
                                                    <div
                                                        key={
                                                            event.id
                                                        }
                                                        className={`truncate rounded-md px-1.5 py-1 text-[10px] font-medium ${
                                                            event.type ===
                                                            "task"
                                                                ? "bg-blue-400/10 text-blue-300"
                                                                : event.type ===
                                                                    "meeting"
                                                                  ? "bg-purple-400/10 text-purple-300"
                                                                  : "bg-amber-400/10 text-amber-300"
                                                        }`}
                                                    >
                                                        {
                                                            event.title
                                                        }
                                                    </div>
                                                ),
                                            )}

                                        {events.length >
                                            2 && (
                                            <p className="px-1.5 text-[10px] text-white/30">
                                                +
                                                {events.length -
                                                    2}{" "}
                                                more
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        },
                    )}
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#14141B] p-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            {selectedDate
                                ? new Date(
                                      `${selectedDate}T00:00:00`,
                                  ).toLocaleDateString(
                                      "en-US",
                                      {
                                          weekday: "long",
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                      },
                                  )
                                : "Select a day"}
                        </h3>

                        <p className="mt-1 text-xs text-white/30">
                            {selectedDate
                                ? "Scheduled items for this day."
                                : "Click a calendar date to view its scheduled items."}
                        </p>
                    </div>

                    <CalendarDays
                        size={18}
                        className="text-[#A78BFA]"
                    />
                </div>

                {selectedDate && (
                    <div className="mt-5 space-y-3">
                        {selectedEvents.length > 0 ? (
                            selectedEvents.map(
                                (event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                    event.type ===
                                                    "task"
                                                        ? "bg-blue-400/10 text-blue-300"
                                                        : event.type ===
                                                            "meeting"
                                                          ? "bg-purple-400/10 text-purple-300"
                                                          : "bg-amber-400/10 text-amber-300"
                                                }`}
                                            >
                                                {event.type ===
                                                "meeting" ? (
                                                    <Clock3
                                                        size={
                                                            16
                                                        }
                                                    />
                                                ) : (
                                                    <CalendarDays
                                                        size={
                                                            16
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">
                                                    {
                                                        event.title
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs capitalize text-white/30">
                                                    {
                                                        event.type
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {event.time && (
                                            <span className="shrink-0 text-xs text-white/40">
                                                {
                                                    event.time
                                                }
                                            </span>
                                        )}
                                    </div>
                                ),
                            )
                        ) : (
                            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                                <p className="text-sm text-white/30">
                                    No scheduled items for
                                    this day.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCalendar;