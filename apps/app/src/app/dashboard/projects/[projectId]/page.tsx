"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, ListTodo, MoreHorizontal, Users } from "lucide-react";

import { apiFetch } from "@/app/lib/api";
import type { Project } from "@/app/types/project";
import ProjectCalendar from "@/app/components/dashboard/project/projectTabs/ProjectCalendar";

import ProjectDocuments from "@/app/components/dashboard/project/projectTabs/ProjectDocuments";
import ProjectMembers from "@/app/components/dashboard/project/projectTabs/ProjectMembers";
import ProjectOverview from "@/app/components/dashboard/project/projectTabs/ProjectOverview";

import ProjectTasks from "@/app/components/dashboard/project/projectTabs/ProjectTasks";
import { UserPlus } from "lucide-react";
import InviteMemberModal from "@/app/components/dashboard/project/members/InviteMemberModal";

import { InviteMemberInput } from "@/app/components/dashboard/project/members/types";
import ProjectSprints from "@/app/components/dashboard/project/projectTabs/sprints/ProjectSprints";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/app/lib/queries/query-key";

type ProjectTab = | "overview" | "tasks" | "sprints" | "calendar" | "documents" | "members";

const ProjectPage = () => {
    const params = useParams();
    const projectId = params.projectId as string;
    const [activeTab, setActiveTab] = useState<ProjectTab>("overview");

    const queryClient = useQueryClient();

    const projectQuery = useQuery({
        queryKey: queryKeys.projects.detail(projectId),
        queryFn: () => apiFetch<Project>(`/projects/${projectId}`),
        enabled: Boolean(projectId),
    });

    const project = projectQuery.data ?? null;
    const loading = projectQuery.isLoading;
    const error = projectQuery.error instanceof Error ? projectQuery.error.message : "";

    const buttonStyle = "flex shrink-0 items-center gap-2 border-b-2 pb-3 text-sm transition cursor-pointer"
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const inviteMutation = useMutation({
        mutationFn: (input: InviteMemberInput) =>
            apiFetch(`/projects/${input.projectId}/invitations`, {
                method: "POST",
                body: JSON.stringify({
                    ...(input.method === "email" ? { email: input.identifier } : { userName: input.identifier }),
                    role: input.role,
                }),
            }),
        onSuccess: async (_, input) => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.projects.members(input.projectId),
            });
        },
    });

    const handleInvite = async (input: InviteMemberInput): Promise<void> => {
        await inviteMutation.mutateAsync(input);
    };

    if (loading) {
        return (
            <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm text-white/40"> Loading project... </p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm text-red-400"> {error || "Project not found."} </p>
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
                            className="mb-5 flex items-center gap-2 text-sm text-theme-secondary transition"
                        >
                            <ArrowLeft size={16} />
                            Back to projects
                        </button>
                        <button
                            type="button"
                            className="rounded-lg p-2 transition hover:bg-white"
                            aria-label="Project options"
                        >
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <p className="text-sm font-medium text-[#A78BFA]"> Project </p>
                    <div className="flex items-center justify-between">
                            <div>
                                <h1 className="mt-1 text-3xl font-bold text-theme">
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
                            className={`${buttonStyle} ${ activeTab === "overview" ? "border-[#A78BFA] theme-text"
                                                        : "border-transparent theme-text-secondary hover:text-[#A78BFA]" }`}
                        >
                            Overview
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("tasks")}
                            className={`${buttonStyle} ${ activeTab === "tasks" ? "border-[#A78BFA] font-medium theme-text"
                                                                : "border-transparent theme-text-secondary hover:text-[#A78BFA]"}`}
                        >
                            <ListTodo size={16} />
                            Tasks
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("sprints")}
                            className={`${buttonStyle} ${ activeTab === "sprints" ? "border-[#A78BFA] font-medium theme-text"
                                                            : "border-transparent theme-text-secondary hover:text-[#A78BFA]"}`}
                        >
                            <ListTodo size={16} />
                            Sprints
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("calendar")}
                            className={`${buttonStyle} ${ activeTab === "calendar" ? "border-[#A78BFA] font-medium theme-text"
                                                                        : "border-transparent theme-text-secondary hover:text-[#A78BFA]"}`}
                        >
                            <CalendarDays size={16} />
                            Calendar
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("documents")}
                            className={`${buttonStyle} ${
                                        activeTab === "documents" ? "border-[#A78BFA] font-medium theme-text" : "border-transparent theme-text-secondary hover:text-[#A78BFA]"
                                     }`}
                        >
                            <FileText size={16} />
                            Documents
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("members")}
                            className={`${buttonStyle} ${
                                        activeTab === "members" ? "border-[#A78BFA] font-medium theme-text" : "border-transparent theme-text-secondary hover:text-[#A78BFA]"
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
                    {activeTab === "sprints" && (
                        <ProjectSprints project={project} />
                    )}
                    {activeTab === "calendar" && (
                        <ProjectCalendar project={project} />
                    )}
                    {activeTab === "documents" && (
                        <ProjectDocuments project={project} />
                    )}
                    {activeTab === "members" && (
                        <ProjectMembers
                            project={project}
                            onAddMember={() => setIsInviteOpen(true)}
                        />
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