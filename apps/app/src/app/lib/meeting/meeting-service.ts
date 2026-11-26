import type { Meeting } from "@/app/types/meeting";
import { apiFetch } from "@/app/lib/api";

interface BackendUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
}

interface BackendAttendee {
  userId: string | BackendUser;
  response: "pending" | "accepted" | "declined";
}

interface BackendMeeting {
  _id: string;
  title: string;
  scope: "general" | "project";
  projectId?: string | null;
  description?: string;
  organizerId: string | BackendUser;
  attendees: BackendAttendee[];
  startAt: string;
  endAt: string;
  meetingLink?: string | null;
  status: "scheduled" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

function getUserId(user: string | BackendUser): string {
  return typeof user === "string" ? user : user._id;
}

function mapMeeting(data: BackendMeeting): Meeting {
  const startAt = new Date(data.startAt);
  const endAt = new Date(data.endAt);

  return {
    id: data._id,
    title: data.title,
    scope: data.scope,
    projectId: data.projectId || undefined,
    status: data.status === "completed" ? "ended" : data.status,
    hostId: getUserId(data.organizerId),
    participants: data.attendees.map(({ userId, response }) => {
    if (typeof userId === "string") {
      return {
        id: userId,
        name: "SkyMeet member",
        response,
      };
    }

    return {
      id: userId._id,
      description: data.description,
      name: [userId.firstName, userId.lastName].filter(Boolean).join(" ") || userId.userName || "SkyMeet member",response
    };
  }),
    scheduledFor: data.startAt,
    duration: Math.max(
      0,
      Math.round((endAt.getTime() - startAt.getTime()) / 60000),
    ),
    meetingLink: data.meetingLink || undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function getMeetings(): Promise<Meeting[]> {
  const data = await apiFetch<BackendMeeting[]>("/meetings");
  return data.map(mapMeeting);
}

export async function createMeeting(input: { scope: "general" | "project"; projectId?: string; title: string;
        description?: string; startAt: string; endAt: string; meetingLink?: string; attendeeIds?: string[];}): Promise<Meeting> {

  const data = await apiFetch<BackendMeeting>("/meetings", {
    method: "POST",
    body: JSON.stringify({
      scope: input.scope,
      ...(input.scope === "project" ? { projectId: input.projectId } : {}),
      title: input.title,
      description: input.description,
      startAt: input.startAt,
      endAt: input.endAt,
      meetingLink: input.meetingLink,
      attendeeIds: input.attendeeIds ?? [],
    }),
  });

  return mapMeeting(data);
}

export async function getMeeting(meetingId: string): Promise<Meeting> {
  const data = await apiFetch<BackendMeeting>(`/meetings/${meetingId}`);
  return mapMeeting(data);
}

export async function updateMeeting( meetingId: string, input: { title?: string; description?: string; startAt?: string;
                              endAt?: string; meetingLink?: string | null; attendeeIds?: string[]; },): Promise<Meeting> {

  const data = await apiFetch<BackendMeeting>(`/meetings/${meetingId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return mapMeeting(data);
}

export async function respondToMeeting( meetingId: string,  response: "accepted" | "declined"): Promise<void> {

  await apiFetch(`/meetings/${meetingId}/respond`, {
    method: "PATCH",
    body: JSON.stringify({ response }),
  });
}

export async function cancelMeeting(meetingId: string): Promise<void> {

  await apiFetch(`/meetings/${meetingId}`, {
    method: "DELETE",
  });
}

export async function getProjectMeetings(projectId: string ): Promise<Meeting[]> {
    const data = await apiFetch<BackendMeeting[]>(
        `/projects/${projectId}/meetings`,
    );

    return data.map(mapMeeting);
}

