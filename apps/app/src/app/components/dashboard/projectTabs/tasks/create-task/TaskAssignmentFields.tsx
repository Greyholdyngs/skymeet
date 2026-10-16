"use client";

import type { Project } from "@/app/types/project";

interface TaskAssignmentFieldsProps {
    project: Project;
    assigneeIds: string[];
    onChange: (ids: string[]) => void;
}

const TaskAssignmentFields = ({ assigneeIds, onChange }: TaskAssignmentFieldsProps) => {
    const members = [
        {
            id: "user-1",
            name: "Emmanuel Grey",
        },
        {
            id: "user-2",
            name: "John Doe",
        },
        {
            id: "user-3",
            name: "Jane Smith",
        },
    ];

    const toggleMember = (id: string) => {
        onChange( assigneeIds.includes(id) ? assigneeIds.filter( (memberId) => memberId !== id ) : [...assigneeIds, id]);
    };

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-white/70"> Assignee(s) </label>
            <div className="rounded-lg border border-white/10 bg-[#101017] p-3">
                <div className="flex flex-wrap gap-2">
                    {members.map((member) => {
                        const selected = assigneeIds.includes( member.id);
                        return (
                            <button
                                key={member.id}
                                type="button"
                                onClick={() => toggleMember( member.id )}
                                className={`rounded-md border px-3 py-1.5 text-xs transition ${
                                            selected ? "border-[#7C3AED]/50 bg-[#7C3AED]/15 text-violet-200"
                                            : "border-white/10 text-white/40 hover:bg-white/5 hover:text-white/70"
                                }`}
                            >
                                {member.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default TaskAssignmentFields;