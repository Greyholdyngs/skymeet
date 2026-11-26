import { apiFetch } from "@/app/lib/api";
import type { CommentDiscussionResponse, CreateCommentInput, TaskComment} from "./comment.types";

export async function getTaskComments( projectId: string, taskId: string ): Promise<CommentDiscussionResponse> {
    return apiFetch<CommentDiscussionResponse>(
        `/projects/${projectId}/comments?taskId=${encodeURIComponent(taskId)}&limit=50`,
    );
}

export async function createTaskComment( projectId: string, input: CreateCommentInput,): Promise<TaskComment> {
    return apiFetch<TaskComment>(
        `/projects/${projectId}/comments`,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
}
