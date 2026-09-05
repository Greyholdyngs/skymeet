import type { Meeting } from "@/app/types/meeting";
import { mockMeetings } from "./mock-data";

export interface CreateMeetingInput {
  title: string;
  type: "instant" | "scheduled";
  scheduledFor?: string;
  provider?: "skymeet" | "google_meet";
}

export interface JoinMeetingInput {
  joinCode: string;
}

export async function getMeetings(): Promise<Meeting[]> {
  // API request will be implemented here.

  return Promise.resolve(mockMeetings);
}

export async function createMeeting( input: CreateMeetingInput ): Promise<Meeting> {
  // Backend implementation will eventually live here.

  const meeting: Meeting = {
    id: `mtg_${Date.now()}`,
    title: input.title,
    type: input.type,
    status: input.type === "instant" ? "active" : "scheduled",
    provider: input.provider ?? "skymeet",
    hostId: "user_001",
    participants: [],
    joinCode: `SKY-${Math.floor(
      1000 + Math.random() * 9000,
    )}`,
    scheduledFor: input.scheduledFor,
    startedAt: input.type === "instant" ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return Promise.resolve(meeting);
}

export async function joinMeeting( input: JoinMeetingInput ): Promise<Meeting> {
  const meeting = mockMeetings.find(
    (item) => item.joinCode === input.joinCode,
  );

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  return Promise.resolve(meeting);
}