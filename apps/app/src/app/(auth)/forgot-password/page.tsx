"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/ui/InputField";

import { apiFetch } from "@/app/lib/api";

const ForgotPasswordPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const trimmedEmail = email.trim().toLowerCase();

        if (!email.trim()) {
            setError("Please enter your email address.");
        return;
        }

        try {
            setLoading(true);

            await apiFetch<{ message: string }>("/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({
                email: trimmedEmail,
                }),
            });

            sessionStorage.setItem("skymeet_reset_email", trimmedEmail,);
            router.push("/verify?purpose=reset");

            } catch (error) {
                setError(error instanceof Error ? error.message : "Unable to process your request. Please try again.",);
                
            } finally {
                setLoading(false);
            }

            router.push("/verify?purpose=reset");
        };

    return (
        <section className="flex min-h-screen items-center justify-center bg-[#050711] px-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/3 p-8 backdrop-blur-xl">
                <h1 className="text-3xl font-bold text-white">Forgot password?</h1>
                <p className="mt-3 text-gray-400">Enter your email and we'll send you a verification code.</p>
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6"
                >
                    <InputField
                        label="Email"
                        type="email"
                        value={email}
                        placeholder="you@example.com"
                        error={error}
                        onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                        }}
                    />
                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-[#7C3AED] py-3 font-semibold text-white transition hover:bg-[#6D28D9]"
                    >
                        Send Verification Code
                    </button>
                </form>
            </div>
        </section>
    )
}

export default ForgotPasswordPage