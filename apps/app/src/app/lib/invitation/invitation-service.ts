import { apiFetch } from "@/app/lib/api";

export interface PendingProjectInvitation {
    id: string;
    projectId: string;
    projectName: string;
    inviter: {
        firstName: string;
        lastName: string;
        userName: string;
    };
    role: string;
    expiresAt: string;
}

export type InvitationAction = "accept" | "decline";

export interface InvitationResponse {
    message: string;
    projectId?: string;
    role?: string;
}

export async function getPendingProjectInvitation( projectId: string ): Promise<PendingProjectInvitation> {

    return apiFetch<PendingProjectInvitation>(`/projects/${encodeURIComponent(projectId)}/invitations/pending`,);
}

export async function respondToProjectInvitation( invitationId: string, action: InvitationAction,): Promise<InvitationResponse> {
    return apiFetch<InvitationResponse>("/invitations/respond", {
        method: "POST",
        body: JSON.stringify({
            invitationId,
            action,
        }),
    });
}
