"use client";

import { useState, type FormEvent } from "react";
import { Send, X } from "lucide-react";
import type { TaskComment } from "./comment.types";

interface CommentComposerProps {
    onSubmit: (message: string) => Promise<void>;
    replyingTo?: TaskComment | null;
    onCancelReply?: () => void;
    placeholder?: string;
}

export default function CommentComposer({ onSubmit, replyingTo, onCancelReply, placeholder = "Write a comment..."}: CommentComposerProps) {
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedMessage = message.trim();

        if (!trimmedMessage || submitting) return;

        setSubmitting(true);
        setError("");

        try {
            await onSubmit(trimmedMessage);
            setMessage("");

        } catch (err) {
            setError( err instanceof Error ? err.message : "Unable to send message.", );

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl theme-border border theme-surface-elevated p-3"
        >
            {replyingTo && (
                <div className="mb-3 flex items-center justify-between gap-3 border-b theme-border-subtle pb-2">
                    <div className="min-w-0">
                        <p className="text-xs text-[#B69AFF]"> Replying to </p>
                        <p className="truncate text-xs theme-text-secondary"> {replyingTo.ciphertext} </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelReply}
                        className="shrink-0 rounded-md p-1 theme-text-muted transition theme-surface-hover hover:text-[var(--text-primary)]"
                        aria-label="Cancel reply"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}
            <textarea
                value={message}
                onChange={(event) => {
                    setMessage(event.target.value);
                    if (error) setError("");
                }}
                placeholder={placeholder}
                rows={3}
                maxLength={5000}
                disabled={submitting}
                className="w-full resize-y bg-transparent text-sm leading-6 theme-text outline-none placeholder:text-[var(--text-muted)] disabled:opacity-50"
            />
            <div className="mt-3 flex items-center justify-between gap-3 border-t theme-border-subtle pt-3">
                <span
                    className={`text-xs ${ error ? "text-red-400" : "theme-text-muted" }`}
                    role={error ? "alert" : undefined}
                >
                    {error || `${message.length}/5000`}
                </span>
                <button
                    type="submit"
                    disabled={!message.trim() || submitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {submitting ? "Sending..." : replyingTo ? "Reply" : "Send"}
                    <Send size={14} />
                </button>
            </div>
        </form>
    );
}
