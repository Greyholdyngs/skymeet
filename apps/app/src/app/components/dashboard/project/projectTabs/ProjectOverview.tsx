"use client";

import type { Project } from "@/app/types/project";
import { useProjectOverview } from "./overview/hooks/useProjectOverview";
import OverviewMetrics from "./overview/OverviewMetrics";

import TaskProgress from "./overview/TaskProgress";
import ProjectDetails from "./overview/ProjectDetails";
import RecentProjectActivity from "./overview/RecentProjectActivity";

interface ProjectOverviewProps {
    project: Project;
}

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
    const { tasks, activities, loading, error } = useProjectOverview(project._id);

    const completedTasks = tasks.filter((task) => task.status === "completed").length;

    if (loading) {
        return (
        <div className="py-12 text-center text-sm theme-text-secondary"> Loading project overview... </div>
        );
    }

    if (error) {
        return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-sm text-red-500">{error}</p>
        </div>
        );
    }

    return (
        <div className="space-y-6">
            <OverviewMetrics
                membersCount={project.membersCount}
                totalTasks={tasks.length}
                completedTasks={completedTasks}
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <TaskProgress tasks={tasks} />
                <ProjectDetails project={project} />
            </div>
            <RecentProjectActivity
                activities={activities}
                projectId={project._id}
            />
        </div>
    );
};

export default ProjectOverview;

