import { CalendarDays, Clock3, Flag, User } from "lucide-react";
import type { Task } from "../types/types";

interface TaskDetailsInfoProps {
    task: Task;
}

const priorityLabels = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
};

const TaskDetailsInfo = ({ task }: TaskDetailsInfoProps) => {
    return (
        <section className="space-y-5">
            <div>
                <h3 className="text-sm font-semibold theme-text">  Description </h3>
                <p className="mt-2 text-sm leading-6 theme-text-secondary"> {task.description || "No description has been added to this task."} </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                    icon={<Flag size={15} />}
                    label="Priority"
                    value={ task.priority ? priorityLabels[task.priority] : "Not set" }
                />
                <InfoItem
                    icon={<User size={15} />}
                    label="Assignee"
                    value={ task.assigneeIds?.length ? `${task.assigneeIds.length} assignee${ task.assigneeIds.length > 1 ? "s" : ""
                              }` : "Unassigned" }
                />
                <InfoItem
                    icon={<CalendarDays size={15} />}
                    label="Due date"
                    value={task.dueDate || "No due date"}
                />
                <InfoItem
                    icon={<Clock3 size={15} />}
                    label="Sprint / Duration"
                    value={task.sprintId || "Not assigned"}
                />
            </div>
        </section>
    );
};

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => {
    return (
        <div className="rounded-xl theme-border border theme-surface-elevated p-3">
            <div className="flex items-center gap-2 theme-text-muted">
                {icon}
                <span className="text-xs"> {label} </span>
            </div>
            <p className="mt-2 text-sm font-medium theme-text"> {value} </p>
        </div>
    );
};
export default TaskDetailsInfo;