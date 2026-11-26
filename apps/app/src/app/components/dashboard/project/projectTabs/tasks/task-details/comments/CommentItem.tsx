"use client";

import { Reply } from "lucide-react";
import type { TaskComment } from "./comment.types";

interface CommentItemProps {
    comment: TaskComment;
    onReply: (comment: TaskComment) => void;
}

export default function CommentItem({ comment, onReply }: CommentItemProps) {
    const author = typeof comment.authorId === "object" ? comment.authorId : null;
    const authorName = author ? `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() || author.userName || "Unknown user" : "Unknown user";

    return (
        <article className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/15 text-xs font-semibold text-[#B69AFF]"> {getInitials(authorName)} </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-medium theme-text"> {authorName} </span>
                    <time
                        dateTime={comment.createdAt}
                        className="text-xs theme-text-muted"
                    >
                        {formatCommentTime(comment.createdAt)}
                    </time>
                </div>
                <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 theme-text-secondary"> {comment.deletedAt ? "This comment was deleted." : comment.ciphertext} </p>
                {!comment.deletedAt && (
                    <button
                        type="button"
                        onClick={() => onReply(comment)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs theme-text-muted transition hover:text-[#B69AFF]"
                    >
                        <Reply size={13} />
                        Reply
                    </button>
                )}
            </div>
        </article>
    );
}

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
