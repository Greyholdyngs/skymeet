"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PasswordInput from "@/app/components/ui/PasswordInput";
import { apiFetch } from "@/app/lib/api";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      password: "",
      confirmPassword: "",
    };

    if (!password.trim()) {
      newErrors.password = "Please enter a new password.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword =
        "Please confirm your new password.";
    }

    if (
      password &&
      confirmPassword &&
      password !== confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    const email = sessionStorage.getItem( "skymeet_reset_email",);

    const otp = sessionStorage.getItem("skymeet_reset_otp");

    if (!email || !otp) {
      setErrors({
        password: "",
        confirmPassword:"Your password reset session has expired. Please request a new code.",
      });
    return;
    }

     try {
      setLoading(true);

      await apiFetch<{ message: string }>("/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            otp,
            newPassword: password,
            confirmPassword,
          }),
        },
      );

      sessionStorage.removeItem("skymeet_reset_email");
      sessionStorage.removeItem("skymeet_reset_otp");

      router.replace("/login");

    } catch (error) {
      setErrors({
        password: "",
        confirmPassword: error instanceof Error ? error.message : "Unable to reset your password. Please try again.",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050711] px-4">
      <div className="absolute -left-32 -top-32 h-80 w-80 animate-pulse rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl shadow-[#5B21B6]/10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
          Security
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          Create a new password
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Choose a strong password for your SkyMeet account.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <PasswordInput
            label="New Password"
            value={password}
            placeholder="Enter new password"
            error={errors.password}
            onChange={(e) => {
              setPassword(e.target.value);

              setErrors((prev) => ({
                ...prev,
                password: "",
              }));
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
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#7C3AED] py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#6D28D9] active:scale-[0.98]"
          >
           {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      <div className="absolute -bottom-32 -right-32 h-80 w-80 animate-pulse rounded-full bg-[#7C3AED]/10 blur-3xl" />
    </section>
  );
};

export default ResetPasswordPage;