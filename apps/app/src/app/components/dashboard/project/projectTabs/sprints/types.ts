export type SprintStatus = "planned" | "active" | "completed";

export interface Sprint {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: SprintStatus;
}

export interface SprintTask {
    _id: string;
    title: string;
    status: "todo" | "in_progress" | "task_review" | "completed";
    sprintId?: string | null;
    dueDate?: string | null;
}

export interface ProjectPerson {
    user: { _id: string;};
    role: string;
}

export interface ProjectPeopleResponse {
    members: ProjectPerson[];
    invitations: unknown[];
}