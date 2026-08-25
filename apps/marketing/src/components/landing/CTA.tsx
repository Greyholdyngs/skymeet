import Button from "../Button";

const CTA = () => {
  return (
    <section className="px-4 md:px-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#7C3AED]/20 bg-[#181521] px-6 py-16 text-center md:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
          Ready when you are
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
          Your next meeting starts here.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-gray-400">
          Create your SkyMeet account and start connecting with your team.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            href="/signup"
            buttonType="primary"
            className="font-semibold"
          >
            Get Started
          </Button>
          <Button
            href="/download"
            buttonType="secondary"
            className="font-semibold"
          >
            Add to Chrome
          </Button>
        </div>
      </div>
    </section>
  );
}
export default CTA