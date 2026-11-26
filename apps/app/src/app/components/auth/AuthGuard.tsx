"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

interface AuthGuardProps {
    children: React.ReactNode;
}

interface CurrentUser {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
        try {
            await apiFetch<CurrentUser>("/auth/me");
            setIsChecking(false);

        } catch (error) {
            if ( error instanceof Error && (error.message.toLowerCase().includes("unauthorized") ||
                    error.message.toLowerCase().includes("forbidden") || error.message.toLowerCase().includes("expired") ||
                    error.message.toLowerCase().includes("invalid token")) ) {

                router.replace("/login");
                return;
            }

            setHasError(true);
            setIsChecking(false);
        }
        };

        void verifySession();
    }, [router]);

    if (isChecking) {
        return null;
    }

    if (hasError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0F0F14] px-6 text-center">
                <p className="text-white"> We couldn&apos;t verify your session. </p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-xl bg-[#7C3AED] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
                >
                    Try again
                </button>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
