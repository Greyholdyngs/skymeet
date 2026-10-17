
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";

export interface DashboardProject {
    _id: string;
    name: string;
    description?: string;
    membersCount?: number;
}

interface DashboardProjectSectionProps {
    projects: DashboardProject[];
    onCreateProject: () => void;
}

const DashboardProjectSection = ({ projects, onCreateProject }: DashboardProjectSectionProps) => {
    return (
        <section className="rounded-2xl border border-white/10 bg-[#14141B] p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-white"> Your Projects </h2>
                    <p className="mt-1 text-sm text-white/40"> Projects you are currently working on. </p>
                </div>
                <button
                    type="button"
                    onClick={onCreateProject}
                    className="text-sm font-medium text-[#A78BFA] hover:text-white"
                >
                    + New project
                </button>
            </div>
            {projects.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                    <FolderKanban size={32} className="text-white/30" />
                    <h3 className="mt-4 font-medium text-white"> No projects yet </h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/40"> Create a project to organize tasks, collaborate with your team, and track progress. </p>
                    <button
                        type="button"
                        onClick={onCreateProject}
                        className="mt-5 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white hover:bg-[#6D28D9]"
                    >
                        Create your first project
                    </button>
                </div>
            ) : (
                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <Link
                            key={project._id}
                            href={`/dashboard/projects/${project._id}`}
                            className="group rounded-xl border border-white/10 p-4 transition hover:border-[#7C3AED]/50 hover:bg-white/[0.03]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="rounded-lg bg-[#7C3AED]/15 p-2 text-[#A78BFA]">
                                        <FolderKanban size={20} />
                                    </div>
                                    <h3 className="truncate font-medium text-white"> {project.name} </h3>
                                </div>
                                <ArrowRight
                                    size={17}
                                    className="shrink-0 text-white/30 transition group-hover:text-[#A78BFA]"
                                />
                            </div>
                            <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-white/40"> {project.description || "No project description yet."} </p>
                            <p className="mt-4 text-xs text-white/40"> {project.membersCount ?? 0} members </p>
                        </Link>
                    ))}
                </div>
            )}
        </section>
  );
}
export default DashboardProjectSection