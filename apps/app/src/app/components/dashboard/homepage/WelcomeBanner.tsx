"use client";

import { useState } from "react";
import { ArrowRight, Plus, UserPlus } from "lucide-react";

interface WelcomeBannerProps {
    name: string;
    isNewUser?: boolean;
    onCreateProject: () => void;
    onInvitePeople: () => void;
    onStartMeeting: () => void;
    onScheduleMeeting: () => void; 
}

const WelcomeBanner = ({ name, isNewUser = false, onCreateProject, onInvitePeople, onStartMeeting, onScheduleMeeting }: WelcomeBannerProps) => {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;

    return (
        <section className="relative overflow-hidden rounded-3xl border border-[#7C3AED]/20 bg-[#14141B] p-8 md:p-10">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
                    {isNewUser ? "Welcome to SkyMeet" : "Your workspace"}
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                    {isNewUser  ? `Welcome, ${name} 👋` : `Welcome back, ${name} 👋`}
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-white/50">
                    {
                        isNewUser ? "Get started by creating a project, inviting your team and organizing your work."
                            : "Here’s what’s happening across your workspace today."
                    }
                </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {
                        isNewUser ? (
                            <>
                                <button
                                    type="button" 
                                    onClick={onCreateProject}
                                     className="flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 font-semibold text-white transition hover:bg-[#6D28D9]">
                                    <Plus size={18} />
                                    Create Project
                                </button>
                                <button 
                                    type="button" 
                                    onClick={onInvitePeople}
                                    className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-white/70 transition hover:bg-white/5">
                                    <UserPlus size={18} />
                                    Invite People
                                </button>
                            </>
                    ) : (
                        <>
                            <button className="flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 font-semibold text-white">
                                <Plus size={18} />
                                Start Meet
                            </button>
                            <button className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-white/70">
                                Schedule
                                <ArrowRight size={17} />
                            </button>
                        </>
                    )}
                    {
                        isNewUser && (
                            <button
                                onClick={() => setDismissed(true)}
                                className="px-4 text-sm text-white/40 transition hover:text-white"
                            >
                                Skip for now
                            </button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default WelcomeBanner