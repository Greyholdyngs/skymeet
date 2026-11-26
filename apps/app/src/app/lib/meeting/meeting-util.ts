import type { Meeting } from "@/app/types/meeting";

export type MeetingFilter = "all" | "scheduled" | "past";

export const filterMeetings = (meetings: Meeting[], filter: MeetingFilter ): Meeting[] => {
  switch (filter) {
    case "scheduled":
      return meetings.filter(
        (meeting) => meeting.status === "scheduled",
      );

    case "past":
      return meetings.filter(
        (meeting) => meeting.status === "ended" || meeting.status === "cancelled",
      );

    case "all":
    default:
      return meetings;
  }
};

export type MeetingRole = "host" | "participant";

export const getMeetingRole = ( meeting: Meeting, userId: string): MeetingRole => {
  return meeting.hostId === userId ? "host" : "participant";
};

export type MeetingAction = "details" | "join";

export const getMeetingAction = ( meeting: Meeting, userId: string): MeetingAction => {
  const isHost = meeting.hostId === userId;

  const currentAttendee = meeting.participants.find((participant) => participant.id === userId);
  const hasAccepted = currentAttendee?.response === "accepted";
  const startTime = new Date(meeting.scheduledFor).getTime();

  const endTime = startTime + meeting.duration * 60 * 1000;
  const now = Date.now();
  const isMeetingActive = now >= startTime && now < endTime;

  if ( meeting.status === "scheduled" && meeting.meetingLink && isMeetingActive && (isHost || hasAccepted) ) {
    return "join";
  }

  return "details";
};