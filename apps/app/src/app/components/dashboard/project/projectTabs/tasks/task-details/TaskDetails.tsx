"use client";

import type { Task } from "../types/types";
import TaskDetailsHeader from "./TaskDetailsHeader";
import TaskDetailsInfo from "./TaskDetailsInfo";

import TaskCustomFields from "./TaskCustomFields";
import TaskComment from "./TaskComments";
import TaskActivity from "./TaskActivity";

import TaskReviewActions from "./TaskReviewActions";

interface TaskDetailsProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onApproveTask: (taskId: string) => void;
    onRequestChanges: (taskId: string, comment: string) => void;
    projectId: string;
    onCustomFieldsUpdated: (
        taskId: string,
        fieldId: string,
        update: | { value: string } | { itemId: string; completed: boolean },
    ) => void;
}

const TaskDetails = ({ task, isOpen, onClose, onApproveTask, onRequestChanges, projectId, onCustomFieldsUpdated }: TaskDetailsProps) => {
    if (!isOpen || !task) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl theme-border theme-surface shadow-2xl">
                <TaskDetailsHeader
                    task={task}
                    onClose={onClose}
                />
                <div className="overflow-y-auto">
                    <div className="space-y-6 p-5 sm:p-6">
                        <TaskDetailsInfo task={task} />
                       {task.customFields && task.customFields.length > 0 && (
                            <TaskCustomFields
                                fields={task.customFields}
                                projectId={projectId}
                                taskId={task.id}
                                status={task.status}
                                onUpdated={(fieldId, update) => onCustomFieldsUpdated(task.id, fieldId, update)}
                            />
                        )}
                       {task.status === "task_review" && (
                            <TaskReviewActions 
                                task={task}
                                onApprove={onApproveTask}
                                onRequestChanges={onRequestChanges} />
                        )}
                        <TaskComment task={task} projectId={projectId}/>
                        <TaskActivity task={task} />
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TaskDetails;