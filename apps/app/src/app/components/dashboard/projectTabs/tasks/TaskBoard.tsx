"use client";
import { useState } from "react";
import TaskColumn from "./TaskColumn";
import TaskDetails from "./task-details/TaskDetails";

import type { Task, TaskStatus } from "./types/types";

interface TaskBoardProps {
    projectId: string;
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            title: "Create project authentication flow",
            status: "todo",
        },
        {
            id: "2",
            title: "Build project dashboard",
            status: "todo",
        },
        {
            id: "3",
            title: "Connect project members API",
            status: "todo",
        },
        {
            id: "4",
            title: "Connect project members API",
            status: "task_review",
        },
        {
            id: "5",
            title: "Connect project members API",
            status: "task_review",
        },
    ]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [draggedTaskId, setDraggedTaskId] =  useState<string | null>(null);
    const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

    const canMoveTask = ( from: TaskStatus, to: TaskStatus ) => {
        if (from === to) {
            return false;
        }

        if (to === "completed") {
            return false;
        }

        if (from === "todo" && to === "in_progress") {
            return true;
        }

        if ( from === "in_progress" && (to === "todo" || to === "task_review") ) {
            return true;
        }

        if ( from === "task_review" && to === "in_progress" ) {
            return true;
        }

        return false;
    };

    const handleDragStart = (taskId: string) => { setDraggedTaskId(taskId) };
    const handleDragEnd = () => {
        setDraggedTaskId(null);
        setDragOverStatus(null);
    };

    const handleDragOver = ( event: React.DragEvent<HTMLDivElement>, status: TaskStatus ) => {
        event.preventDefault();

        if (!draggedTaskId) {
            return;
        }
        const draggedTask = tasks.find( (task) => task.id === draggedTaskId );

        if (!draggedTask) {
            return;
        }

        if (!canMoveTask(draggedTask.status, status)) {
            return;
        }
        setDragOverStatus(status);
    };

    const handleDragLeave = () => { setDragOverStatus(null) };
    const handleDrop = ( event: React.DragEvent<HTMLDivElement>, status: TaskStatus ) => {
        event.preventDefault();
        if (!draggedTaskId) {
            return;
        }

        const draggedTask = tasks.find( (task) => task.id === draggedTaskId );

        if (!draggedTask) {
            handleDragEnd();
            return;
        }

        if (!canMoveTask(draggedTask.status, status)) {
            handleDragEnd();
            return;
        }

        setTasks((currentTasks) => currentTasks.map((task) => task.id === draggedTaskId ? { ...task, status } : task ), );

        handleDragEnd();
    };

    const todoTasks = tasks.filter((task) => task.status === "todo");
    const inProgressTasks = tasks.filter((task) => task.status === "in_progress");

    const reviewTasks = tasks.filter((task) => task.status === "task_review");
    const completedTasks = tasks.filter((task) => task.status === "completed",);

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
    };

    const handleApproveTask = (taskId: string) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                 task.id === taskId && task.status === "task_review" ? { ...task, status: "completed" } : task
            )
        );
    };

    const handleRequestChanges = (taskId: string, comment: string) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === taskId && task.status === "task_review" ? { ...task, status: "in_progress" } : task
            )
        );

        console.log("Review changes requested:", { taskId, comment });
    };
    return (
        <>
            <div className="overflow-x-auto pb-4 hide-scrollbar">
                <div className="grid min-w-275 md:grid-cols-4 sm:grid-cols-2 gap-4">
                    <TaskColumn
                        title="To Do"
                        status="todo"
                        tasks={todoTasks}
                        projectId={projectId}
                        draggedTaskId={draggedTaskId}
                        dragOverStatus={dragOverStatus}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onTaskClick={handleTaskClick}
                    />
                    <TaskColumn
                        title="In Progress"
                        status="in_progress"
                        tasks={inProgressTasks}
                        projectId={projectId}
                        draggedTaskId={draggedTaskId}
                        dragOverStatus={dragOverStatus}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onTaskClick={handleTaskClick}
                    />
                    <TaskColumn
                        title="Task Review"
                        status="task_review"
                        tasks={reviewTasks}
                        projectId={projectId}
                        draggedTaskId={draggedTaskId}
                        dragOverStatus={dragOverStatus}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onTaskClick={handleTaskClick}
                    />
                    <TaskColumn
                        title="Complete"
                        status="completed"
                        tasks={completedTasks}
                        projectId={projectId}
                        draggedTaskId={draggedTaskId}
                        dragOverStatus={dragOverStatus}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onTaskClick={handleTaskClick}
                    />
                    
                </div>
            </div>
            <TaskDetails
                task={selectedTask}
                isOpen={Boolean(selectedTask)}
                onClose={() => setSelectedTask(null)}
                onApproveTask={handleApproveTask}
                onRequestChanges={handleRequestChanges}
            />
        </>
        
    );
};

export default TaskBoard;