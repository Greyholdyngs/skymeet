"use client";

import { Loader2, Search } from "lucide-react";
import type { AttendeeUser } from "./attendee-types";

interface UserAttendeeSearchProps {
    query: string;
    results: AttendeeUser[];
    searching: boolean;
    isSelected: (id: string) => boolean;
    onQueryChange: (query: string) => void;
    onAdd: (user: AttendeeUser) => void;
}

const UserAttendeeSearch = ({ query, results, searching, isSelected, onQueryChange,
                             onAdd, }: UserAttendeeSearchProps) => {
    const showEmptyState = query.trim().length >= 2 && !searching && results.length === 0;

    return (
        <div>
            <label className="mb-2 block text-sm font-medium theme-text-secondary"> Search SkyMeet users </label>
            <div className="relative">
                <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"
                />
                <input
                type="text"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search by name or username..."
                className="w-full rounded-xl border theme-border theme-surface-elevated py-3 pl-10 pr-4 text-sm theme-text outline-none placeholder:opacity-60 focus:border-[#7C3AED]"
                />
            </div>
            {searching && (
                <p className="mt-2 flex items-center gap-2 text-xs theme-text-muted">
                <Loader2 size={13} className="animate-spin" />
                Searching users...
                </p>
            )}
            {results.length > 0 && (
                <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-xl border theme-border theme-surface-elevated p-2">
                    {results.map((user) => {
                        const selected = isSelected(user._id);
                        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName || "SkyMeet user";

                        return (
                        <button
                            key={user._id}
                            type="button"
                            disabled={selected}
                            onClick={() => onAdd(user)}
                            className="flex w-full items-center justify-between gap-3 rounded-lg p-3 text-left transition theme-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm theme-text">{name}</p>
                                <p className="truncate text-xs theme-text-muted"> @{user.userName} </p>
                            </div>
                            <span className="shrink-0 text-xs text-[#A78BFA]"> {selected ? "Added" : "Add"} </span>
                        </button>
                        );
                    })}
                </div>
            )}
            {showEmptyState && (
                <p className="mt-2 text-xs theme-text-muted"> No matching users found. </p>
            )}
        </div>
    );
};

export default UserAttendeeSearch;
