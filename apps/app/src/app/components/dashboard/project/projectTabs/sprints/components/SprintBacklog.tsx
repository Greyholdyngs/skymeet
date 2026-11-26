
import type { Sprint, SprintTask } from "../types";

interface SprintBacklogProps {
    tasks: SprintTask[];
    sprints: Sprint[];
    isManager: boolean;
    actionLoading: boolean;
    onAssignTask: (taskId: string, sprintId: string) => void;
}

const SprintBacklog = ({ tasks, sprints, isManager, actionLoading, onAssignTask, }: SprintBacklogProps) => {
    const availableSprints = sprints.filter((sprint) => sprint.status !== "completed");

    return (
        <section className="min-w-0 space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="font-semibold theme-text">Backlog</h3>
                    <p className="mt-1 text-xs theme-text-secondary"> Tasks not assigned to a sprint. </p>
                </div>
                <span className="shrink-0 rounded-full theme-surface-elevated px-3 py-1 text-xs theme-text-secondary"> {tasks.length} tasks </span>
            </div>
            {tasks.length === 0 ? (
                <p className="rounded-xl border border-dashed theme-border p-6 text-center text-sm theme-text-muted"> Your backlog is empty. </p>
            ) : (
                <div className="space-y-2">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border theme-border theme-surface p-3 sm:p-4"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="break-word text-sm font-medium theme-text"> {task.title} </p>
                                <p className="mt-1 text-xs capitalize theme-text-muted"> {task.status.replace("_", " ")} </p>
                            </div>
                            {isManager && (
                                <select
                                    value=""
                                    disabled={actionLoading || availableSprints.length === 0}
                                    onChange={(event) => onAssignTask(task._id, event.target.value)}
                                    aria-label={`Assign ${task.title} to a sprint`}
                                    className="max-w-full min-w-0 rounded-lg border theme-border theme-surface-elevated px-2 py-2 text-xs theme-text outline-none focus:border-[#7C3AED] disabled:opacity-40"
                                >
                                    <option value="">Assign to sprint</option>
                                    {availableSprints.map((sprint) => (
                                        <option key={sprint._id} value={sprint._id}>
                                            {sprint.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default SprintBacklog;
