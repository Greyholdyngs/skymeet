import { MousePointer2 } from "lucide-react";

const HeroPointer = () => {
    return (
        <div
            aria-hidden="true"
            className="hero-pointer pointer-events-none absolute left-[48%] top-[66%] z-30 hidden items-center gap-1.5 sm:flex"
        >
            <MousePointer2
                size={27}
                strokeWidth={1.8}
                className="fill-violet-500 text-white drop-shadow-lg"
            />
            <span className="rounded-full border border-violet-300/20 bg-violet-600/90 px-2 py-1 text-[9px] font-medium text-white shadow-lg shadow-violet-950/40"> Grey </span>
        </div>
    );
};

export default HeroPointer;