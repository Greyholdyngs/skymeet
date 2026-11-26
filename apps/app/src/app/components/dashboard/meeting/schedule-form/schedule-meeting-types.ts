export interface ScheduleMeetingData {
    title: string;
    date: string;
    time: string;
    scope: "general" | "project";
    projectId?: string;
    attendeeIds: string[];
    meetingLink: string;
}

export interface ScheduleMeetingModalProps {
    open: boolean;
    onClose: () => void;
    onSchedule?: (data: ScheduleMeetingData) => void;
    projects: import("@/app/types/project").Project[];
    currentUserId: string;
}
