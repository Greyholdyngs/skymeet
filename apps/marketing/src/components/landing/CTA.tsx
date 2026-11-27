import Button from "../Button";

const CTA = () => {
  return (
    <section className="px-4 md:px-10">
      <div className="group relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#7C3AED]/20 bg-[#181521] px-5 py-16 text-center transition-all duration-500 hover:border-[#7C3AED]/40 sm:px-8 md:px-12">
        <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-[#7C3AED]/15 blur-[100px] transition-opacity duration-700 group-hover:bg-[#7C3AED]/25" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#00A1CC]/10 blur-[100px]" />
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A78BFA]"> Ready when you are </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"> Your next big idea deserves a plan. </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
            Bring your projects, tasks and team into one workspace.
            Set clear priorities, stay organised and turn plans into progress.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              href="https://app.skymeet.greyholdyngs.com/signup"
              buttonType="primary"
              className="w-full font-semibold sm:w-auto"
            >
              Create your free workspace
            </Button>
            <Button
              href="https://app.skymeet.greyholdyngs.com/login"
              buttonType="secondary"
              className="w-full font-semibold sm:w-auto"
            >
              Sign in
            </Button>
          </div>
          <p className="mt-5 text-xs text-gray-500"> Free to get started. No subscription required. </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
