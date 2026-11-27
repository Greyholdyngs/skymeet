"use client";

import { ArrowUpRight, CheckCircle2, FolderKanban, Layers3 } from "lucide-react";
import Button from "../Button";

const Download = () => {
  return (
    <section id="workspace" className="scroll-mt-28 px-4 py-16 sm:px-6 md:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-3xl border border-violet-500/20 bg-[#111119] px-5 py-12 sm:px-8 sm:py-16 md:px-16">
          <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 -z-10 h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-[100px]" />
          <div className="grid min-w-0 items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="relative z-10">
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/10 text-violet-300 shadow-lg shadow-violet-950/20 transition-transform duration-500 hover:-translate-y-1 hover:rotate-6">
                <Layers3 size={27} strokeWidth={1.7} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400 sm:text-sm"> Your workspace starts here </p>
              <h2 className="mt-4 max-w-xl text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Give your ideas a place to{" "}
                <span className="text-violet-400">move forward.</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
                Create projects, organise tasks, bring your team together and
                keep track of the work that moves your goals forward.
              </p>
              <div className="mt-8">
                <Button
                  href="https://app.skymeet.greyholdyngs.com/signup"
                  buttonType="primary"
                  className="px-6! py-3! font-semibold"
                >
                  Create your workspace
                  <ArrowUpRight size={17} className="ml-2 inline" />
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Free to get started
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  No subscription required
                </span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md min-w-0 lg:max-w-none">
              <div className="pointer-events-none absolute -inset-5 rounded-3xl bg-violet-500/8 blur-2xl" />
              <div className="relative animate-[workspaceFloat_7s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-[#0B0B12] p-3 shadow-2xl shadow-black/40 sm:p-5">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                      <FolderKanban size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white"> My Projects </p>
                      <p className="text-[10px] text-gray-500"> Your team's workspace </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-[9px] text-emerald-300"> Active </span>
                </div>
                <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/2.5 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white"> Website Redesign </p>
                      <p className="mt-1 text-[10px] text-gray-500"> Product Team </p>
                    </div>
                    <span className="text-[10px] text-violet-300"> In progress </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-[10px] text-gray-500">
                    <span>Task completion</span>
                    <span className="font-semibold text-white">67%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div className="h-full w-[67%] rounded-full bg-linear-to-r from-violet-600 to-cyan-400" />
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[ { label: "Members", value: "08" }, { label: "Total tasks", value: "24" },
                      { label: "Completed", value: "16" }, ].map((item) => (
                      <div key={item.label} className="min-w-0 rounded-lg bg-white/[0.035] p-2">
                        <p className="truncate text-[9px] text-gray-500"> {item.label} </p>
                        <p className="mt-1 text-base font-semibold text-white"> {item.value} </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/2.5 p-3 sm:p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-white"> Recent activity </p>
                    <span className="text-[9px] text-gray-500"> Project updates </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <CheckCircle2 size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] text-gray-300"> Homepage layout completed </p>
                      <p className="mt-1 text-[9px] text-gray-500"> A project task was completed </p>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -bottom-4 -right-3 rounded-xl border border-violet-400/20 bg-[#191526] px-3 py-2 shadow-xl shadow-black/30 sm:-right-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-medium text-violet-200"> Work is moving forward </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes workspaceFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.animate-\\[workspaceFloat_7s_ease-in-out_infinite\\]) {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Download;