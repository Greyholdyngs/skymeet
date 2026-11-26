
import type { AppNotification } from "./types";
import NotificationCard from "./NotificationCard";

interface NotificationListProps {
    notifications: AppNotification[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    onMarkAsRead: (notificationId: string) => void;
    onLoadMore: () => void;
    onRetry: () => void;
    onNotificationClick: (notification: AppNotification) => void;
}

const NotificationList = ({ notifications, loading, loadingMore, error, hasMore, onMarkAsRead, onLoadMore,
                            onRetry, onNotificationClick, }: NotificationListProps) => {

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="h-28 animate-pulse rounded-2xl border theme-border theme-surface-elevated"
                    />
                ))}
            </div>
        );
    }

    if (error && notifications.length === 0) {
        return (
            <div className="rounded-2xl border theme-border theme-surface px-6 py-12 text-center">
                <p className="text-sm theme-text-secondary">{error}</p>
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 text-sm font-medium text-[#A78BFA] transition hover:opacity-80"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="rounded-2xl border theme-border theme-surface px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#A78BFA]/10 text-xl text-[#A78BFA]"> ♧ </div>
                <h2 className="mt-4 font-medium theme-text"> You're all caught up </h2>
                <p className="mt-2 text-sm theme-text-muted"> New notifications will appear here. </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && ( <p className="text-sm text-red-500">{error}</p> )}
            {notifications.map((notification) => (
                <NotificationCard
                    key={notification._id}
                    notification={notification}
                    onClick={onNotificationClick}
                    onMarkAsRead={onMarkAsRead}
                />
            ))}
            {hasMore && (
                <div className="flex justify-center pt-4">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className="rounded-xl border theme-border px-5 py-2.5 text-sm theme-text-secondary transition hover:theme-surface-hover hover:theme-text disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loadingMore ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationList;
