"use client"
import InputField from "../../components/ui/InputField";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthShowcase from "@/app/components/auth/AuthShowcase";
import { SignupFormData } from "@/app/types/auth";
import Link from "next/link";

import PasswordInput from "@/app/components/ui/PasswordInput";
import { apiFetch } from "@/app/lib/api";
import styles from "@/app/components/auth/AuthShowcase.module.css";

const SignUpPage = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [isPointerInside, setIsPointerInside] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const isHoverDevice = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const [entered, setEntered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setCanHover(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    const timer = setTimeout(() => { setEntered(true); }, 300);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isHoverDevice()) return;

    setIsPointerInside(true);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isHoverDevice()) return;

    setIsPointerInside(false);

    if (!isFocused) {
      setIsExpanded(false);
    }
  };

  const [formData, setFormData] = useState<SignupFormData>({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

  const [error, setError] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const validationErrors = {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!formData.firstName.trim()) {
          validationErrors.firstName = `Kindly put in your First Name`;
        }

        if (!formData.lastName.trim()) {
          validationErrors.lastName = `Kindly put in your Last Name`;
        }

        if (!formData.username.trim()) {
            validationErrors.username = "Your username can't be empty";
        }
        if (!formData.email.trim()) {
            validationErrors.email = "Your email is needed for this signup";
        }
        if (!formData.password.trim()) {
            validationErrors.password = "Your password can't be empty";
        }
        if (!formData.confirmPassword.trim()) {
            validationErrors.confirmPassword = "Your password can't be empty";
        }

        if (Object.values(validationErrors).some((v) => !!v)) {
          setError(validationErrors);
          return;
        }

        try {
          setLoading(true)
          const response = await apiFetch<{ message: string; userId: string }>( "/auth/signup",
            {
              method: "POST",
              body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                userName: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
              }),
            },
          );

          console.log(response);

          setSuccess(true);
          sessionStorage.setItem("skymeet_signup_email", formData.email);
          sessionStorage.setItem("skymeet_signup_otp_sent_at", Date.now().toString());

          router.push("/verify?purpose=signup");
        } catch (error) {
            setError({
              ...validationErrors,
              email: error instanceof Error  ? error.message : "Something went wrong. Please try again.",
            });
          }
  }

  return (
    <AuthShowcase>
      <section className={`relative flex w-full min-w-0 flex-col items-center justify-center py-6 ${styles.previewStage}`}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`overflow-auto w-full max-w-md  border-2 hide-scrollbar
                    flex flex-col items-center md:space-y-7 space-y-2.5 py-5 px-4 rounded-2xl hide-scrollbar transition-all duration-1000
                    ease-[cubic-bezier(0.22,1,0.36,1)] theme-surface theme-border backdrop-blur-2xl shadow-2xl shadow-[#5B21B6]/10
                    ${isExpanded ? "max-h-[70vh]" : "max-h-28"} ${ entered ? "translate-x-0 opacity-100" : "translate-x-[-120vw] opacity-0"}
                        `}>
        <button
          type="button"
          onClick={() => {
            if (!canHover) {
              setIsExpanded((current) => !current);
            }
          }}
          aria-expanded={isExpanded}
          className="text-theme-text text-xl sm:text-2xl font-extrabold text-center leading-tight"
        >
          {isExpanded ? "Create Account" : canHover ? "Hover here to create account" : "Tap here to create account"}
        </button>
        <div className={`transition-all duration-500 ease-out w-full
                        ${ isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}>
          <form
            onSubmit={handleSubmit}
            onFocusCapture={() => setIsFocused(true)}

            onBlurCapture={(e) => {
              if (!canHover) return;
              const nextTarget = e.relatedTarget as Node | null;

              if (!e.currentTarget.contains(nextTarget)) {
                setIsFocused(false);

                if (!isPointerInside) {
                  setIsExpanded(false);
                }
              }
            }}
            className="space-y-5 w-full">
            <div className={`flex flex-col space-y-2 transition-all duration-500
                            ${isExpanded ? "opacity-100 translate-y-0 delay-100" : "opacity-0 translate-y-3"}`}>
              <InputField
                label="First Name"
                type="text"
                value={formData.firstName}
                error={error.firstName}
                placeholder="Joe"
                onChange={(e) => { setError({ ...error, firstName: ""});
                                  setFormData({ ...formData, firstName: e.target.value});

                }}/>
            </div>
            <div className={`flex flex-col space-y-2 transition-all duration-500
                                    ${isExpanded ? "opacity-100 translate-y-0 delay-150" : "opacity-0 translate-y-3"}`}>
              <InputField
                label="Last Name"
                type="text"
                value={formData.lastName}
                error={error.lastName}
                placeholder="Pet"
                onChange={(e) => { setError({ ...error, lastName: ""});
                                  setFormData({ ...formData, lastName: e.target.value});
                }}/>
            </div>
            <div className={`flex flex-col space-y-2 transition-all duration-500 relative
                                    ${isExpanded ? "opacity-100 translate-y-0 delay-200" : "opacity-0 translate-y-3"}`}>
              <InputField
                label="Username"
                type="text"
                value={formData.username}
                error={error.username}
                placeholder="Joe"
                onChange={(e) => { setError({ ...error, username: ""});
                                  setFormData({ ...formData, username: e.target.value});
                }}/>
            </div>
            <div className={`flex flex-col space-y-2 transition-all duration-500 relative
                                    ${isExpanded ? "opacity-100 translate-y-0 delay-250" : "opacity-0 translate-y-3"}`}>
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              error={error.email}
              placeholder="Joe"
              onChange={(e) => { setError({ ...error, email: ""});
                                setFormData({ ...formData, email: e.target.value});
              }}/>
            </div>
            <div className={`flex flex-col space-y-2 transition-all duration-500 relative
                          ${isExpanded ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-3"}`}>
              <PasswordInput
                label="Password"
                value={formData.password}
                placeholder="Enter your password"
                error={error.password}
                onChange={(e) => {
                  setError({
                    ...error,
                    password: "",
                  });

                  setFormData({
                    ...formData,
                    password: e.target.value,
                  });
                }}
              />
            </div>
            <div className={`flex flex-col space-y-2 transition-all duration-500 relative
                          ${isExpanded ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-3"}`}>
              <PasswordInput
                label="Confirm Password"
                value={formData.confirmPassword}
                placeholder="Confirm your password"
                error={error.confirmPassword}
                onChange={(e) => {
                  setError({
                    ...error,
                    confirmPassword: "",
                  });

                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  });
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || success}
              className={`bg-[#7C3AED] text-white py-3 rounded-2xl hover:bg-[#6D28D9] w-full transition-colors
                          cursor-pointer duration-300 hover:scale-[1.02] active:scale-[0.98]
                        ${ isExpanded ? "opacity-100 translate-y-0 delay-250" : "opacity-0 translate-y-3"}`}>
                { loading ? "Creating Account..." : "Create Account"}
              </button>
          </form>
        </div>
        <div className={`text-sm md:text-lg transition-all duration-500 theme-text-secondary
                            ${ isExpanded ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-3 pointer-events-none"}`}>
                Already have an account? {" "}
                <Link href="/login" className="text-theme-text-secondary hover:underline hover:text-[#7C3AED] transform duration-300 font-semibold">Login</Link>
            </div>
      </div>
      </section>
    </AuthShowcase>
  )
}

export default SignUpPage