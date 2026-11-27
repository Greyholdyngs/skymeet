import { Check } from "lucide-react";
import { heroNotification } from "./data/heroPreviewData";

const HeroNotification = () => {
    return (
        <div className="hero-notification pointer-events-none absolute -bottom-4 right-2 z-20 w-[min(240px,calc(100%-1rem))] rounded-xl border border-white/10 bg-[#171522]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl sm:-right-5 sm:bottom-8">
            <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <Check size={15} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white"> {heroNotification.title} </p>
                    <p className="mt-1 truncate text-[10px] text-zinc-400"> {heroNotification.description} </p>
                    <p className="mt-2 text-[9px] text-zinc-500"> Updated by {heroNotification.actor} </p>
                </div>
            </div>
        </div>
    );
};

export default HeroNotification;