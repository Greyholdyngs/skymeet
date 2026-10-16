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
                <h3 className="text-sm font-semibold text-white">  Description </h3>
                <p className="mt-2 text-sm leading-6 text-white/50"> {task.description || "No description has been added to this task."} </p>
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
                    value={ task.sprintDuration || "Not specified" }
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
        <div className="rounded-xl border border-white/10 bg-white/2 p-3">
            <div className="flex items-center gap-2 text-white/30">
                {icon}
                <span className="text-xs"> {label} </span>
            </div>
            <p className="mt-2 text-sm font-medium text-white/70"> {value} </p>
        </div>
    );
};
export default TaskDetailsInfo;