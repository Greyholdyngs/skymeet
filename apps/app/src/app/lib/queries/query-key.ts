export const queryKeys = {
    dashboard: {
        all: ["dashboard"] as const,
        summary: () => [...queryKeys.dashboard.all, "summary"] as const,
    },

    notifications: {
        all: ["notifications"] as const,
        lists: () => [...queryKeys.notifications.all, "list"] as const,
        list: (page: number) => [...queryKeys.notifications.lists(), page] as const,
        unreadCount: () => [...queryKeys.notifications.all, "unread-count"] as const,
    },

    people: {
        all: ["people"] as const,
        workspace: () => [...queryKeys.people.all, "workspace"] as const,
    },

    users: {
        all: ["users"] as const,
        profile: () => [...queryKeys.users.all, "profile"] as const,
        preferences: () => [...queryKeys.users.all, "preferences"] as const,
        directory: (search: string) => [...queryKeys.users.all, "directory", search] as const,
        currentUser: () => [...queryKeys.users.all, "current-user"] as const,
        inviteDirectory: (search: string, method: string) => [...queryKeys.users.all, "invite-directory", method, search] as const,
    },

    meetings: {
        all: ["meetings"] as const,
        list: () => [...queryKeys.meetings.all, "list"] as const,
    },

    projects: {
        all: ["projects"] as const,
        lists: () => [...queryKeys.projects.all, "list"] as const,
        detail: (projectId: string) => [...queryKeys.projects.all, "detail", projectId] as const,
        overview: (projectId: string) => [...queryKeys.projects.all, "overview", projectId] as const,
        calendar: (projectId: string) => [...queryKeys.projects.all, "calendar", projectId] as const,
        documents: (projectId: string) => [...queryKeys.projects.all, "documents", projectId] as const,
        sprints: (projectId: string) => [...queryKeys.projects.all, "sprints", projectId] as const,
        tasks: (projectId: string) => [...queryKeys.projects.all, "tasks", projectId] as const,
        taskComments: (projectId: string, taskId: string) => [...queryKeys.projects.all, "task-comments", projectId, taskId] as const,
        members: (projectId: string) => [...queryKeys.projects.all, "members", projectId] as const,
        attendeeMembers: (projectId: string) => [...queryKeys.projects.all, "attendee-members", projectId] as const,
    },
} as const;
