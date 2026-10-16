
"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, Send } from "lucide-react";
import type { Task } from "../types/types";

interface Comment {
    id: string;
    taskId: string;
    author: string;
    message: string;
    createdAt: string;
}

interface TaskCommentProps {
    task: Task;
}

const TaskComment = ({ task }: TaskCommentProps) => {
    const [commentsByTask, setCommentsByTask] = useState<Record<string, Comment[]>>({
        "1": [
            {
                id: "comment-1",
                taskId: "1",
                author: "Emmanuel Grey",
                message: "I've started mapping out the authentication flow. I'll share the implementation for review once the main states are covered.",
                createdAt: new Date( Date.now() - 1000 * 60 * 60 * 3 ).toISOString(),
            },
        ],
        "4": [
            {
                id: "comment-2",
                taskId: "4",
                author: "Jane Smith",
                message:"The implementation is ready for review. Please check the edge cases before approving.",
                createdAt: new Date(Date.now() - 1000 * 60 * 45,).toISOString(),
            },
        ],
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const comments = commentsByTask[task.id] ?? [];

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            setError("Write a comment before sending.");
            return;
        }

        const newComment: Comment = {
            id: crypto.randomUUID(),
            taskId: task.id,
            author: "Emmanuel Grey",
            message: trimmedMessage,
            createdAt: new Date().toISOString(),
        };

        setCommentsByTask((current) => ({
            ...current,
            [task.id]: [
                ...(current[task.id] ?? []),
                newComment,
            ],
        }));

        setMessage("");
        setError("");
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <MessageCircle
                    size={17}
                    className="text-white/40"
                />
                <h3 className="text-sm font-semibold text-white"> Comments</h3>
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/40"> {comments.length} </span>
            </div>
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <article
                            key={comment.id}
                            className="flex items-start gap-3"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/15 text-xs font-semibold text-[#B69AFF]"> {getInitials(comment.author)}</div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="text-sm font-medium text-white/80"> {comment.author} </span>
                                    <time
                                        dateTime={comment.createdAt}
                                        className="text-xs text-white/30"
                                    >
                                        {formatCommentTime(
                                            comment.createdAt,
                                        )}
                                    </time>
                                </div>
                                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-white/55"> {comment.message} </p>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center">
                        <p className="text-sm text-white/45"> No comments yet </p>
                        <p className="mt-1 text-xs text-white/30"> Start the conversation about this task. </p>
                    </div>
                )}
            </div>
            <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-white/10 bg-[#14141B] p-3"
            >
                <label
                    htmlFor={`task-comment-${task.id}`}
                    className="sr-only"
                >
                    Write a comment
                </label>
                <textarea
                    id={`task-comment-${task.id}`}
                    value={message}
                    onChange={(event) => {
                        setMessage(event.target.value);
                        if (error) setError("");
                    }}
                    placeholder="Write a comment..."
                    rows={3}
                    maxLength={5000}
                    className="w-full resize-y bg-transparent text-sm leading-6 text-white outline-none placeholder:text-white/25"
                />
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/5 pt-3">
                    <span
                        className={`text-xs ${ error ? "text-red-400" : "text-white/25" }`}
                        role={error ? "alert" : undefined}
                    >
                        {error || `${message.length}/5000`}
                    </span>
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Send
                        <Send size={14} />
                    </button>
                </div>
            </form>
        </section>
    );
};

function getInitials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function formatCommentTime(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown time";
    }

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export default TaskComment;
