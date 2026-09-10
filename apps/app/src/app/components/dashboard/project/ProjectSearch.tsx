"use client";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState } from "react";

interface ProjectSearchProps {
    onSearch: (value: string) => void;
}

const ProjectSearch = ({ onSearch }: ProjectSearchProps) => {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const handleSearch = (value: string) => {
        setSearch(value);
        onSearch(value);
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <div className="relative w-full sm:max-w-md">
                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"/>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full rounded-2xl border border-white/10 bg-[#14141B] py-3 pl-11 pr-4 text-sm text-white 
                                outline-none transition placeholder:text-white/30 focus:border-[#7C3AED]/60 focus:ring-2 
                                focus:ring-[#7C3AED]/10"
                />
            </div>
            <button
                type="button"
                onClick={() => router.push("project/new")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7C3AED] px-5 py-3 text-sm 
                            font-semibold text-white transition hover:bg-[#6D28D9] active:scale-[0.98] sm:w-auto">
                <Plus size={18} />
                <span>New Project</span>
            </button>
        </div>
    );
};

export default ProjectSearch;