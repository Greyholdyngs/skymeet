"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, ListTodo, MoreHorizontal, Users } from "lucide-react";

import { apiFetch } from "@/app/lib/api";
import type { Project } from "@/app/types/project";

const ProjectPage = () => {
    const params = useParams();
    const projectId = params.projectId as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch<Project>(`/projects/${projectId}`);
                setProject(data);

            } catch (error) {
                setError(
                    error instanceof Error ? error.message : "Unable to load project.",
                );
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    if (loading) {
        return (
            <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm text-white/40">
                        Loading project...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm text-red-400">
                        {error || "Project not found."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <button
                            type="button"
                            onClick={() =>
                                window.history.back()
                            }
                            className="mb-5 flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back to projects
                        </button>

                        <p className="text-sm font-medium text-[#A78BFA]">
                            Project
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-white">
                            {project.name}
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                            {project.description ||
                                "No project description yet."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                        aria-label="Project options"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="mt-8 border-b border-white/10">
                    <nav className="flex items-center gap-6 overflow-x-auto">
                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-2 border-b-2 border-[#A78BFA] pb-3 text-sm font-medium text-white"
                        >
                            Overview
                        </button>

                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-2 pb-3 text-sm text-white/40 transition hover:text-white"
                        >
                            <ListTodo size={16} />
                            Tasks
                        </button>

                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-2 pb-3 text-sm text-white/40 transition hover:text-white"
                        >
                            <CalendarDays size={16} />
                            Calendar
                        </button>

                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-2 pb-3 text-sm text-white/40 transition hover:text-white"
                        >
                            <FileText size={16} />
                            Documents
                        </button>

                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-2 pb-3 text-sm text-white/40 transition hover:text-white"
                        >
                            <Users size={16} />
                            Members
                        </button>
                    </nav>
                </div>

                {/* Overview */}
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-2xl border border-white/10 bg-[#14141B] p-5">
                        <p className="text-sm text-white/40">
                            Members
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                            {project.membersCount}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#14141B] p-5">
                        <p className="text-sm text-white/40">
                            Tasks
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                            —
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#14141B] p-5">
                        <p className="text-sm text-white/40">
                            Completed
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                            —
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#14141B] p-5">
                        <p className="text-sm text-white/40">
                            Status
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#A78BFA]">
                            Active
                        </p>
                    </div>
                </div>

                {/* Content placeholder */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#14141B] p-6">
                    <h2 className="text-lg font-semibold text-white">
                        Project overview
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                        This is where the project's activity,
                        milestones, upcoming work, and progress
                        will appear.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;