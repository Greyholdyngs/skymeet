"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import OTPInput from "@/app/components/ui/OTPInput";
import { apiFetch } from "@/app/lib/api";

const VerifyPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const purpose = searchParams.get("purpose");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [resendCooldown, setResendCooldown] = useState(0);

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [resendError, setResendError] = useState(false);

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

        if (code.length !== 6) {
            setError(true);
            return;
        }

        if (purpose === "signup") { 
            const email = sessionStorage.getItem("skymeet_signup_email"); 
            if (!email) { 
                setError(true); 
                return; 
            } try { 
                setLoading(true) 
                await apiFetch<{ message: string }>("/auth/verify-otp", { 
                    method: "POST", 
                    body: JSON.stringify({ email, otp: code, }), }); 
                    setSuccess(true); 
                    sessionStorage.removeItem("skymeet_signup_email"); 
                    setTimeout(() => { router.replace("/login"); }, 1000); 
                } catch (error) { 
                    setError(true); 
                    console.error(error); } 
                    finally { setLoading(false); } 
                    return; 
        }

        if (purpose === "reset") { 
            const email = sessionStorage.getItem("skymeet_reset_email"); 
            if (!email) { 
                setError(true); 
                return; 
            } 
            
            sessionStorage.setItem("skymeet_reset_email", email); 
            sessionStorage.setItem("skymeet_reset_otp", code); 
            
            setSuccess(true); 
            setTimeout(() => { 
                router.replace("/reset-password"); }, 1000); 
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
        } catch (error) {
            setResendError(true);

            setResendMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to resend the code. Please try again.",
            );
        } finally {
            setResendLoading(false);
        }
    };
    
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
                    <p className="mt-5 text-center text-sm text-green-400">Verification code accepted.</p>
                )}
                <div className="mt-5 text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendLoading || resendCooldown > 0 || success}
                        className="text-sm font-medium cursor-pointer text-[#A78BFA] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {resendLoading
                            ? "Sending..."
                            : resendCooldown > 0
                            ? <small className="text-[#A78BFA] transition hover:text-white">Resend code in {resendCooldown}s</small>
                            : <small className="text-white/15">Didn't receive the code? Resend</small>}
                    </button>
                    {resendMessage && (
                        <p
                            className={`mt-2 text-sm ${
                                resendError ? "text-red-400" : "text-green-400"
                            }`}
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
                    {loading ? "Verifying..." : success ? "Code Accepted" : purpose === "reset" ? "Verify Code" : "Verify Email"}
                </button>
            </div>
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#7C3AED]/10 blur-3xl" />
        </section>
    )
    }

export default VerifyPage