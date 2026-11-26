
"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import type { Project } from "@/app/types/project";

import CalendarHeader from "./calendar/CalendarHeader";
import CalendarGrid from "./calendar/CalendarGrid";
import SelectedDayEvents from "./calendar/SelectedDayEvent";

import { useProjectCalendar } from "./calendar/hooks/useProjectCalendar";
import { formatDateKey, getCalendarDays } from "./calendar/utils";

interface ProjectCalendarProps {
    project: Project;
}

const ProjectCalendar = ({ project }: ProjectCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const { events, isLoading, error } = useProjectCalendar(project._id);

    const monthName = currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const calendarDays = useMemo(
        () => getCalendarDays(year, month),
        [year, month]
    );

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        const today = new Date();

        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
        setSelectedDate(formatDateKey(today));
    };

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold theme-text"> Calendar </h2>
                    <p className="mt-1 text-sm theme-text-secondary"> View deadlines and scheduled meetings for {project.name}. </p>
                </div>
                <CalendarDays size={22} className="text-[#7C3AED]" />
            </div>
            {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            )}
            <div className="mt-6 overflow-hidden rounded-2xl border theme-border theme-surface">
                <CalendarHeader
                    monthName={monthName}
                    onPreviousMonth={goToPreviousMonth}
                    onNextMonth={goToNextMonth}
                    onToday={goToToday}
                />
                {isLoading ? (
                    <div className="p-12 text-center text-sm theme-text-secondary"> Loading calendar events... </div>
                ) : (
                    <CalendarGrid
                        days={calendarDays}
                        events={events}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />
                )}
            </div>
            {!isLoading && (
                <SelectedDayEvents
                    selectedDate={selectedDate}
                    events={events}
                />
            )}
        </div>
    );
};

export default ProjectCalendar;
