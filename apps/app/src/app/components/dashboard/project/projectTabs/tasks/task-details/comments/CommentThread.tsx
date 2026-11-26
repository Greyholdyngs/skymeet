"use client";

import CommentItem from "./CommentItem";
import type { TaskComment } from "./comment.types";

interface CommentThreadProps {
    comments: TaskComment[];
    onReply: (comment: TaskComment) => void;
    depth?: number;
}

export default function CommentThread({ comments, onReply, depth = 0 }: CommentThreadProps) {
    if (!comments.length) return null;

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment._id} className="space-y-3">
                    <div
                        className="border-l-2 border-transparent"
                        style={{
                            marginLeft: depth > 0 ? `${Math.min(depth, 5) * 16}px` : 0,
                        }}
                    >
                        <CommentItem
                            comment={comment}
                            onReply={onReply}
                        />
                    </div>

                    {comment.replies?.length > 0 && (
                        <div
                            className="border-l rounded-b-2xl theme-border pl-4"
                            style={{ marginLeft: depth > 0 ? `${Math.min(depth, 5) * 16}px` : 20, }}
                        >
                            <CommentThread
                                comments={comment.replies}
                                onReply={onReply}
                                depth={depth + 1}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
