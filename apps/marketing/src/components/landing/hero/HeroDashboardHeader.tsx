import { ChevronDown, CircleDot, MoreHorizontal } from "lucide-react";
import { heroProject } from "./data/heroPreviewData";

const HeroDashboardHeader = () => {
    return (
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-white/[0.07] px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                    <CircleDot size={17} className="text-violet-300" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-[10px] text-zinc-500 sm:text-xs"> {heroProject.workspace} </p>
                    <div className="flex min-w-0 items-center gap-1.5">
                        <h3 className="truncate text-xs font-semibold text-white sm:text-sm"> {heroProject.name} </h3>
                        <ChevronDown size={13} className="shrink-0 text-zinc-500" />
                    </div>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <span className="hidden rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] text-emerald-300 sm:inline-flex"> {heroProject.status} </span>
                <button
                    type="button"
                    aria-label="More project options"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>
        </div>
    );
};

export default HeroDashboardHeader;