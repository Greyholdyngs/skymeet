"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/ui/InputField";

import PasswordInput from "@/app/components/ui/PasswordInput";
import { LoginResponse } from "@/app/types/auth";
import { apiFetch } from "@/app/lib/api";

import AuthShowcase from "@/app/components/auth/AuthShowcase";
import styles from "@/app/components/auth/AuthShowcase.module.css";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [isPointerInside, setIsPointerInside] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [entered, setEntered] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia( "(hover: hover) and (pointer: fine)" );

    const updateHover = () => setCanHover(mediaQuery.matches);

    updateHover();
    mediaQuery.addEventListener("change", updateHover);

    return () => mediaQuery.removeEventListener("change", updateHover);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please add your registered email.");
      return;
    }

    if (!password.trim()) {
      setError("Please add your password.");
      return;
    }

    try {
      setLoading(true);

      await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      router.replace("/dashboard");

    } catch (err) {
      setError( err instanceof Error ? err.message : "Unable to log in. Please try again." );

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShowcase>
      <section className="relative flex w-full min-w-0 flex-col items-center justify-center overflow-x-hidden px-3 py-6">
        <div
          onMouseEnter={() => {
            setIsPointerInside(true);
            if (canHover) setIsExpanded(true);
          }}
          onMouseLeave={() => {
            setIsPointerInside(false);

            if (canHover && !isFocused) {
              setIsExpanded(false);
            }
          }}
          onFocusCapture={() => setIsFocused(true)}
          onBlurCapture={(e) => {
            const nextTarget = e.relatedTarget as Node | null;

            if (!e.currentTarget.contains(nextTarget)) {
              setIsFocused(false);

              if (!isPointerInside) {
                setIsExpanded(false);
              }
            }
          }}
          className={`relative flex w-full min-w-0 max-w-md flex-col items-center overflow-y-auto rounded-2xl
                      border-2 theme-border theme-surface px-5 py-5 shadow-2xl shadow-[#5B21B6]/10 backdrop-blur-2xl
                      transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isExpanded ? "max-h-[75vh]" : "max-h-20"}
                      ${ entered ? "translate-x-0 opacity-100" : "translate-x-[120vw] opacity-0"}`}
        >
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => {
              if (!canHover) {
                setIsExpanded((prev) => !prev);
              }
            }}
            className="w-full text-center"
          >
            <h1 className="text-xl font-extrabold theme-text sm:text-2xl max-[320px]:text-lg">
              {isExpanded ? "Login Account" : canHover ? "Hover here to Login" : "Tap here to Login"}
            </h1>
          </button>
          <div className={`w-full transition-all duration-500 ease-out ${ isExpanded ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0" }`}>
            <form onSubmit={handleSubmit} className="mt-6 w-full space-y-5">
              <div className="flex min-w-0 flex-col space-y-2">
                <InputField
                  label="Email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => {
                    setError("");
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="flex min-w-0 flex-col space-y-2">
                <PasswordInput
                  label="Password"
                  value={password}
                  placeholder="Enter your password"
                  error={error}
                  onChange={(e) => {
                    setError("");
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#7C3AED] py-3 text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#6D28D9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="cursor-pointer text-sm font-bold theme-text-secondary transition hover:text-[#7C3AED] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </section>
     </AuthShowcase>
  );
};

export default Login;
