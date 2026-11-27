"use client";

import { useEffect, useState } from "react";
import { heroTaskProgress } from "./data/heroPreviewData";

const HeroTaskProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setProgress(heroTaskProgress.percentage);
        });

        return () => window.cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="px-3 pb-4 sm:px-5">
            <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium text-zinc-400 sm:text-xs"> Task progress </span>
                <span className="text-[10px] font-semibold tabular-nums text-violet-300 sm:text-xs"> {heroTaskProgress.completed}/{heroTaskProgress.total} completed </span>
            </div>
            <div
                className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"
                role="progressbar"
                aria-label="Project task completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={heroTaskProgress.percentage}
            >
                <div
                    className="h-full rounded-full bg-linear-to-r from-violet-600 to-cyan-400 transition-[width] duration-1400 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default HeroTaskProgress;