import CreateProjectForm from "@/app/components/dashboard/project/CreateProjectForm";

const NewProjectPage = () => {
  return (
    <section className="min-h-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7C3AED]"> Projects </p>
          <h1 className="mt-2 text-2xl font-bold theme-text sm:text-3xl"> Create a new project </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-secondary sm:text-base"> Create a workspace for your team to plan, manage and collaborate on a project. </p>
        </div>
        <CreateProjectForm />
      </div>
    </section>
  );
};

export default NewProjectPage;
