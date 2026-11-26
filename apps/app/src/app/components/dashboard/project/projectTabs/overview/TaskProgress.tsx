import type { ProjectOverviewTask } from "./types";

interface TaskProgressProps {
    tasks: ProjectOverviewTask[];
}

const STATUS_CONFIG = [
    { status: "todo", label: "To do", color: "bg-gray-400" },
    { status: "in_progress", label: "In progress", color: "bg-blue-500" },
    { status: "task_review", label: "In review", color: "bg-yellow-500" },
    { status: "completed", label: "Completed", color: "bg-emerald-500" },
] as const;

const TaskProgress = ({ tasks }: TaskProgressProps) => {
    const totalTasks = tasks.length;

    const statusCounts = STATUS_CONFIG.map((item) => ({
        ...item,
        count: tasks.filter((task) => task.status === item.status).length,
    }));

    return (
        <section className="rounded-xl border theme-border theme-surface p-5">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold theme-text">Task progress</h3>
                <span className="text-sm theme-text-secondary"> {totalTasks} {totalTasks === 1 ? "task" : "tasks"} </span>
            </div>
            <div className="mt-5 flex h-2 overflow-hidden rounded-full theme-surface-elevated">
                {statusCounts.map((item) => (
                    <div
                        key={item.status}
                        className={`${item.color} transition-all`}
                        style={{ width: totalTasks > 0 ? `${(item.count / totalTasks) * 100}%` : "0%",}}
                    />
                ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
                {statusCounts.map((item) => (
                    <div key={item.status} className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`}/>
                        <div className="min-w-0">
                            <p className="text-sm theme-text-secondary"> {item.label} </p>
                            <p className="mt-1 font-medium theme-text"> {item.count} </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TaskProgress;