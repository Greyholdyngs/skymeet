export const heroProject = {
    name: "Website Redesign",
    workspace: "Product Team",
    status: "In progress",
    updatedAt: "Updated just now",
};

export const heroMetrics = [
    { label: "Members", value: "08" },
    { label: "Total Tasks", value: "24" },
    { label: "Completed", value: "16" },
];

export const heroTaskProgress = {
    completed: 16,
    total: 24,
    percentage: 67,
};

export const heroTaskColumns = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
        { id: "task-1", title: "Review landing page copy", priority: "High" },
        { id: "task-2", title: "Prepare design assets", priority: "Medium" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
        { id: "task-3", title: "Build responsive homepage", priority: "Urgent" },
        { id: "task-4", title: "Update navigation", priority: "Low" },
    ],
  },
  {
    id: "review",
    title: "Task Review",
    tasks: [
        { id: "task-5", title: "Check mobile layouts", priority: "High" },
    ],
  },
  {
    id: "completed",
    title: "Complete",
    tasks: [
        { id: "task-6", title: "Set up project workspace", priority: "Medium" },
    ],
  },
];

export const heroNotification = {
    title: "Task moved to review",
    description: "Build responsive homepage",
    actor: "Alex Morgan",
};