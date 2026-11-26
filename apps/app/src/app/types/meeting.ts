export type MeetingStatus =
  | "scheduled"
  | "active"
  | "ended"
  | "cancelled";

export type MeetingResponse =
  | "pending"
  | "accepted"
  | "declined";

export interface MeetingParticipant {
  id: string;
  name: string;
  response: MeetingResponse;
}

export interface Meeting {
  id: string;
  title: string;
  scope: "general" | "project";
  projectId?: string;
  description?: string;
  status: MeetingStatus;
  hostId: string;
  participants: MeetingParticipant[];
  meetingLink?: string;
  scheduledFor: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}
