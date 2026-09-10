"use client";

import { FolderPlus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ProjectEmptyState = () => {
    const router = useRouter();

    return (
        <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#14141B]/50 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7C3AED]/10 text-[#A78BFA]">
                <FolderPlus size={28} />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-white">No active projects</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/40">You don't have any projects yet. Create your first project and start organizing your work with your team.</p>
            <button
                type="button"
                onClick={() => router.push("/projects/new")}
                className="mt-7 flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white 
                            transition hover:bg-[#6D28D9] active:scale-[0.98]"
            >
                <Plus size={17} />
                Create Project
            </button>
        </div>
    );
};

export default ProjectEmptyState;