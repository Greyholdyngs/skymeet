"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import NotificationsHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";
import { useNotifications } from "./hooks/useNotification";

import type { AppNotification } from "./types";
import ProjectInvitationModal from "../invitation/ProjectInvitationModal";

interface NotificationDrawerProps {
    onClose: () => void;
}

const NotificationDrawer = ({ onClose }: NotificationDrawerProps) => {
    const router = useRouter();

    const [selectedInvitationProjectId, setSelectedInvitationProjectId] = useState<string | null>(null);

    const { notifications, unreadCount, filter, setFilter, loading, loadingMore, error, hasMore, loadMore,
            markAsRead, markAllAsRead, refresh, } = useNotifications();

    const handleNotificationClick = (notification: AppNotification) => {
        if (!notification.isRead) {
            void markAsRead(notification._id);
        }

        if ( notification.type === "project_invitation" && notification.resourceId ) {
            setSelectedInvitationProjectId(notification.resourceId);
            return;
        }

        if ( notification.type.startsWith("meeting_") && notification.resourceId ) {
            onClose();
            router.push( `/dashboard/meetings?meetingId=${encodeURIComponent(notification.resourceId)}`,);
        }
    };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 h-screen">
            <button
                type="button"
                aria-label="Close notifications"
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="notification-drawer-title"
                className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l theme-border theme-surface shadow-2xl"
            >
                <div className="flex items-center justify-between border-b theme-border px-6 py-5">
                    <div>
                        <h2
                            id="notification-drawer-title"
                            className="text-lg font-semibold theme-text"
                        >
                            Notifications
                        </h2>
                        <p className="mt-1 text-xs theme-text-muted"> Your latest workspace updates </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close notifications"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg theme-text-muted transition hover:theme-surface-hover hover:theme-text"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="border-b theme-border px-6 py-5">
                    <NotificationsHeader
                        unreadCount={unreadCount}
                        filter={filter}
                        onFilterChange={setFilter}
                        onMarkAllAsRead={() => void markAllAsRead()}
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <NotificationList
                        notifications={notifications}
                        loading={loading}
                        loadingMore={loadingMore}
                        error={error}
                        hasMore={hasMore}
                        onMarkAsRead={(id) => void markAsRead(id)}
                        onLoadMore={() => void loadMore()}
                        onRetry={refresh}
                        onNotificationClick={handleNotificationClick}
                    />
                </div>
            </aside>
            {selectedInvitationProjectId && (
                <ProjectInvitationModal
                    projectId={selectedInvitationProjectId}
                    onClose={() => setSelectedInvitationProjectId(null)}
                    onAccepted={(projectId) => {
                        setSelectedInvitationProjectId(null);
                        onClose();
                        router.push(`/dashboard/projects/${projectId}`);
                    }}
                />
            )}
        </div>
    );
};

export default NotificationDrawer;
