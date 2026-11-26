export type TaskStatus =
    | "todo"
    | "in_progress"
    | "task_review"
    | "completed";

export type TaskPriority =
    | "low"
    | "medium"
    | "high"
    | "urgent";

export type CustomFieldType =
    | "text"
    | "dropdown"
    | "checklist";

export interface ChecklistItem {
    id: string;
    label: string;
    completed?: boolean
}

export interface CustomField {
    id: string;
    name: string;
    type: CustomFieldType;
    value?: string;
    options?: string[];
    items?: ChecklistItem[];
}

export interface CreateTaskInput {
    title: string;
    description: string;
    dueDate?: string;
    sprintId?: string | null;
    reviewerId?: string;
    assigneeIds: string[];
    priority: TaskPriority;
    customFields: CustomField[];
}

export interface TaskAssignee {
    _id: string;
    userName: string;
}
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: TaskPriority;
    assigneeIds?: (string | TaskAssignee)[];
    reviewerId?: string | TaskAssignee | null;
    dueDate?: string | null;
    sprintId?: string | null;
    customFields?: CustomField[];
}