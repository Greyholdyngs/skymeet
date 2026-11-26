"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/ui/InputField";

import { apiFetch } from "@/app/lib/api";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;
    setError("");
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await apiFetch<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: trimmedEmail }),
      });

      sessionStorage.setItem("skymeet_reset_email", trimmedEmail);
      sessionStorage.setItem( "skymeet_reset_otp_sent_at", Date.now().toString() );

      router.push("/verify?purpose=reset");

    } catch (err) {
      setError( err instanceof Error ? err.message  : "Unable to process your request. Please try again." );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center overflow-x-hidden theme-bg px-3 py-8">
      <div className="w-full min-w-0 max-w-md rounded-3xl border theme-border theme-surface p-6 backdrop-blur-xl sm:p-8 max-[320px]:rounded-2xl max-[320px]:p-4">
        <h1 className="text-2xl font-bold theme-text sm:text-3xl">Forgot password? </h1>
        <p className="mt-3 text-sm leading-relaxed theme-text-secondary sm:text-base">Enter your email and we&apos;ll send you a verification code.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-6">
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
                disabled={loading}
                className="w-full rounded-2xl bg-[#7C3AED] py-3 font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-60"
            >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
