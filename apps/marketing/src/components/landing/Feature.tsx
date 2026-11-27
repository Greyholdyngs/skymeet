"use client";

import {FolderKanban, ListTodo, UserRoundCheck, ChartNoAxesCombined, MessagesSquare, CalendarDays } from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Project Workspaces",
    description: "Bring project details, team members, documents and activity into one organised workspace.",
    accent: "violet",
  },
  {
    icon: ListTodo,
    title: "Task Management",
    description: "Break work into manageable tasks and move them through clear workflow stages.",
    accent: "cyan",
  },
  {
    icon: UserRoundCheck,
    title: "Clear Ownership",
    description: "Assign responsibilities, set priorities and due dates so everyone knows what needs attention.",
    accent: "emerald",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Progress Visibility",
    description: "See completed work, outstanding tasks and project progress without chasing updates.",
    accent: "violet",
  },
  {
    icon: MessagesSquare,
    title: "Team Collaboration",
    description: "Keep task conversations, feedback and project discussions connected to the work.",
    accent: "cyan",
  },
  {
    icon: CalendarDays,
    title: "Work Calendar",
    description: "Keep track of project schedules and important task dates in one place.",
    accent: "emerald",
  },
];

const Feature = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 20;
    const rotateX = ((centerY - y) / centerY) * 20;

    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;

    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
  };

  return (
    <section
      id="features"
      className="scroll-mt-28 px-4 py-16 sm:px-6 md:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400 sm:text-sm"> Everything works together </p>
          <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Less chasing.
            <span className="text-violet-400"> More progress.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
            From planning and task ownership to collaboration and progress, SkyMeet gives your team one place to
            keep work moving.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/8 bg-[#111119] p-5 transition-[border-color,box-shadow,transform] duration-500 ease-out transform-[perspective(1000px)_rotateX(var(--rotate-x))_rotateY(var(--rotate-y))] hover:border-violet-400/30 hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)] sm:p-7"
                style={{ "--rotate-x": "0deg", "--rotate-y": "0deg", "--mouse-x": "50%", "--mouse-y": "50%" } as React.CSSProperties}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(260px circle at var(--mouse-x) var(--mouse-y), rgba(124,58,237,0.16), transparent 75%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-violet-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative z-10">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/8 text-violet-400 transition-all duration-500 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:border-violet-400/30 group-hover:bg-violet-500/15">
                      <Icon size={22} strokeWidth={1.7} />
                    </div>
                    <span className="text-xs font-medium tabular-nums text-white/15 transition-colors duration-300 group-hover:text-violet-300/50"> 0{index + 1} </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-violet-100"> {feature.title} </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400 transition-colors duration-300 group-hover:text-gray-300"> {feature.description} </p>
                  <div className="mt-6 h-px w-8 bg-violet-500/30 transition-all duration-500 group-hover:w-16 group-hover:bg-violet-400/80" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Feature;
