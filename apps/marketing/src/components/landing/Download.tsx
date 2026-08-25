import { ChevronDownCircle, ArrowUpRight } from "lucide-react";
import Button from "../Button";

const Download = () => {
  return (
    <section id="download" className="px-4 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#7C3AED]/20 bg-[#14141B] px-6 py-16 md:px-16">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#7C3AED]/10 blur-3xl" />
          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7C3AED]/10 text-[#A78BFA]">
                <ChevronDownCircle size={28} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
                SkyMeet Extension
              </p>

              <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
                Your meetings,
                <span className="text-[#7C3AED]"> one click away.</span>
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-gray-400">
                Start meetings, join conversations and access SkyMeet without
                constantly switching between tabs.
              </p>

              <div className="mt-8">
                <Button
                  href="/download"
                  buttonType="primary"
                  className="font-semibold"
                >
                  Add to Chrome
                  <ArrowUpRight size={16} className="ml-2 inline" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#0F0F14] p-5 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]">
                    <ChevronDownCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      SkyMeet
                    </p>
                    <p className="text-xs text-gray-500">
                      Meeting companion
                    </p>
                  </div>
                </div>
                <div className="space-y-3 py-5">
                  <button className="w-full rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-semibold text-white">
                    Start Meeting
                  </button>
                  <button className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                    Join Meeting
                  </button>
                </div>
                <p className="text-center text-xs text-gray-500">
                  Open SkyMeet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Download