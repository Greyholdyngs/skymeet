"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import OTPInput from "@/app/components/ui/OTPInput";

const VerifyPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const purpose = searchParams.get("purpose");
    const [otp, setOtp] = useState(Array(6).fill(""));

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleVerify = () => {
        const code = otp.join("");
        setError(false);

        if (code.length !== 6) {
            setError(true);
            return;
        }
        setLoading(true);

        // Temporary frontend test
        const isValidOTP = code === "123456";

        if (!isValidOTP) {
            setError(true);
            return;
        }

        setSuccess(true);

        setTimeout(() => {
        if (purpose === "reset") {
            router.replace("/reset-password");
            return;
        }

        if (purpose === "signup") {
            router.replace("/login");
            return;
        }

        router.replace("/login");
        }, 1000);
    }
    
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050711] px-4">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#7C3AED]/10 blur-3xl" />
            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-2xl sm:p-8">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
                        Verification
                    </p>
                    <h1 className="mt-4 text-3xl font-bold text-white">
                        Verify your email
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-gray-400">
                        Enter the 6-digit verification code sent to your email.
                    </p>
                </div>
                <div className="mt-10">
                    <OTPInput
                        value={otp}
                        onChange={(value) => {
                        setOtp(value);
                        setError(false);
                        }}
                        error={error}
                        success={success}
                    />
                </div>
                {error && (
                    <p className="mt-5 text-center text-sm text-red-400">
                        That verification code is incorrect.
                    </p>
                )}
                {success && (
                    <p className="mt-5 text-center text-sm text-green-400">
                        Email verified successfully.
                    </p>
                )}
                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={loading || success}
                    className="mt-10 w-full rounded-2xl bg-[#7C3AED] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#6D28D9] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    {loading
                        ? "Verifying..."
                        : success
                        ? "Verified"
                        : "Verify Email"}
                </button>
            </div>
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#7C3AED]/10 blur-3xl" />
        </section>
    )
    }

export default VerifyPage