export interface SharedProject {
    projectId: string;
    projectName: string;
    role: "owner" | "admin" | "team_member";
    joinedAt: string;
}

export interface WorkspacePerson {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
    };
    sharedProjects: SharedProject[];
}