import { Sparkles, Code2, Layers3 } from "lucide-react";

const points = [
  {
    icon: Sparkles,
    title: "Simple by design",
    text: "SkyMeet focuses on making meetings feel straightforward instead of overwhelming users with unnecessary complexity.",
  },
  {
    icon: Code2,
    title: "Built to learn",
    text: "The project explores modern web technologies, real-time communication and browser extension architecture.",
  },
  {
    icon: Layers3,
    title: "Designed to evolve",
    text: "The architecture starts lightweight while leaving room for more advanced capabilities as the project grows.",
  },
];

const About = () => {

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
    <section id="about" className="px-4 md:px-10 scroll-mt-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
              About SkyMeet
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
              Built around the
              <span className="text-[#7C3AED]"> meeting experience.</span>
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-gray-400">
              SkyMeet is a modern meeting platform exploring what happens when
              video communication, collaboration and browser technology come
              together in one lightweight experience.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              The goal is simple: make it easy to meet, connect and collaborate
              without unnecessary friction.
            </p>
          </div>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
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
                <Icon className="text-[#7C3AED]" size={24} />
                <h3 className="mt-6 font-semibold text-white">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default About