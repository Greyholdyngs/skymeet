
"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Plus } from "lucide-react";
import type { Project } from "@/app/types/project";

import { useProjectSprints } from "./hooks/useProjectSprints";
import { getBacklogTasks, getSprintTasks } from "./sprint-utils";
import type { Sprint } from "./types";

import SprintForm from "./components/SprintForm";
import SprintCard from "./components/SprintCard";
import SprintSection from "./components/SprintSection";

import SprintBacklog from "./components/SprintBacklog";
import CreateTaskModal from "../tasks/create-task/CreateTaskModal";

interface ProjectSprintsProps {
    project: Project;
}

const ProjectSprints = ({ project }: ProjectSprintsProps) => {
    const { sprints, tasks, isManager, loading, error, actionLoading, createSprint, updateSprintStatus,
            deleteSprint, assignTask, loadData } = useProjectSprints(project);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

    const activeSprints = sprints.filter((sprint) => sprint.status === "active");
    const plannedSprints = sprints.filter((sprint) => sprint.status === "planned");
    const completedSprints = sprints.filter((sprint) => sprint.status === "completed");

    const handleCreateSprint = async (data: { name: string; description: string; startDate: string;
                                endDate: string; }) => {
        const success = await createSprint(data);

        if (success) {
            setShowCreateForm(false);
        }
    };

    const handleDeleteSprint = async (sprint: Sprint) => {
        const confirmed = window.confirm( `Delete "${sprint.name}"? Its tasks will return to the backlog.` );

        if (confirmed) {
            await deleteSprint(sprint._id);
        }
    };

    const handleTaskCreated = async () => {
        setIsCreateTaskOpen(false);
        setSelectedSprintId(null);
        await loadData();
    };

    const renderSprintCards = (items: Sprint[]) => (
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            {items.map((sprint) => (
                <SprintCard
                    key={sprint._id}
                    sprint={sprint}
                    sprints={sprints}
                    tasks={getSprintTasks(tasks, sprint._id)}
                    isManager={isManager}
                    actionLoading={actionLoading}
                    onStatusChange={(id, status) => void updateSprintStatus(id, status)}
                    onDelete={(item) => void handleDeleteSprint(item)}
                    onAssignTask={(taskId, sprintId) => void assignTask(taskId, sprintId)}
                    onCreateTask={(sprintId) => {
                        setSelectedSprintId(sprintId);
                        setIsCreateTaskOpen(true);
                    }}
                />
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="py-12 text-center text-sm theme-text-secondary"> Loading sprints... </div>
        );
    }

    return (
        <div className="min-w-0 space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-lg font-semibold theme-text">Sprints</h2>
                    <p className="mt-1 text-sm theme-text-secondary"> Plan and track development cycles for {project.name}. </p>
                </div>
                {isManager && (
                    <button
                        type="button"
                        onClick={() => setShowCreateForm((current) => !current)}
                        className="flex shrink-0 items-center gap-2 rounded-lg bg-[#7C3AED] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
                    >
                        <Plus size={16} />
                        Create sprint
                    </button>
                )}
            </div>
            {error && (
                <div
                    role="alert"
                    className="wrap-break-word rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500"
                >
                    {error}
                </div>
            )}
            {showCreateForm && isManager && (
                <SprintForm
                    loading={actionLoading}
                    onSubmit={handleCreateSprint}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}
            {activeSprints.length > 0 && (
                <SprintSection
                    title="Active Sprint"
                    count={activeSprints.length}
                    icon={<Clock3 size={17} className="text-emerald-400" />}
                    emptyMessage="No active sprints."
                    isEmpty={false}
                >
                    {renderSprintCards(activeSprints)}
                </SprintSection>
            )}
            <SprintSection
                title="Planned Sprints"
                count={plannedSprints.length}
                icon={<CalendarDays size={17} className="text-blue-400" />}
                emptyMessage="No planned sprints yet."
                isEmpty={plannedSprints.length === 0}
            >
                {renderSprintCards(plannedSprints)}
            </SprintSection>
            <SprintSection
                title="Completed Sprints"
                count={completedSprints.length}
                icon={<CheckCircle2 size={17} className="theme-text-muted" />}
                emptyMessage="Completed sprints will appear here."
                isEmpty={completedSprints.length === 0}
            >
                {renderSprintCards(completedSprints)}
            </SprintSection>
            <SprintBacklog
                tasks={getBacklogTasks(tasks)}
                sprints={sprints}
                isManager={isManager}
                actionLoading={actionLoading}
                onAssignTask={(taskId, sprintId) =>
                    void assignTask(taskId, sprintId)
                }
            />
            {!isManager && (
                <p className="text-xs theme-text-muted"> Only project owners and admins can manage sprints and task assignments. </p>
            )}
            <CreateTaskModal
                project={project}
                isOpen={isCreateTaskOpen}
                initialSprintId={selectedSprintId}
                onClose={() => {
                    setIsCreateTaskOpen(false);
                    setSelectedSprintId(null);
                }}
                onSubmit={handleTaskCreated}
            />
        </div>
    );
};

export default ProjectSprints;
