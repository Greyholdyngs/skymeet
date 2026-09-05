"use client";

import { useState } from "react";
import { X, Link } from "lucide-react";

interface JoinMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onJoin?: (meetingCode: string) => void;
}

const JoinMeetingModal = ({ open, onClose, onJoin }: JoinMeetingModalProps) => {
    const [meetingCode, setMeetingCode] = useState("");

    if (!open) return null;

    const handleSubmit = ( event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const code = meetingCode.trim();

        if (!code) return;
        onJoin?.(code);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#16161F] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Join Meeting</h2>
                        <p className="mt-1 text-sm text-white/40">Enter the meeting code to join.</p>
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
                    className="space-y-5 p-6">
                <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">Meeting code</label>
                    <div className="relative">
                        <Link
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                        />
                        <input
                            type="text"
                            value={meetingCode}
                            onChange={(event) => setMeetingCode(event.target.value)}
                            placeholder="e.g. SKY-4821"
                            required
                            autoFocus
                            className="w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]/60"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/50 transition hover:bg-white/5 hover:text-white">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]">
                        Join Meeting
                    </button>
                </div>
                </form>
            </div>
        </div>
    )
}
    
export default JoinMeetingModal;