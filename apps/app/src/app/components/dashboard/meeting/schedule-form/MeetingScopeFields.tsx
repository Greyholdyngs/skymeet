"use client";

import type { Project } from "@/app/types/project";

interface MeetingScopeFieldsProps {
    scope: "general" | "project";
    projectId: string;
    projects: Project[];
    onScopeChange: (scope: "general" | "project") => void;
    onProjectChange: (projectId: string) => void;
}

const selectStyles = "w-full rounded-xl border theme-border theme-surface-elevated px-4 py-3 text-sm theme-text outline-none focus:border-[#7C3AED]";

const MeetingScopeFields = ({ scope, projectId, projects, onScopeChange, onProjectChange,}: MeetingScopeFieldsProps) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <label className="mb-2 block text-sm font-medium theme-text-secondary"> Meeting type </label>
                <select
                    value={scope}
                    onChange={(event) => onScopeChange(event.target.value as "general" | "project") }
                    className={selectStyles}
                >
                    <option value="general">General meeting</option>
                    <option value="project">Project meeting</option>
                </select>
            </div>
            {scope === "project" && (
                <div>
                    <label className="mb-2 block text-sm font-medium theme-text-secondary"> Select project </label>
                    <select
                        value={projectId}
                        onChange={(event) => onProjectChange(event.target.value)}
                        required
                        className={selectStyles}
                    >
                        <option value="">Choose a project</option>
                        {projects.map((project) => ( <option key={project._id} value={project._id}> {project.name} </option> ))}
                    </select>
                    {projects.length === 0 && (
                        <p className="mt-2 text-xs theme-text-muted"> No projects available. Create a project first. </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MeetingScopeFields;
