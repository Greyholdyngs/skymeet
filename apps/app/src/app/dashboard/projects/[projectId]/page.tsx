"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, ListTodo, MoreHorizontal, Users } from "lucide-react";

import { apiFetch } from "@/app/lib/api";
import type { Project } from "@/app/types/project";
import ProjectCalendar from "@/app/components/dashboard/projectTabs/ProjectCalendar";

import ProjectDocuments from "@/app/components/dashboard/projectTabs/ProjectDocuments";
import ProjectMembers from "@/app/components/dashboard/projectTabs/ProjectMembers";
import ProjectOverview from "@/app/components/dashboard/projectTabs/ProjectOverview";

import ProjectTasks from "@/app/components/dashboard/projectTabs/ProjectTasks";
import { UserPlus } from "lucide-react";
import InviteMemberModal from "@/app/components/dashboard/project/members/InviteMemberModal";

import { InviteMemberInput } from "@/app/components/dashboard/project/members/types";

type ProjectTab = | "overview" | "tasks" | "calendar" | "documents" | "members";

const ProjectPage = () => {
    const params = useParams();
    const projectId = params.projectId as string;
    const [activeTab, setActiveTab] = useState<ProjectTab>("overview");

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const buttonStyle = "flex shrink-0 items-center gap-2 border-b-2 pb-3 text-sm transition cursor-pointer"
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const handleInvite = async (input: InviteMemberInput) => {
        console.log("Invitation payload:", input);
    };

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
                <div>
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="mb-5 flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back to projects
                        </button>
                        <button
                            type="button"
                            className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                            aria-label="Project options"
                        >
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <p className="text-sm font-medium text-[#A78BFA]"> Project </p>
                    <div className="flex items-center justify-between">
                            <div>
                                <h1 className="mt-1 text-3xl font-bold text-white">
                                    {project.name}
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                                    {project.description || "No project description yet."}
                                </p>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setIsInviteOpen(true)}
                                    className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-[#6D28D9] cursor-pointer"
                                    >
                                    <UserPlus size={16} />
                                    Add member
                                </button>
                            </div>
                    </div>
                </div>
                <div className="mt-8 border-b border-white/10">
                    <nav className="flex items-center gap-6 overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab("overview")}
                            className={`${buttonStyle} ${
                                        activeTab === "overview" ? "border-[#A78BFA] text-white" : "border-transparent text-white/40 hover:text-white"
                                    }`}
                        >
                            Overview
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("tasks")}
                            className={`${buttonStyle} ${
                                        activeTab === "tasks" ? "border-[#A78BFA] font-medium text-white" : "border-transparent text-white/40 hover:text-white"
                                     }`}
                        >
                            <ListTodo size={16} />
                            Tasks
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("calendar")}
                            className={`${buttonStyle} ${
                                        activeTab === "calendar" ? "border-[#A78BFA] font-medium text-white" : "border-transparent text-white/40 hover:text-white"
                                     }`}
                        >
                            <CalendarDays size={16} />
                            Calendar
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("documents")}
                            className={`${buttonStyle} ${
                                        activeTab === "documents" ? "border-[#A78BFA] font-medium text-white" : "border-transparent text-white/40 hover:text-white"
                                     }`}
                        >
                            <FileText size={16} />
                            Documents
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("members")}
                            className={`${buttonStyle} ${
                                        activeTab === "members" ? "border-[#A78BFA] font-medium text-white" : "border-transparent text-white/40 hover:text-white"
                                     }`}
                        >
                            <Users size={16} />
                            Members
                        </button>
                    </nav>
                </div>
                <div className="mt-8">
                    {activeTab === "overview" && (
                        <ProjectOverview project={project}/>
                    )}
                    {activeTab === "tasks" && (
                        <ProjectTasks project={project} />
                    )}
                    {activeTab === "calendar" && (
                        <ProjectCalendar project={project} />
                    )}
                    {activeTab === "documents" && (
                        <ProjectDocuments project={project} />
                    )}
                    {activeTab === "members" && (
                        <ProjectMembers project={project} />
                    )}
                </div>
            </div>
            <InviteMemberModal
                isOpen={isInviteOpen}
                projects={[]}
                projectId={projectId}
                projectName={project.name}
                onClose={() => setIsInviteOpen(false)}
                onInvite={handleInvite}
            />
        </div>
    );
};

export default ProjectPage;