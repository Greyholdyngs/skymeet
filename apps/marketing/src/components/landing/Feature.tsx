"use client";

import { Video, Mic, MonitorUp, MessageSquare, Users, ChartNoAxesCombinedIcon, } from "lucide-react";
import { pageStyle } from "@/style/pageStyle";

const features = [
  {
    icon: Video,
    title: "HD Video Meetings",
    description:
      "Meet face-to-face with a clean, reliable meeting experience built for teams and individuals.",
  },
  {
    icon: Mic,
    title: "Crystal Clear Audio",
    description:
      "Control your microphone and communicate without unnecessary distractions.",
  },
  {
    icon: MonitorUp,
    title: "Screen Sharing",
    description:
      "Share your screen when you need to present, explain or collaborate.",
  },
  {
    icon: Users,
    title: "Simple Collaboration",
    description:
      "Bring people together through a straightforward meeting experience.",
  },
  {
    icon: MessageSquare,
    title: "Meeting Chat",
    description:
      "Keep conversations and useful information available during your meetings.",
  },
  {
    icon: ChartNoAxesCombinedIcon,
    title: "Chrome Companion",
    description:
      "Start or join meetings directly from the SkyMeet Chrome extension.",
  },
];
const Feature = () => {

    const handleMouseMove = ( e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 15;
        const rotateX = ((centerY - y) / centerY) * 15;

        card.style.setProperty("--rotate-x", `${rotateX}deg`);
        card.style.setProperty("--rotate-y", `${rotateY}deg`);
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };

    const handleMouseLeave = ( e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;

        card.style.setProperty("--rotate-x", "0deg");
        card.style.setProperty("--rotate-y", "0deg");
        card.style.setProperty("--mouse-x", "50%");
        card.style.setProperty("--mouse-y", "50%");
    };
  return (
    <section id="features" className="px-4 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Everything you need to
            <span className="text-[#7C3AED]"> meet better.</span>
          </h2>
          <p className="mt-5 text-gray-400">
            SkyMeet keeps meetings simple while giving you the tools you
            actually need to communicate and collaborate.
          </p>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className=" relative overflow-hidden rounded-2xl border border-white/10 bg-[#14141B] p-7 transition-all
                            duration-300 ease-out perspective-[1000px] hover:border-[#7C3AED]/40 hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)]
                            transform-[perspective(1000px)_rotateX(var(--rotate-x))_rotateY(var(--rotate-y))]
                "
                style={
                  {
                    "--rotate-x": "0deg",
                    "--rotate-y": "0deg",
                    "--mouse-x": "50%",
                    "--mouse-y": "50%",
                  } as React.CSSProperties
                }
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -inset-px
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                  style={{
                    background:
                      "radial-gradient(220px circle at var(--mouse-x) var(--mouse-y), rgba(124,58,237,0.16), transparent 70%)",
                  }}
                />

                {/* Number */}
                <span className="absolute right-6 top-5 text-xs font-semibold text-white/10">
                  0{index + 1}
                </span>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#7C3AED]">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default Feature