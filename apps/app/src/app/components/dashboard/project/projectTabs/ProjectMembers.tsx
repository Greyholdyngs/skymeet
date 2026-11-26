"use client";

import { Mail, UserPlus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";

import { queryKeys } from "@/app/lib/queries/query-key";
import type { Project } from "@/app/types/project";

interface ProjectPerson {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
    };
    role: string;
    joinedAt: string;
}

interface ProjectInvitation {
    _id: string;
    email: string;
    role: string;
    status: "PENDING" | "DECLINED" | "EXPIRED";
    createdAt: string;
    expiresAt: string;
}

interface ProjectPeopleResponse {
    members: ProjectPerson[];
    invitations: ProjectInvitation[];
}

interface ProjectMembersProps {
    project: Project;
    onAddMember: () => void;
}

const ProjectMembers = ({ project, onAddMember }: ProjectMembersProps) => {
    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.projects.members(project._id),
        queryFn: () =>
            apiFetch<ProjectPeopleResponse>(
                `/projects/${project._id}/people`,
            ),
        enabled: Boolean(project._id),
    });

    const members = data?.members ?? [];
    const invitations = data?.invitations ?? [];

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold theme-text"> Members </h2>
                    <p className="mt-1 text-sm theme-text-secondary"> People who have access to {project.name}. </p>
                </div>
                <button
                    type="button"
                    onClick={onAddMember}
                    className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
                >
                    <UserPlus size={16} />
                    Add member
                </button>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border theme-border theme-surface">
                {isLoading ? (
                    <div className="p-6">
                        <p className="text-sm theme-text-secondary"> Loading members... </p>
                    </div>
                ) : error ? (
                    <div className="p-6">
                        <p className="text-sm text-red-500">
                            {error instanceof Error ? error.message : "Unable to load project members."}
                        </p>
                    </div>
                ) : members.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#7C3AED]">
                            <Users size={22} />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold theme-text"> No members yet </h3>
                        <p className="mt-2 text-sm theme-text-secondary"> Add people to start collaborating on this project. </p>
                    </div>
                ) : (
                    <div className="divide-y theme-border-subtle">
                        {members.map((member) => (
                            <div
                                key={member.user._id}
                                className="flex items-center justify-between gap-4 p-5"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/10 text-sm font-semibold text-[#7C3AED]">
                                        {member.user.firstName.charAt(0)}
                                        {member.user.lastName.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium theme-text">
                                            {member.user.firstName}{" "}
                                            {member.user.lastName}
                                        </p>
                                        <p className="truncate text-xs theme-text-secondary"> @{member.user.userName} </p>
                                        <div className="mt-1 flex items-center gap-1.5 text-xs theme-text-muted">
                                            <Mail size={12} />
                                            <span className="truncate"> {member.user.email} </span>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                                        member.role === "OWNER" ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                                                                 : "theme-surface-elevated theme-text-secondary" }`}
                                >
                                    {member.role}
                                </span>
                            </div>
                        ))}
                        <div className="mt-8">
                            <div className="overflow-hidden rounded-2xl border theme-border theme-surface">
                                {invitations.length === 0 ? (
                                    <div className="p-6">
                                        <p className="text-sm theme-text-secondary"> No invitations yet. </p>
                                    </div>
                                ) : (
                                    <div className="divide-y theme-border-subtle">
                                        {invitations.map((invitation) => (
                                            <div
                                                key={invitation._id}
                                                className="flex items-center justify-between gap-4 p-5"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium theme-text"> {invitation.email} </p>
                                                    <p className="mt-1 text-xs theme-text-secondary"> {invitation.role} </p>
                                                </div>
                                                <span
                                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                                                        invitation.status === "PENDING" ? "bg-yellow-500/10 text-yellow-600"
                                                            : invitation.status === "DECLINED" ? "bg-red-500/10 text-red-500"
                                                              : "theme-surface-elevated theme-text-secondary"  }`}
                                                >
                                                    {invitation.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectMembers;

