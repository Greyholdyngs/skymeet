"use client";

import { useState } from "react";
import { useInfiniteQuery,  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";

import { queryKeys } from "@/app/lib/queries/query-key";
import type { AppNotification, NotificationResponse } from "../types";

type NotificationFilter = "all" | "unread";

export function useNotifications() {
    const queryClient = useQueryClient();

    const [filter, setFilter] = useState<NotificationFilter>("all");

    const notificationsQuery = useInfiniteQuery({
        queryKey: queryKeys.notifications.lists(),
        initialPageParam: 1,
        queryFn: ({ pageParam }) => apiFetch<NotificationResponse>( `/notifications?page=${pageParam}&limit=20`, ),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;

            return page < totalPages ? page + 1 : undefined;
        },
    });

    const unreadCountQuery = useQuery({
        queryKey: queryKeys.notifications.unreadCount(),
        queryFn: () => apiFetch<{ unreadCount: number }>( "/notifications/unread-count", ),
    });

    const invalidateNotifications = () => {
        void queryClient.invalidateQueries({
            queryKey: queryKeys.notifications.all,
        });
    };

    const markAsReadMutation = useMutation({
        mutationFn: (notificationId: string) =>
            apiFetch(
                `/notifications/${notificationId}/read`,
                { method: "PATCH" },
            ),
        onSuccess: invalidateNotifications,
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () =>
            apiFetch("/notifications/read-all", {
                method: "PATCH",
            }),
        onSuccess: invalidateNotifications,
    });

    const allNotifications: AppNotification[] =
        notificationsQuery.data?.pages.flatMap(
            (page) => page.notifications,
        ) ?? [];

    const notifications =
        filter === "unread" ? allNotifications.filter((notification) => !notification.isRead) : allNotifications;

    const unreadCount = unreadCountQuery.data?.unreadCount ?? 0;

    const loading = notificationsQuery.isPending;
    const loadingMore = notificationsQuery.isFetchingNextPage;

    const error = notificationsQuery.isError ? "Unable to load notifications. Please try again."
                                            : markAsReadMutation.isError ? "Unable to update notification."
                                            : markAllAsReadMutation.isError ? "Unable to mark notifications as read." : null;

    const loadMore = async () => {
        if ( notificationsQuery.hasNextPage && !notificationsQuery.isFetchingNextPage ) {
            await notificationsQuery.fetchNextPage();
        }
    };

    const markAsRead = (notificationId: string) => {
        markAsReadMutation.mutate(notificationId);
    };

    const markAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const refresh = () => {
        void notificationsQuery.refetch();
        void unreadCountQuery.refetch();
    };

    return {
        notifications,
        unreadCount,
        filter,
        setFilter,
        loading,
        loadingMore,
        error,
        hasMore: notificationsQuery.hasNextPage ?? false,
        loadMore,
        markAsRead,
        markAllAsRead,
        refresh,
    };
}
