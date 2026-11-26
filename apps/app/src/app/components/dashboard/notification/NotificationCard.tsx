import type { AppNotification } from "./types";

interface NotificationCardProps {
    notification: AppNotification;
    onClick: (notification: AppNotification) => void;
    onMarkAsRead: (notificationId: string) => void;
}

const NotificationCard = ({ notification, onClick, onMarkAsRead }: NotificationCardProps) => {
    const actorName = notification.actorId ? `${notification.actorId.firstName} ${notification.actorId.lastName}`.trim() : "SkyMeet";

    const timeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

        return new Date(date).toLocaleDateString();
    };

    return (
        <article
            className={`flex gap-4 rounded-2xl border p-2.5 transition ${
                notification.isRead ? "theme-border theme-surface" : "border-[#A78BFA]/30 bg-[#A78BFA]/6" }`}
        >
            <button
                type="button"
                onClick={() => onClick(notification)}
                className="flex min-w-0 flex-1 gap-4 text-left"
            >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A78BFA]/15 text-sm font-semibold text-[#A78BFA]"> {actorName.charAt(0).toUpperCase()} </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium theme-text"> {notification.title} </p>
                        <span className="text-xs theme-text-muted"> {timeAgo(notification.createdAt)} </span>
                    </div>
                    <p className="text-sm leading-relaxed theme-text-secondary"> {notification.message} </p>
                    <span className="mt-1 block text-xs theme-text-muted"> {actorName} </span>
                </div>
            </button>
            {!notification.isRead && (
                <div className="flex shrink-0 items-start gap-3">
                    <button
                        type="button"
                        onClick={() => onMarkAsRead(notification._id)}
                        className="text-xs font-medium text-[#A78BFA] transition hover:opacity-80"
                    >
                        Mark as read
                    </button>
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#A78BFA]" />
                </div>
            )}
        </article>
    );
};

export default NotificationCard;

