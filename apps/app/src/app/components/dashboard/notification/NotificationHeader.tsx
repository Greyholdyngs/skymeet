"use client";

type NotificationFilter = "all" | "unread";

interface NotificationsHeaderProps {
    unreadCount: number;
    filter: NotificationFilter;
    onFilterChange: (filter: NotificationFilter) => void;
    onMarkAllAsRead: () => void;
}

const NotificationsHeader = ({ unreadCount, filter, onFilterChange, onMarkAllAsRead }: NotificationsHeaderProps) => {
    return (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="mt-3 text-sm theme-text-secondary"> {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"} </p>
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex rounded-xl border theme-border theme-surface-elevated p-1">
                    {(["all", "unread"] as const).map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onFilterChange(option)}
                            className={`rounded-lg px-4 py-2 text-sm capitalize transition ${
                                filter === option ? "bg-[#A78BFA]/15 text-[#A78BFA]" : "theme-text-muted hover:theme-text"}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={onMarkAllAsRead}
                        className="text-sm font-medium text-[#A78BFA] transition hover:opacity-80"
                    >
                        Mark all as read
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationsHeader;
