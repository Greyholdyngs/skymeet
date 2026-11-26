export type CalendarEventType = "task" | "meeting";

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: CalendarEventType;
    time?: string;
}