"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import type { Project } from "@/app/types/project";
import { queryKeys } from "@/app/lib/queries/query-key";
import TaskBoard from "./tasks/TaskBoard";

import CreateTaskModal from "./tasks/create-task/CreateTaskModal";

interface ProjectTasksProps {
    project: Project;
}

const ProjectTasks = ({ project }: ProjectTasksProps) => {
    const queryClient = useQueryClient();
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

    const handleTaskCreated = async () => {
        setIsCreateTaskOpen(false);

        await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.projects.tasks(project._id) }),
            queryClient.invalidateQueries({ queryKey: queryKeys.projects.overview(project._id), }),
            queryClient.invalidateQueries({ queryKey: queryKeys.projects.calendar(project._id), }),
        ]);
    };

    return (
        <div>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold theme-text"> Tasks </h2>
                    <p className="mt-1 text-sm theme-text-secondary"> Organize and track the work for {project.name}. </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsCreateTaskOpen(true)}
                    className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[#7C3AED] px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
                >
                    <Plus size={16} />
                    Add task
                </button>
            </div>
            <div className="mt-6">
                <TaskBoard projectId={project._id} />
            </div>
            <CreateTaskModal
                project={project}
                isOpen={isCreateTaskOpen}
                onClose={() => setIsCreateTaskOpen(false)}
                onSubmit={handleTaskCreated}
            />
        </div>
    );
};

export default ProjectTasks;

