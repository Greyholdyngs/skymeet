
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
        <section className="relative overflow-hidden rounded-3xl border border-[#7C3AED]/20 bg-[#14141B] p-7 md:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A78BFA]"> {isNewUser ? "Welcome to SkyMeet" : "Your workspace"} </p>
                    <h1 className="mt-3 text-3xl font-bold text-white">
                        {isNewUser ? `Welcome, ${name} 👋` : `Welcome back, ${name} 👋`}
                    </h1>
                    <p className="mt-4 max-w-xl leading-7 text-white/50">
                        {isNewUser
                        ? "Create your first project, bring in your team, and organize your work in one place."
                        : "Keep your projects moving, review tasks, and see what needs your attention."}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={onCreateProject}
                    className="flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 font-semibold text-white transition hover:bg-[#6D28D9]"
                >
                    <FolderPlus size={18} />
                    Create Project
                </button>
                <button
                    type="button"
                    onClick={onInvitePeople}
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-white/80 transition hover:bg-white/5"
                >
                    <UserPlus size={18} />
                    Invite People
                </button>
                {isNewUser && (
                    <button
                        type="button"
                        onClick={() => setDismissed(true)}
                        className="px-3 py-2 text-sm text-white/40 transition hover:text-white"
                    >
                        Skip for now
                    </button>
                )}
                </div>
            </div>
        </section>
  );
}
export default WelcomeBanner
