import type { SprintTask } from "./types";

export const getSprintTasks = ( tasks: SprintTask[], sprintId: string) => tasks.filter((task) => task.sprintId === sprintId);
export const getBacklogTasks = (tasks: SprintTask[]) => tasks.filter((task) => !task.sprintId);

export const getSprintProgress = (tasks: SprintTask[]) => {
    if (tasks.length === 0) return 0;

    const completed = tasks.filter( (task) => task.status === "completed" ).length;

    return Math.round((completed / tasks.length) * 100);
};

export const formatSprintDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });