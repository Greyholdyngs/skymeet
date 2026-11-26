export type NotificationType =
    | "task_assigned"
    | "task_review_requested"
    | "task_approved"
    | "task_changes_requested"
    | "comment_added"
    | "comment_reply"
    | "mention"
    | "meeting_invitation"
    | "meeting_rescheduled"
    | "meeting_cancelled"
    | "project_invitation";

export interface NotificationActor {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
}

export interface AppNotification {
    _id: string;
    recipientId: string;
    actorId: NotificationActor | null;
    type: NotificationType;
    title: string;
    message: string;
    resourceType: "project" | "task" | "meeting" | "comment" | null;
    resourceId: string | null;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationResponse {
    notifications: AppNotification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}