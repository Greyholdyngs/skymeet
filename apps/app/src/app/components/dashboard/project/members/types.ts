export type InviteMethod = "email" | "username";

export interface InviteMemberInput {
    projectId: string;
    method: InviteMethod;
    identifier: string;
}

export interface InviteProjectOption {
    id: string;
    name: string;
}
