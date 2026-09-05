"use client";

import type { MeetingFilter } from "@/app/lib/meeting/meeting-util";

interface MeetingFiltersProps {
  activeFilter: MeetingFilter;
  onChange: (filter: MeetingFilter) => void;
}

const filters: {
  label: string;
  value: MeetingFilter;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "Past",
    value: "past",
  },
];

const MeetingFilters = ({activeFilter, onChange }: MeetingFiltersProps) => {
  return (
    <div className="flex justify-end gap-1 rounded-xl border-y border-white/10 p-1.5">
      {filters.map((filter) => {
        const active = filter.value === activeFilter;
        
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`rounded-lg px-4 py-2 text-sm transition cursor-pointer ${active ? "bg-[#7C3AED] font-semibold text-[#ffffff]" : "text-white/50 hover:text-[#6D28D9]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
export default MeetingFilters;