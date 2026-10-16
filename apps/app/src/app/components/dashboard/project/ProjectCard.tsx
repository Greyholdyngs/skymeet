"use client"
import { FolderKanban, MoreHorizontal, Users } from "lucide-react";
import type { Project } from "@/app/types/project";
import { useRouter } from "next/navigation";

import { useState } from "react";

interface ProjectCardProps {
    project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleOpenProject = () => {
        router.push(`/dashboard/projects/${project._id}`);
    };

    const handleToggleMenu = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        event.stopPropagation();
        setIsMenuOpen((current) => !current);
    };

    const handleMenuAction = ( event: React.MouseEvent<HTMLButtonElement>, action: () => void ) => {
        event.stopPropagation();

        setIsMenuOpen(false);
        action();
    };

    const handleDeleteProject = () => {
        // We'll connect this to the DELETE API next.
        console.log("Delete project:", project._id);
    };
    return (
        <article
            className="relative rounded-2xl border border-white/10 bg-[#14141B] p-5 transition-all duration-300
                    hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-[0_20px_50px_rgba(124,58,237,0.08)] cursor-pointer"
            onClick={handleOpenProject}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A78BFA]">
                    <FolderKanban size={21} />
                </div>
                <div className="relative">
                    <button
                        type="button"
                        className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                        aria-label={`More options for ${project.name}`}
                        onClick={handleToggleMenu}
                        aria-expanded={isMenuOpen}>
                            <MoreHorizontal size={19} />
                    </button>
                    {isMenuOpen && (
                        <div
                            onClick={(event) => event.stopPropagation()}
                            className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#1A1A23] p-1 shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={(event) => handleMenuAction( event, handleOpenProject)}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                            >
                                View
                            </button>
                            <button
                                type="button"
                                onClick={(event) => handleMenuAction( event, () => {
                                            console.log(
                                                "Project settings:",
                                                project._id,
                                            );
                                        },)
                                }
                                className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                            >
                                Project settings
                            </button>
                            <div className="my-1 border-t border-white/5" />
                            <button
                                type="button"
                                onClick={(event) => handleMenuAction( event, handleDeleteProject)}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-400/10"
                            >
                                Delete project
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6">
                <h3 className="truncate text-lg font-semibold text-white">{project.name}</h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-white/40">{project.description || "No project description yet."}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/5 pt-4 text-xs text-white/40">
                <span>tasks</span>
                <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {project.membersCount} members
                </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-white/30">Updated {project.updatedAt}</span>
                <button
                    type="button"
                    className="text-sm font-medium text-[#A78BFA] opacity-0 transition group-hover:opacity-100">
                    Open →
                </button>
            </div>
        </article>
    );
};

export default ProjectCard;