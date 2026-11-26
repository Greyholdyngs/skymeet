export interface MeetingAttendee {
    id: string;
    name: string;
    userName?: string;
}

export interface AttendeeUser {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
}

export interface ProjectMember {
    _id: string;
    userId: AttendeeUser;
}

export interface AttendeeSource {
    attendee: MeetingAttendee;
    projectIds: string[];
    individuallyAdded: boolean;
}

export interface MeetingAttendeeSelectorProps {
    scope: "general" | "project";
    projects: import("@/app/types/project").Project[];
    projectId?: string;
    currentUserId: string;
    initialAttendees?: MeetingAttendee[];
    onChange: (attendees: MeetingAttendee[]) => void;
}
