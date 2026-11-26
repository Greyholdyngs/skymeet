"use client";

import type { MeetingFilter } from "@/app/lib/meeting/meeting-util";

interface MeetingFiltersProps {
  activeFilter: MeetingFilter;
  onChange: (filter: MeetingFilter) => void;
}

const filters = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Past", value: "past" },
] as const;

const MeetingFilters = ({ activeFilter, onChange }: MeetingFiltersProps) => (
  <div className="flex justify-end gap-1 rounded-xl border theme-border p-1.5">
    {filters.map((filter) => {
      const active = filter.value === activeFilter;

      return (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm transition ${
            active ? "bg-[#7C3AED] font-semibold text-white" : "theme-text-secondary hover:text-[#6D28D9]"}`}
        >
          {filter.label}
        </button>
      );
    })}
  </div>
);

export default MeetingFilters;