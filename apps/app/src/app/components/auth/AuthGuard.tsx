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

    useEffect(() => {
        const verifySession = async () => {

        try {
            await apiFetch<CurrentUser>("/auth/me");

            setIsChecking(false);
        } catch {
            router.replace("/login");
        }
        };

        verifySession();
    }, [router]);

    if (isChecking) {
        return null;
    }

    return <>{children}</>;
};

export default AuthGuard;