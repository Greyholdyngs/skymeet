"use client";

import Button from "@/components/Button";
import { useTypewriter } from "./hooks/useTypewriter";

const HeroContent = () => {
    const animatedText = useTypewriter({
        words: ["projects", "priorities", "teamwork", "execution"],
        typingSpeed: 95,
        deletingSpeed: 45,
        pauseDuration: 1500,
    });

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-2 text-xs text-violet-200 min-[360px]:text-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <span>One workspace. Better execution.</span>
            </div>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.12] tracking-tight text-white min-[360px]:text-5xl sm:text-6xl lg:text-7xl">
                Turn plans into
                <span className="mt-2 block min-h-[1.2em] text-violet-400">
                    {animatedText}
                    <span className="animate-pulse text-violet-300">...</span>
                </span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-sm leading-7 text-zinc-400 min-[360px]:text-base sm:text-lg">
                Bring projects, tasks, and people into one clear workspace. Organise priorities, keep work moving,
                and see progress without losing sight of what matters.
            </p>
            <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 min-[380px]:w-auto min-[380px]:flex-row">
                <Button
                    href="https://app.skymeet.greyholdyngs.com/signup"
                    buttonType="primary"
                    className="w-full px-6! py-3! min-[380px]:w-auto"
                >
                    Get Started — It&apos;s Free
                </Button>
                <Button
                    href="https://app.skymeet.greyholdyngs.com/login"
                    buttonType="secondary"
                    className="w-full px-6! py-3! min-[380px]:w-auto"
                >
                    Open Workspace
                </Button>
            </div>
            <p className="mt-4 text-xs text-zinc-500"> Free to use. No subscription required. </p>
        </div>
    );
};

export default HeroContent;
