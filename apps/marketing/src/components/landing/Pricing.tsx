import Button from "../Button";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals getting started with SkyMeet.",
    features: [
      "Unlimited meeting creation",
      "HD video meetings",
      "Screen sharing",
      "Basic meeting chat",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    description: "For people who need more from their meetings.",
    features: [
      "Everything in Free",
      "Meeting history",
      "Advanced collaboration",
      "Chrome extension",
      "More meeting controls",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: "$19",
    description: "For small teams collaborating regularly.",
    features: [
      "Everything in Pro",
      "Team management",
      "Shared workspace",
      "Advanced meeting features",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="px-4 md:px-10 ">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
            Pricing
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">
            Simple plans. No confusion.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-gray-400">
            Start free and upgrade when you actually need more.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={` relative overflow-hidden rounded-3xl border p-8 transition-all duration-500 ease-out
                        ${ plan.popular ? `border-[#7C3AED]/60 bg-[#181521] shadow-[0_0_70px_rgba(124,58,237,0.15)]
                            lg:-translate-y-5 hover:-translate-y-7` : `border-white/10 bg-[#14141B] hover:-translate-y-2
                            hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]`}`}
            >
                <div
                    className={` pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#7C3AED]/10
                                blur-3xl transition-all duration-500 group-hover:scale-150
                                ${ plan.popular ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                />
              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-semibold text-[#A78BFA]">
                  Popular
                </span>
              )}
                <span className="absolute left-8 top-7 text-xs font-semibold text-white/10">
                    0{index + 1}
                </span>
              <h3 className="text-xl font-semibold text-white">
                {plan.name}
              </h3>

              <p className="mt-3 text-sm text-gray-400">
                {plan.description}
              </p>

              <div className="mt-8">
                <span className={` text-4xl font-bold text-white ${ plan.popular ? "transition-transform duration-500 group-hover:-translate-y-1"
                          : ""}`}>
                  {plan.price}
                </span>

                {plan.price !== "$0" && (
                  <span className="text-gray-500"> / month</span>
                )}
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm text-gray-300"
                  >
                    <span className="text-[#7C3AED]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button
                  href="/signup"
                  buttonType={plan.popular ? "primary" : "secondary"}
                  className="w-full font-semibold"
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
export default Pricing