"use client";

import type { Project } from "@/app/types/project";

interface ProjectAttendeePickerProps {
    projects: Project[];
    selectedProjectIds: string[];
    loading: boolean;
    onToggle: (projectId: string) => void;
}

const ProjectAttendeePicker = ({ projects, selectedProjectIds, loading, onToggle }: ProjectAttendeePickerProps) => {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium theme-text-secondary"> Add project members </label>
            <p className="mb-3 text-xs theme-text-muted"> Select one or more projects to add their members. You can also invite individual users. </p>
            <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border theme-border theme-surface-elevated p-3">
                {projects.length === 0 ? (
                <p className="text-sm theme-text-muted">No projects available.</p>
                ) : (
                projects.map((project) => (
                    <label
                        key={project._id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition theme-surface-hover"
                    >
                        <input
                            type="checkbox"
                            checked={selectedProjectIds.includes(project._id)}
                            disabled={loading}
                            onChange={() => onToggle(project._id)}
                            className="h-4 w-4 accent-[#7C3AED]"
                        />
                        <span className="text-sm theme-text"> {project.name} </span>
                    </label>
                ))
                )}
            </div>
        </div>
    );
};

export default ProjectAttendeePicker;
