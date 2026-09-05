"use client";
import { useState } from "react";
import { X, Calendar, Clock, Users } from "lucide-react";

interface ScheduleMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule?: (data: ScheduleMeetingData) => void;
}

export interface ScheduleMeetingData {
  title: string;
  date: string;
  time: string;
  participants: string[];
}

const ScheduleMeetingModal = ({ open, onClose, onSchedule }: ScheduleMeetingModalProps) => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");

    const [time, setTime] = useState("");
    const [participants, setParticipants] = useState("");

    if (!open) return null;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data: ScheduleMeetingData = {
            title,
            date,
            time,
            participants: participants
                .split(",")
                .map((email) => email.trim())
                .filter(Boolean),
        };

        onSchedule?.(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#16161F] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Schedule Meeting</h2>
                        <p className="mt-1 text-sm text-white/40">Choose when you want your meeting to start.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/5 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/70">Meeting title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="e.g. Product Design Review"
                            required
                            className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#7C3AED]/60"
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white/70">Date</label>
                            <div className="relative">
                                <Calendar
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                                />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(event) =>
                                        setDate(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-[#7C3AED]/60"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white/70">Time</label>
                            <div className="relative">
                                <Clock
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                                />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(event) =>
                                        setTime(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-[#7C3AED]/60"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/70">Invite people</label>
                        <div className="relative">
                            <Users
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                            />
                            <input
                                type="text"
                                value={participants}
                                onChange={(event) =>
                                setParticipants(event.target.value)
                                }
                                placeholder="Enter emails separated by commas"
                                className="w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]/60"
                            />
                        </div>
                        <p className="mt-2 text-xs text-white/30">You can also invite people after scheduling.</p>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
                        >
                        Schedule Meeting
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ScheduleMeetingModal;