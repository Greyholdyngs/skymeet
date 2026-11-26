"use client";

import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/app/lib/api";
import { queryKeys } from "@/app/lib/queries/query-key";

import MobileDrawer from "./MobileDrawer";
import Image from "next/image";
import Link from "next/link";

import NotificationDrawer from "./notification/NotificationDrawer";

interface CurrentUser {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
}

const TopBar = () => {
    const router = useRouter();
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const [showProfile, setShowProfile] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const currentUserQuery = useQuery({
        queryKey: queryKeys.users.currentUser(),
        queryFn: () => apiFetch<CurrentUser>("/auth/me"),
    });

    const user = currentUserQuery.data ?? null;

    useEffect(() => {
        if ( currentUserQuery.error instanceof ApiError && currentUserQuery.error.status === 401 ) {
            router.replace("/login");
        }
    }, [currentUserQuery.error, router]);

    useEffect(() => {
        if (!showProfile) return;

        const handlePointerDown = (event: PointerEvent) => {
            if ( profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node) ) {
                setShowProfile(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [showProfile]);

    const logoutMutation = useMutation({
        mutationFn: () =>
            apiFetch<{ message: string }>("/auth/logout", {
                method: "POST",
            }),
        onSuccess: () => {
            router.replace("/login");
        },
    });

    const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "Loading...";
    const initial = user?.firstName?.charAt(0).toUpperCase() || "?";

    return (
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b theme-border bg-(--app-bg)/90 px-4 backdrop-blur-xl sm:px-6 md:px-10">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    aria-label="Open navigation menu"
                    aria-expanded={showMobileMenu}
                    onClick={() => setShowMobileMenu(true)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border theme-border theme-text-secondary transition hover:bg-black/5 hover:theme-text lg:hidden"
                >
                    <Menu size={20} />
                </button>
                <Link href="/dashboard" className="shrink-0 lg:hidden">
                    <Image
                        src="/icons/logo.png"
                        alt="SkyMeet"
                        width={110}
                        height={32}
                        priority
                    />
                </Link>
                <div className="hidden min-w-0 lg:block">
                    <h1 className="text-xl font-bold theme-text">Dashboard</h1>
                    <p className="mt-1 text-sm theme-text-secondary"> Overview of your workspace </p>
                </div>
            </div>
            <section className="relative flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-3 rounded-xl border theme-border theme-surface px-4 py-2 md:flex">
                    <Search size={20} className="theme-text-muted" />
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        aria-label="Search workspace"
                        className="w-48 bg-transparent text-sm theme-text outline-none placeholder:theme-text-muted"
                    />
                </div>
                <div className="relative">
                    <button
                        type="button"
                        aria-label="Notifications"
                        aria-expanded={showNotification}
                        onClick={() => setShowNotification((prev) => !prev)}
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border theme-border theme-surface theme-text-secondary transition hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]"
                    >
                        <Bell size={20} />
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#7C3AED]" />
                    </button>
                    {showNotification && (
                        <NotificationDrawer
                            onClose={() => setShowNotification(false)}
                        />
                    )}
                </div>
                <div className="relative" ref={profileMenuRef}>
                    <button
                        type="button"
                        aria-expanded={showProfile}
                        aria-label="Open profile menu"
                        onClick={() => setShowProfile((prev) => !prev)}
                        className="flex items-center gap-2 rounded-xl px-1 py-2 transition hover:bg-black/5 sm:gap-3 sm:px-2"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7C3AED] to-[#A78BFA] font-bold text-white"> {initial} </div>
                        <div className="hidden max-w-32 text-left lg:block">
                            <p className="truncate text-sm font-semibold theme-text"> {displayName} </p>
                            <p className="text-xs theme-text-secondary"> Workspace owner </p>
                        </div>
                        <ChevronDown
                            size={16}
                            className="hidden theme-text-muted lg:block"
                        />
                    </button>
                    {showProfile && (
                        <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border theme-border theme-surface p-2 shadow-2xl">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowProfile(false);
                                    router.push("/dashboard/profile");
                                }}
                                className="w-full rounded-xl px-4 py-3 text-left text-sm theme-text-secondary transition hover:bg-black/5 hover:theme-text"
                            >
                                Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowProfile(false);
                                    router.push("/dashboard/settings");
                                }}
                                className="w-full rounded-xl px-4 py-3 text-left text-sm theme-text-secondary transition hover:bg-black/5 hover:theme-text"
                            >
                                Settings
                            </button>
                            <div className="my-2 border-t theme-border" />
                            <button
                                type="button"
                                disabled={logoutMutation.isPending}
                                onClick={() => logoutMutation.mutate()}
                                className="w-full rounded-xl px-4 py-3 text-left text-sm text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {logoutMutation.isPending ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    )}
                </div>
            </section>
            <MobileDrawer
                isOpen={showMobileMenu}
                onClose={() => setShowMobileMenu(false)}
            />
        </header>
    );
};

export default TopBar;


