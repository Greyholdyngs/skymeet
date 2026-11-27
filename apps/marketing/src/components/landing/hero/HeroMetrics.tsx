import { heroMetrics } from "./data/heroPreviewData";

const HeroMetrics = () => {
    return (
        <div className="grid grid-cols-3 gap-2 px-3 py-4 sm:gap-3 sm:px-5">
            {heroMetrics.map((metric) => (
            <div
                key={metric.label}
                className="min-w-0 rounded-xl border border-white/[0.07] bg-white/2.5 p-2.5 sm:p-3"
            >
                <p className="truncate text-[9px] text-zinc-500 sm:text-xs"> {metric.label} </p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-white sm:text-2xl"> {metric.value} </p>
            </div>
        ))}
        </div>
    );
};

export default HeroMetrics;