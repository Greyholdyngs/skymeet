export type InviteMethod = "email" | "username";
export type InviteRole = "admin" | "team_member";

export interface InviteMemberInput {
    projectId: string;
    method: InviteMethod;
    identifier: string;
    role: InviteRole;
}

export interface InviteProjectOption {
    id: string;
    name: string;
}

export interface InviteUser {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email?: string;
}
