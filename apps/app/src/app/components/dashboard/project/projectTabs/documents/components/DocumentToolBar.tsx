
"use client";

import { Search, Plus } from "lucide-react";
import type { DocumentType } from "../types";

interface DocumentsToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    filter: DocumentType | "all";
    onFilterChange: (value: DocumentType | "all") => void;
    onAdd: () => void;
}

const filters: { label: string; value: DocumentType | "all" }[] = [
    { label: "All resources", value: "all" },
    { label: "Documents", value: "document" },
    { label: "Design", value: "design" },
    { label: "Notes", value: "notes" },
    { label: "Technical", value: "technical" },
];

const DocumentsToolbar = ({ search, onSearchChange, filter, onFilterChange, onAdd,}: DocumentsToolbarProps) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"
                    />
                    <input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search project resources..."
                        className="w-full rounded-lg border theme-border theme-surface-elevated py-2.5 pl-10 pr-4 text-sm theme-text outline-none transition placeholder:text-(--text-muted) focus:border-cyan-500/50"
                    />
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-cyan-400"
                >
                    <Plus size={17} />
                    Add resource
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {filters.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onFilterChange(item.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs transition ${
                            filter === item.value ? "bg-cyan-500/15 text-cyan-500" : "theme-surface-elevated theme-text-secondary hover:bg-(--surface-hover) hover:theme-text"}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DocumentsToolbar;
