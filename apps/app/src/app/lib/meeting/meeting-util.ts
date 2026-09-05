import type {Meeting} from "@/app/types/meeting";

export type MeetingFilter =
  | "all"
  | "active"
  | "scheduled"
  | "past";

export const filterMeetings = (meetings: Meeting[], filter: MeetingFilter): Meeting[] => {
  switch (filter) {
    case "active":
      return meetings.filter(
        (meeting) => meeting.status === "active",
      );
    case "scheduled":
      return meetings.filter(
        (meeting) => meeting.status === "scheduled",
      );
    case "past":
      return meetings.filter(
        (meeting) =>
          meeting.status === "ended" ||
          meeting.status === "cancelled",
      );
    case "all":
    default:
      return meetings;
  }
}

export type MeetingRole = | "host" | "participant";

export const getMeetingRole = ( meeting: Meeting, userId: string,): MeetingRole => {
  return meeting.hostId === userId
    ? "host"
    : "participant";
}

export type MeetingAction = | "start" | "continue" | "join" | "details";

export const getMeetingAction = ( meeting: Meeting, userId: string,): MeetingAction => {
  const isHost = meeting.hostId === userId;

  if (meeting.status === "ended") {
    return "details";
  }

  if (meeting.status === "cancelled") {
    return "details";
  }

  if (meeting.status === "active") {
    return isHost ? "continue" : "join";
  }

  if (meeting.status === "scheduled") {
    return isHost ? "start" : "join";
  }

  return "details";
}