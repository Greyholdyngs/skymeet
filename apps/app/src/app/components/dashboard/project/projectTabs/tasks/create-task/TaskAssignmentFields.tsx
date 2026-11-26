"use client";

import { useQuery } from "@tanstack/react-query";
import type { Project } from "@/app/types/project";
import { apiFetch } from "@/app/lib/api";
import { queryKeys } from "@/app/lib/queries/query-key";

interface ProjectPerson {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        userName: string;
    };
    role: string;
}

interface ProjectPeopleResponse {
    members: ProjectPerson[];
    invitations: unknown[];
}

interface TaskAssignmentFieldsProps {
    project: Project;
    assigneeIds: string[];
    onChange: (ids: string[]) => void;
    reviewerId: string;
    onReviewerChange: (id: string) => void;
}

const TaskAssignmentFields = ({ project, assigneeIds, onChange, reviewerId, onReviewerChange, }: TaskAssignmentFieldsProps) => {
    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.projects.members(project._id),
        queryFn: () =>
            apiFetch<ProjectPeopleResponse>(`/projects/${project._id}/people`),
        enabled: Boolean(project._id),
    });

    const members = data?.members ?? [];

    const toggleMember = (id: string) => {
        onChange( assigneeIds.includes(id) ? assigneeIds.filter((memberId) => memberId !== id) : [...assigneeIds, id] );
    };

    return (
        <div className="space-y-5">
            <div>
                <label className="mb-2 block text-sm font-medium text-white/70"> Assignees </label>
                <div className="rounded-lg border border-white/10 bg-[#101017] p-3">
                    {isLoading ? (
                        <p className="text-sm text-white/40"> Loading project members... </p>
                    ) : error ? (
                        <p className="text-sm text-red-400">{error instanceof Error ? error.message : "Unable to load project members."}</p>
                    ) : members.length === 0 ? (
                        <p className="text-sm text-white/40"> No project members available. </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {members.map((member) => {
                                const user = member.user;
                                const selected = assigneeIds.includes(user._id);

                                return (
                                    <button
                                        key={user._id}
                                        type="button"
                                        onClick={() => toggleMember(user._id)}
                                        className={`max-w-full wrap-break-word rounded-md border px-3 py-1.5 text-xs transition ${
                                                    selected ? "border-[#7C3AED]/50 bg-[#7C3AED]/15 text-violet-200"
                                                 : "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70"}`}
                                    >
                                        {user.firstName} {user.lastName}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div>
                <label
                    htmlFor="task-reviewer"
                    className="mb-2 block text-sm font-medium text-white/70"
                >
                    Reviewer
                </label>
                <select
                    id="task-reviewer"
                    value={reviewerId}
                    onChange={(event) => onReviewerChange(event.target.value)}
                    disabled={isLoading || !!error || members.length === 0}
                    className="w-full min-w-0 rounded-lg border border-white/10 bg-[#101017] px-3 py-3 text-sm text-white outline-none focus:border-[#7C3AED] disabled:opacity-50"
                >
                    <option value="">Select a reviewer</option>
                    {members.map((member) => (
                        <option key={member.user._id} value={member.user._id}>
                            {member.user.firstName} {member.user.lastName} (@{member.user.userName})
                        </option>
                    ))}
                </select>
                <p className="mt-2 text-xs text-white/35"> The reviewer will assess the task when it is submitted for review. </p>
            </div>
        </div>
    );
};

export default TaskAssignmentFields;
