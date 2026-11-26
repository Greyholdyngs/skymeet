"use client";

import { Calendar, Clock, Link } from "lucide-react";

interface MeetingDetailsFieldsProps {
  title: string;
  date: string;
  time: string;
  meetingLink: string;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onMeetingLinkChange: (value: string) => void;
}

const inputStyles =
  "w-full rounded-xl border theme-border theme-surface-elevated py-3 text-sm theme-text outline-none transition focus:border-[#7C3AED]/60";

const labelStyles = "mb-2 block text-sm font-medium theme-text-secondary";

const iconStyles =
  "absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted";

const MeetingDetailsFields = ({
  title,
  date,
  time,
  meetingLink,
  onTitleChange,
  onDateChange,
  onTimeChange,
  onMeetingLinkChange,
}: MeetingDetailsFieldsProps) => {
    return (
        <>
            <div>
                <label className={labelStyles}>Meeting title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    placeholder="e.g. Product Design Review"
                    required
                    className={`${inputStyles} px-4 placeholder:opacity-60`}
                />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className={labelStyles}>Date</label>
                    <div className="relative">
                        <Calendar size={17} className={iconStyles} />
                        <input
                            type="date"
                            value={date}
                            onChange={(event) => onDateChange(event.target.value)}
                            required
                            className={`${inputStyles} pl-10 pr-4`}
                        />
                    </div>
                </div>
                <div>
                    <label className={labelStyles}>Time</label>
                    <div className="relative">
                        <Clock size={17} className={iconStyles} />
                        <input
                            type="time"
                            value={time}
                            onChange={(event) => onTimeChange(event.target.value)}
                            required
                            className={`${inputStyles} pl-10 pr-4`}
                        />
                    </div>
                </div>
            </div>
                <div>
                    <label className={labelStyles}>Meeting link</label>
                    <div className="relative">
                        <Link size={17} className={iconStyles} />
                        <input
                            type="url"
                            value={meetingLink}
                            onChange={(event) => onMeetingLinkChange(event.target.value)}
                            placeholder="https://meet.google.com/..."
                            required
                            className={`${inputStyles} pl-10 pr-4 placeholder:opacity-60`}
                        />
                    </div>
                    <p className="mt-2 text-xs theme-text-muted"> Paste the meeting link attendees will use to join </p>
                </div>
        </>
    );
};

export default MeetingDetailsFields;

