"use client";

import { useState } from "react";
import { FolderPlus, UserPlus } from "lucide-react";

interface WelcomeBannerProps {
    name: string;
    isNewUser: boolean;
    onCreateProject: () => void;
    onInvitePeople: () => void;
}

const WelcomeBanner = ({ name, isNewUser, onCreateProject, onInvitePeople }: WelcomeBannerProps) => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed && isNewUser) return null;

    return (
        <section className="relative min-w-0 overflow-hidden rounded-3xl border border-[#7C3AED]/20 theme-surface p-5 sm:p-7 md:py-3 animate-pulse">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]"> {isNewUser ? "Welcome to SkyMeet" : "Your workspace"} </p>
                    <h1 className="mt-1 wrap-break-word text-2xl font-bold theme-text sm:text-3xl"> {isNewUser ? `Welcome, ${name} 👋` : `Welcome back, ${name} 👋`} </h1>
                    <p className="mt-2 max-w-xl leading-7 theme-text-secondary">
                        {isNewUser
                        ? "Create your first project, bring in your team, and organize your work in one place."
                        : "Keep your projects moving, review tasks, and see what needs your attention."}
                    </p>
                </div>
                <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                        type="button"
                        onClick={onCreateProject}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 font-semibold text-white transition hover:bg-[#6D28D9]"
                    >
                        <FolderPlus size={18} />
                        Create Project
                    </button>
                    <button
                        type="button"
                        onClick={onInvitePeople}
                        className="flex items-center justify-center gap-2 rounded-xl border theme-border px-5 py-3 theme-text-secondary transition hover:bg-black/5"
                    >
                        <UserPlus size={18} />
                        Invite People
                    </button>
                    {isNewUser && (
                        <button
                        type="button"
                        onClick={() => setDismissed(true)}
                        className="px-3 py-2 text-center text-sm theme-text-muted transition hover:text-[#7C3AED]"
                        >
                        Skip for now
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default WelcomeBanner;
