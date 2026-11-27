"use client";

import HeroContent from "./hero/HeroContent";
import HeroProductPreview from "./hero/HeroProductPreview";
import { useHeroSpotlight } from "./hero/hooks/useHeroSpotlight";

import styles from "./hero/Hero.module.css";

const Hero = () => {
    const { handlePointerMove, handlePointerLeave } = useHeroSpotlight();

    return (
        <section
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className={`relative isolate overflow-hidden px-4 pb-24 pt-32 sm:px-6 sm:pt-36 lg:pb-32 ${styles.heroBackground} ${styles.heroSpotlight}`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <div className="absolute left-1/2 top-0 h-112.5 w-112.5 -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-[120px]" />
                <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-cyan-500/4 blur-[100px]" />
            </div>
            <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
                <div className="w-full min-w-0">
                    <HeroContent />
                </div>
                <div className="w-full min-w-0">
                    <HeroProductPreview />
                </div>
            </div>
        </section>
    );
};

export default Hero;
