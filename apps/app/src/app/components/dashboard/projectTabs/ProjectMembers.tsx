"use client";

import { useEffect, useState } from "react";
import { Mail, UserPlus, Users } from "lucide-react";

import { apiFetch } from "@/app/lib/api";
import type { Project } from "@/app/types/project";

interface ProjectMember {
    _id: string;
    projectId: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
    };
    role: "owner" | "member";
    createdAt: string;
    updatedAt: string;
}

interface ProjectMembersProps {
    project: Project;
}

const ProjectMembers = ({ project }: ProjectMembersProps) => {

    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMembers = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch<ProjectMember[]>(`/projects/${project._id}/members`,);
                setMembers(data);

            } catch (error) {
                setError( error instanceof Error ? error.message : "Unable to load project members.");

            } finally {
                setLoading(false);
            }
        };

        loadMembers();
    }, [project._id]);

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-white"> Members </h2>
                    <p className="mt-1 text-sm text-white/40">
                        People who have access to {project.name}.
                    </p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
                >
                    <UserPlus size={16} />
                    Add member
                </button>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#14141B]">
                {loading ? (
                    <div className="p-6">
                        <p className="text-sm text-white/40"> Loading members... </p>
                    </div>
                ) : error ? (
                    <div className="p-6">
                        <p className="text-sm text-red-400"> {error} </p>
                    </div>
                ) : members.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A78BFA]">
                            <Users size={22} />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-white">
                            No members yet
                        </h3>
                        <p className="mt-2 text-sm text-white/40">
                            Add people to start collaborating on this
                            project.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {
                            members.map((member) => (
                                <div
                                    key={member._id}
                                    className="flex items-center justify-between gap-4 p-5"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/10 text-sm font-semibold text-[#A78BFA]">
                                            {member.userId.firstName.charAt(0)}
                                            {member.userId.lastName.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">
                                                {member.userId.firstName}{" "}
                                                {member.userId.lastName}
                                            </p>
                                            <p className="truncate text-xs text-white/40">
                                                @{member.userId.userName}
                                            </p>
                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-white/30">
                                                <Mail size={12} />
                                                <span className="truncate">
                                                    {member.userId.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                                                    member.role === "owner" ? "bg-[#7C3AED]/10 text-[#A78BFA]" : "bg-white/5 text-white/50"
                                        }`}
                                    >
                                        {member.role}
                                    </span>
                                </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectMembers;