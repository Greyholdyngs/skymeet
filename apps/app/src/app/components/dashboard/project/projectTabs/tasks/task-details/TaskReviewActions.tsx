"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2,  MessageSquareWarning, RotateCcw } from "lucide-react";
import type { Task } from "../types/types";

interface TaskReviewActionProps {
    task: Task;
    onApprove?: (taskId: string) => void;
    onRequestChanges?: (taskId: string, comment: string) => void;
}

const TaskReviewAction = ({ task, onApprove, onRequestChanges }: TaskReviewActionProps) => {

    const [showChangesForm, setShowChangesForm] = useState(false);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    if (task.status !== "task_review") {
        return null;
    }

    const handleRequestChanges = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedComment = comment.trim();

        if (!trimmedComment) {
            setError("Explain what needs to be changed.");
            return;
        }

        onRequestChanges?.(task.id, trimmedComment);

        setComment("");
        setError("");
        setShowChangesForm(false);
    };

    return (
        <section className="space-y-4 rounded-xl border border-amber-400/15 bg-amber-400/4 p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10">
                    <MessageSquareWarning
                        size={17}
                        className="text-amber-300"
                    />
                </div>
                <div>
                    <h3 className="text-sm font-semibold theme-text"> Task awaiting review </h3>
                    <p className="mt-1 text-sm leading-5 theme-text-secondary"> Review the submitted work before approving it or requesting changes. </p>
                </div>
            </div>
            {!showChangesForm ? (
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => onApprove?.(task.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
                    >
                        <CheckCircle2 size={15} /> Approve task
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowChangesForm(true)}
                        className="inline-flex items-center gap-2 rounded-lg theme-border border theme-surface-elevated px-3 py-2 text-sm font-medium theme-text transition theme-surface-hover"
                    >
                        <RotateCcw size={15} /> Request changes
                    </button>
                </div>
            ) : (
                <form onSubmit={handleRequestChanges} className="space-y-3">
                    <div>
                        <label
                            htmlFor={`review-comment-${task.id}`}
                            className="mb-2 block text-sm font-medium theme-text"
                        >
                            What needs to change?
                        </label>
                        <textarea
                            id={`review-comment-${task.id}`}
                            value={comment}
                            onChange={(event) => {
                                setComment(event.target.value);
                                if (error) setError("");
                            }}
                            rows={3}
                            maxLength={3000}
                            placeholder="Describe the changes required..."
                            className="w-full resize-y rounded-lg border theme-border theme-surface-elevated p-3 text-sm leading-6 theme-text outline-none placeholder:text-(--text-muted) focus:border-[#7C3AED]/60"
                        />
                        <div className="mt-1 flex justify-between gap-3">
                            <p
                                role={error ? "alert" : undefined}
                                className={`text-xs ${error ? "text-red-400" : "theme-text-muted"}`}
                            >
                                {error || "A comment is required."}
                            </p>
                            <span className="text-xs theme-text-muted"> {comment.length}/3000 </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="submit"
                            disabled={!comment.trim()}
                            className="rounded-lg bg-[#7C3AED] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#6D28D9] 
                                        disabled:cursor-not-allowed disabled:opacity-40"
                        >
                             Submit feedback
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowChangesForm(false);
                                setComment("");
                                setError("");
                            }}
                            className="rounded-lg border theme-border px-3 py-2 text-sm theme-text-secondary transition theme-surface-hover"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default TaskReviewAction;