"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "@/app/components/ui/OTPInput";

import { apiFetch } from "@/app/lib/api";

const VerifyPageClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const purpose = searchParams.get("purpose");

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [resendCooldown, setResendCooldown] = useState(0);
    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [resendError, setResendError] = useState(false);

    useEffect(() => {
        const storageKey = purpose === "signup" ? "skymeet_signup_otp_sent_at" : purpose === "reset"
                                                ? "skymeet_reset_otp_sent_at" : null;

        if (!storageKey) return;

        const sentAt = Number(sessionStorage.getItem(storageKey));

        if (!sentAt || Number.isNaN(sentAt)) return;

        const elapsedSeconds = Math.floor((Date.now() - sentAt) / 1000);
        const remainingSeconds = Math.max(0, 30 - elapsedSeconds);

        setResendCooldown(remainingSeconds);
    }, [purpose]);

    useEffect(() => {
        if (resendCooldown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendCooldown((current) => current - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleVerify =  async() => {
        const code = otp.join("");
        setError(false);
        setErrorMessage("");

        if (code.length !== 6) {
            setError(true);
            setErrorMessage("Please enter all 6 digits.");
            return;
        }

        if (purpose === "signup") {
            const email = sessionStorage.getItem("skymeet_signup_email");
            if (!email) {
                setError(true);
                setErrorMessage("Your signup session has expired. Please sign up again.");
                return;
            }
            try {
                setLoading(true)
                await apiFetch<{ message: string }>("/auth/verify-otp", {
                    method: "POST",
                    body: JSON.stringify({ email, otp: code, }), });

                    setSuccess(true);

                    sessionStorage.removeItem("skymeet_signup_email");
                    sessionStorage.removeItem("skymeet_signup_otp_sent_at")
                    setTimeout(() => { router.replace("/login"); }, 1000);

                } catch (err) {
                    setError(true);
                    setErrorMessage( err instanceof Error ? err.message : "Unable to verify your email. Please try again." );

                } finally {
                    setLoading(false);
                }
            return;
        }

        if (purpose === "reset") {
            const email = sessionStorage.getItem("skymeet_reset_email");
            if (!email) {
                setError(true);
                setErrorMessage("Your password reset session has expired. Please request a new code.");
                return;
            }

            sessionStorage.setItem("skymeet_reset_email", email);
            sessionStorage.setItem("skymeet_reset_otp", code);

            setSuccess(true);
            setTimeout(() => {
                router.replace("/reset-password");
            }, 1000);

            return;
        }

        setError(true);
    }

    const handleResend = async () => {
        const email = purpose === "signup" ? sessionStorage.getItem("skymeet_signup_email") : sessionStorage.getItem("skymeet_reset_email");

        if (!email || resendCooldown > 0) {
            return;
        } try {
            setResendLoading(true);
            setResendMessage("");
            setResendError(false);

            await apiFetch<{ message: string }>("/auth/resend-otp", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    purpose: purpose === "reset" ? "password_reset" : "email_verification",
                }),
            });

            setResendMessage("A new verification code has been sent.");
            setResendCooldown(30);

            setOtp(Array(6).fill(""));
            setError(false);
            setErrorMessage("");

            if (purpose === "reset") {
                sessionStorage.removeItem("skymeet_reset_otp");
            }

            const storageKey = purpose === "signup" ? "skymeet_signup_otp_sent_at" : "skymeet_reset_otp_sent_at";
            sessionStorage.setItem(storageKey, Date.now().toString());

        } catch (error) {
            setResendError(true);
            setResendMessage( error instanceof Error ? error.message : "Unable to resend the code. Please try again." );

        } finally {
            setResendLoading(false);
        }
    };

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-auto bg-[#050711] px-4 py-6 max-[320px]:px-2">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#7C3AED]/10 blur-3xl" />
            <div className="relative w-full min-w-0 max-w-md rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-2xl sm:p-8 max-[320px]:rounded-2xl max-[320px]:p-3">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
                        Verification
                    </p>
                    <h1 className="mt-4 text-3xl font-bold text-white">
                        {purpose === "reset" ? "Reset password" : "Verify your email"}
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
                    <p role="alert" className="mt-5 text-center text-sm text-red-400">
                        {errorMessage || "Unable to verify your code. Please try again."}
                    </p>
                )}

                {success && (
                    <p role="status" className="mt-5 text-center text-sm text-green-400">
                        {purpose === "reset" ? "Code entered. Continue to set your new password." : "Your email has been verified successfully."}
                    </p>
                )}
                <div className="mt-5 text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendLoading || resendCooldown > 0 || success}
                        className="text-sm font-medium cursor-pointer text-[#A78BFA] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {resendLoading ? "Sending..." : resendCooldown > 0 ? <small className="text-[#A78BFA] transition hover:text-white">Resend code in {resendCooldown}s</small>
                                                                            : <small className="text-white/15">"Didn&apos;t receive the code? Resend"</small>}
                    </button>
                    {resendMessage && (
                        <p
                            className={`mt-2 text-sm ${ resendError ? "text-red-400" : "text-green-400" }`}
                        >
                            {resendMessage}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={loading || success}
                    className="mt-10 w-full rounded-2xl bg-[#7C3AED] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#6D28D9] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? "Verifying..." : success ? "Continue" : purpose === "reset" ? "Continue" : "Verify Email"}
                </button>
            </div>
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#7C3AED]/10 blur-3xl" />
        </section>
    )
}
export default VerifyPageClient