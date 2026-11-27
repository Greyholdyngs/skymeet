import HeroDashboardHeader from "./HeroDashboardHeader";
import HeroMetrics from "./HeroMetrics";
import HeroTaskProgress from "./HeroTaskProgress";

import HeroTaskBoard from "./HeroTaskBoard";
import HeroNotification from "./HeroNotification";
import HeroPointer from "./HeroPointer";

const HeroProductPreview = () => {
    return (
        <div className="relative mx-auto w-full max-w-6xl perspective:1400px">
            <div className="pointer-events-none absolute -inset-5 rounded-4xl bg-violet-600/8 blur-3xl sm:-inset-10" />
            <div className="hero-preview relative rounded-2xl border border-white/10 bg-[#0D0D16]/95 shadow-[0_30px_100px_-35px_rgba(124,58,237,0.35)] sm:rounded-3xl">
                <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-2.5 sm:px-5">
                    <span className="h-2 w-2 rounded-full bg-rose-400/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-300/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 truncate text-[9px] text-zinc-600 sm:text-[10px]"> app.skymeet.com / projects / website-redesign </span>
                </div>
                <HeroDashboardHeader />
                <HeroMetrics />
                <HeroTaskProgress />
                <HeroTaskBoard />
                <div className="px-3 pb-3 sm:px-5 sm:pb-5">
                    <p className="text-right text-[8px] text-zinc-600 sm:text-[9px]"> Illustrative project preview </p>
                </div>
            </div>
            <HeroNotification />
            <HeroPointer />
        </div>
    );
};

export default HeroProductPreview;