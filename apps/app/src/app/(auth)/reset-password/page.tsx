"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/app/components/ui/PasswordInput";

import { apiFetch } from "@/app/lib/api";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const newErrors = {
      password: "",
      confirmPassword: "",
    };

    if (!password) {
      newErrors.password = "Please enter a new password.";
    } else if (password.length < 8 || password.length > 72) {
      newErrors.password = "Password must be between 8 and 72 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    const email = sessionStorage.getItem("skymeet_reset_email");
    const otp = sessionStorage.getItem("skymeet_reset_otp");

    if (!email || !otp) {
      setErrors({
        password: "",
        confirmPassword: "Your password reset session has expired. Please request a new code.",
      });
      return;
    }

    try {
      setLoading(true);

      await apiFetch<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
          newPassword: password,
          confirmPassword,
        }),
      });

      sessionStorage.removeItem("skymeet_reset_email");
      sessionStorage.removeItem("skymeet_reset_otp");
      sessionStorage.removeItem("skymeet_reset_otp_sent_at");

      router.replace("/login");
    } catch (err) {
      setErrors({
        password: "",
        confirmPassword: err instanceof Error ? err.message : "Unable to reset your password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-x-hidden theme-bg px-3 py-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 animate-pulse rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="relative w-full min-w-0 max-w-md rounded-3xl border theme-border theme-surface p-6 shadow-2xl
                      shadow-[#5B21B6]/10 backdrop-blur-xl sm:p-8 max-[320px]:rounded-2xl max-[320px]:p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">  Security </p>
        <h1 className="mt-3 text-2xl font-bold theme-text sm:text-3xl"> Create a new password </h1>
        <p className="mt-3 text-sm leading-6 theme-text-secondary"> Choose a strong password for your SkyMeet account.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <PasswordInput
            label="New Password"
            value={password}
            placeholder="Enter new password"
            error={errors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            placeholder="Confirm new password"
            error={errors.confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                confirmPassword: "",
              }));
            }}
          />
          <p className="text-xs theme-text-muted"> Use nothing less that 8 characters</p>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#7C3AED] py-3 font-semibold theme-text transition-all duration-300 hover:scale-[1.02] hover:bg-[#6D28D9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 animate-pulse rounded-full bg-[#7C3AED]/10 blur-3xl" />
    </section>
  );
};

export default ResetPasswordPage;
