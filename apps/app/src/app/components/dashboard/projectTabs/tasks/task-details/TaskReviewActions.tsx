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
        <section className="space-y-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10">
                    <MessageSquareWarning
                        size={17}
                        className="text-amber-300"
                    />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white"> Task awaiting review </h3>
                    <p className="mt-1 text-sm leading-5 text-white/50"> Review the submitted work before approving it or requesting changes. </p>
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
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10"
                    >
                        <RotateCcw size={15} /> Request changes
                    </button>
                </div>
            ) : (
                <form onSubmit={handleRequestChanges} className="space-y-3">
                    <div>
                        <label
                            htmlFor={`review-comment-${task.id}`}
                            className="mb-2 block text-sm font-medium text-white/75"
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
                            className="w-full resize-y rounded-lg border border-white/10 bg-[#14141B] p-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]/60"
                        />
                        <div className="mt-1 flex justify-between gap-3">
                            <p
                                role={error ? "alert" : undefined}
                                className={`text-xs ${error ? "text-red-400" : "text-white/30"}`}
                            >
                                {error || "A comment is required."}
                            </p>
                            <span className="text-xs text-white/25"> {comment.length}/3000 </span>
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
                            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:bg-white/5"
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