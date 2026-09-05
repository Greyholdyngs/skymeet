export type MeetingStatus =
  | "scheduled"
  | "active"
  | "ended"
  | "cancelled";

export type MeetingType =
  | "instant"
  | "scheduled";

export type MeetingProvider =
  | "skymeet"
  | "google_meet";

export interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Meeting {
  id: string;
  title: string;
  type?: MeetingType;
  status: MeetingStatus;
  provider?: MeetingProvider;
  date?: string;
  time?: string;
  hostId: string;
  participants: MeetingParticipant[];
  joinCode?: string;
  externalMeetingUrl?: string;
  scheduledFor?: string;
  startedAt?: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
  endedAt?: string;
}