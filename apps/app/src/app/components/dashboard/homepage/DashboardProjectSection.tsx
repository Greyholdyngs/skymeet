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
    loading: boolean;
    hasError: boolean;
}

const DashboardProjectSection = ({projects, onCreateProject, loading, hasError }: DashboardProjectSectionProps) => {
    return (
        <section className="min-w-0 rounded-2xl border theme-border theme-surface p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold theme-text">Your Projects</h2>
                    <p className="mt-1 text-sm theme-text-secondary"> Projects you are currently working on.</p>
                </div>
                <button
                    type="button"
                    onClick={onCreateProject}
                    className="shrink-0 text-sm font-medium text-[#7C3AED] hover:underline"
                    >
                    + New project
                </button>
            </div>
            {loading ? (
                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                        key={item}
                        className="h-32 animate-pulse rounded-xl theme-surface-elevated"
                        />
                    ))}
                </div>
            ) : hasError ? (
                <div className="py-10 text-center">
                 <p className="text-sm theme-text-secondary"> Projects could not be loaded. </p>
                </div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                    <FolderKanban size={32} className="theme-text-muted" />
                    <h3 className="mt-4 font-medium theme-text">No projects yet</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 theme-text-secondary"> Create a project to organize tasks, collaborate with your team, and track progress. </p>
                    <button
                        type="button"
                        onClick={onCreateProject}
                        className="mt-5 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white hover:bg-[#6D28D9]"
                    >
                        Create your first project
                    </button>
                </div>
            ) : (
                <div className="mt-6 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <Link
                            key={project._id}
                            href={`/dashboard/projects/${project._id}`}
                            className="group rounded-xl border theme-border p-4 transition hover:border-[#7C3AED]/50 hover:bg-black/5"
                            >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="rounded-lg bg-[#7C3AED]/10 p-2 text-[#7C3AED]"> <FolderKanban size={20} /> </div>
                                    <h3 className="truncate font-medium theme-text"> {project.name} </h3>
                                </div>
                                <ArrowRight
                                size={17}
                                className="shrink-0 text-[#7C3AED] opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100"
                                />
                            </div>
                            <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 theme-text-secondary"> {project.description || "No project description yet."} </p>
                            <p className="mt-4 text-xs theme-text-muted"> {project.membersCount ?? 0} members </p>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};

export default DashboardProjectSection;