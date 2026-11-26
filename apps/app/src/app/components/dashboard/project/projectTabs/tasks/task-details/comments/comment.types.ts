export interface CommentAuthor {
    _id?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
}

export interface TaskComment {
    _id: string;
    projectId: string;
    taskId: string | null;
    parentCommentId: string | null;
    authorId: CommentAuthor | string;
    ciphertext: string;
    createdAt: string;
    updatedAt?: string;
    editedAt?: string | null;
    deletedAt?: string | null;
    replies: TaskComment[];
}

export interface CommentPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface CommentDiscussionResponse {
    data: TaskComment[];
    pagination: CommentPagination;
}

export interface CreateCommentInput {
    taskId: string;
    ciphertext: string;
    parentCommentId?: string;
}
