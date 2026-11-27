import { Sparkles, Target, Layers3 } from "lucide-react";

const points = [
  {
    icon: Sparkles,
    title: "Clarity over complexity",
    text: "A focused workspace that helps teams organise their work without adding unnecessary friction.",
  },
  {
    icon: Target,
    title: "Everyone knows what matters",
    text: "Bring projects, tasks and ownership together so priorities are easier to understand and act on.",
  },
  {
    icon: Layers3,
    title: "Built to grow with teams",
    text: "A flexible foundation for planning, collaboration and keeping work moving as teams evolve.",
  },
];

const About = () => {
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
    <section id="about" className="scroll-mt-28 px-4 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]"> About SkyMeet </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Work should move forward,
              <span className="text-[#7C3AED]"> not get lost in the process.</span>
            </h2>
          </div>
          <div className="min-w-0">
            <p className="text-base leading-8 text-gray-400 sm:text-lg">
              SkyMeet gives teams a clearer way to organise projects, manage
              tasks and keep everyone aligned on what needs to get done.
            </p>
            <p className="mt-5 text-base leading-8 text-gray-400 sm:mt-6 sm:text-lg">
              From setting priorities to tracking progress, everything is
              designed to help turn scattered plans into meaningful work.
            </p>
          </div>
        </div>
        <div className="mt-12 grid min-w-0 gap-4 md:mt-16 md:grid-cols-3">
          {points.map((point, index) => {
            const Icon = point.icon;

            return (
              <div
                key={point.title}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#14141B] p-5 transition-all duration-300 ease-out perspective-[1000px] hover:border-[#7C3AED]/40 hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)] transform-[perspective(1000px)_rotateX(var(--rotate-x))_rotateY(var(--rotate-y))] sm:p-7"
                style={ {"--rotate-x": "0deg", "--rotate-y": "0deg", "--mouse-x": "50%", "--mouse-y": "50%", } as React.CSSProperties}
              >
                <div
                  className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(220px circle at var(--mouse-x) var(--mouse-y), rgba(124,58,237,0.16), transparent 70%)", }}
                />
                <span className="absolute right-6 top-5 text-xs font-semibold text-white/10"> 0{index + 1} </span>
                <Icon
                  className="relative text-[#7C3AED] transition-transform duration-300 group-hover:scale-110"
                  size={24}
                />
                <h3 className="relative mt-6 font-semibold text-white"> {point.title} </h3>
                <p className="relative mt-3 text-sm leading-6 text-gray-400"> {point.text} </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
