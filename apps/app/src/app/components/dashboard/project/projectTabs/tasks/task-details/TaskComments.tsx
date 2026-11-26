
"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

import { createTaskComment, getTaskComments } from "./comments/comment.api";
import CommentThread from "./comments/CommentThread";
import CommentComposer from "./comments/CommentComposer";

import type { CommentDiscussionResponse, CreateCommentInput, TaskComment as TaskCommentType } from "./comments/comment.types";
import { queryKeys } from "@/app/lib/queries/query-key";
import type { Task } from "../types/types";

interface TaskCommentProps {
    task: Task;
    projectId: string;
}

interface CreateCommentVariables {
    input: CreateCommentInput;
    parentCommentId: string | null;
}

function countComments(comments: TaskCommentType[]): number {
    return comments.reduce( (total, comment) => total + 1 + countComments(comment.replies ?? []), 0 );
}

function addReplyToTree( comments: TaskCommentType[], parentId: string, reply: TaskCommentType ): TaskCommentType[] {
    return comments.map((comment) => {
        if (comment._id === parentId) {
            return {
                ...comment,
                replies: [...(comment.replies ?? []), reply],
            };
        }

        if (comment.replies?.length) {
            return {
                ...comment,
                replies: addReplyToTree(
                    comment.replies,
                    parentId,
                    reply,
                ),
            };
        }

        return comment;
    });
}

const TaskComments = ({ task, projectId }: TaskCommentProps) => {
    const queryClient = useQueryClient();

    const [replyingTo, setReplyingTo] = useState<TaskCommentType | null>(null);
    const queryKey = queryKeys.projects.taskComments(projectId, task.id);

    const commentsQuery = useQuery({
        queryKey,
        queryFn: () => getTaskComments(projectId, task.id),
        enabled: Boolean(projectId && task.id),
    });

    const createMutation = useMutation({
        mutationFn: ({ input }: CreateCommentVariables) => createTaskComment(projectId, input),
        onSuccess: (newComment, variables) => {
            queryClient.setQueryData<CommentDiscussionResponse>(
                queryKey,
                (current) => {
                    if (!current) return current;

                    const comment = {
                        ...newComment,
                        replies: newComment.replies ?? [],
                    };

                    return {
                        ...current,
                        data: variables.parentCommentId ? addReplyToTree(
                                  current.data,
                                  variables.parentCommentId,
                                  comment,
                              ) : [...current.data, comment],
                        pagination: {
                            ...current.pagination,
                            total: current.pagination.total + 1,
                        },
                    };
                },
            );
        },
    });

    const comments = commentsQuery.data?.data ?? [];
    const pagination = commentsQuery.data?.pagination ?? null;

    const handleSubmit = async (message: string) => {
        await createMutation.mutateAsync({
            input: {
                taskId: task.id,
                ciphertext: message,
                ...(replyingTo ? { parentCommentId: replyingTo._id } : {}),
            },
            parentCommentId: replyingTo?._id ?? null,
        });

        setReplyingTo(null);
    };

    const handleReply = (comment: TaskCommentType) => {
        setReplyingTo(comment);
    };

    const error = commentsQuery.error instanceof Error ? commentsQuery.error.message : "";

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <MessageCircle size={17} className="theme-text-muted" />
                <h3 className="text-sm font-semibold theme-text"> Comments </h3>
                <span className="rounded-md theme-surface-elevated px-2 py-0.5 text-xs theme-text-muted"> {countComments(comments)} </span>
            </div>
            {commentsQuery.isLoading ? (
                <p className="py-5 text-center text-sm theme-text-muted"> Loading comments... </p>
            ) : (
                <>
                    {error && (
                        <p className="text-xs text-red-400" role="alert"> {error} </p>
                    )}
                    {comments.length > 0 ? (
                        <CommentThread
                            comments={comments}
                            onReply={handleReply}
                        />
                    ) : (
                        <div className="rounded-xl border border-dashed theme-border px-4 py-6 text-center">
                            <p className="text-sm theme-text-secondary"> No comments yet </p>
                            <p className="mt-1 text-xs theme-text-muted"> Start the conversation about this task. </p>
                        </div>
                    )}
                    {pagination?.hasNextPage && (
                        <button
                            type="button"
                            onClick={() => void commentsQuery.refetch()}
                            className="text-xs text-[#B69AFF] hover:text-[var(--text-primary)]"
                        >
                            Refresh discussion
                        </button>
                    )}
                </>
            )}
            <CommentComposer
                onSubmit={handleSubmit}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
            />
        </section>
    );
};

export default TaskComments;



