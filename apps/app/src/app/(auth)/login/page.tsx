"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import InputField from "@/app/components/ui/InputField";
import { LoginResponse } from "@/app/types/auth";

import PasswordInput from "@/app/components/ui/PasswordInput";
import { apiFetch } from "@/app/lib/api";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const [entered, setEntered] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
          setEntered(true);
      }, 300);
    
      return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Please add your registered email");
            return;
        }
        if (!password.trim()) {
            setError("Please add your password");
            return;
        } 
        
        try {
          setLoading(true);

          const response = await apiFetch<LoginResponse>("/auth/login", {
              method: "POST",
              body: JSON.stringify({
                  email,
                  password,
              }),
          });

          router.replace("/dashboard");

        } catch (error) {
            setError( error instanceof Error ? error.message : "Unable to log in. Please try again.",
        );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="flex flex-col justify-center items-center min-h-screen bg-[#050711] relative">
      <div className="absolute -left-32 -top-32 h-100 w-100 animate-pulse rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`overflow-auto hover:max-h-[70vh] lg:w-[30vw] md:w-[40vw] w-[80vw]  border-2 hide-scrollbar
                    flex flex-col items-center md:space-y-7 space-y-2.5 py-5 px-4 rounded-2xl transition-all duration-1000
                    ease-[cubic-bezier(0.22,1,0.36,1)] bg-[#050711]/20 backdrop-blur-2xl border-white/20 shadow-2xl shadow-[#5B21B6]/10
                    ${isExpanded ? "max-h-[70vh]" : "max-h-20 md:max-h-20"} ${ entered ? "translate-x-0 opacity-100" : "translate-x-[120vw] opacity-0"}
                        `}>
        {
          isExpanded ? <h1 className="text-white text-2xl font-extrabold">Login Account</h1> : (
            <h1 className="text-white text-2xl font-extrabold">
              <span className="hidden md:inline">Hover here to Login</span>
              <span className="md:hidden">Tap here to Login</span>
            </h1>
          )
        }
        <div className={`transition-all duration-500 ease-out w-full
                            ${ isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}>
          <form onSubmit={handleSubmit}  className="space-y-5 w-full">
            <div className={`flex flex-col space-y-2 transition-all duration-500 relative
                                    ${isExpanded ? "opacity-100 translate-y-0 delay-250" : "opacity-0 translate-y-3"}`}>
            <InputField 
              label="Email"
              type="email"
              value={email}
              placeholder="Joe"
              onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className={`flex flex-col space-y-2 transition-all duration-500 relative
                          ${isExpanded ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-3"}`}>
              <PasswordInput
                label="Password"
                value={password}
                placeholder="Enter your password"
                error={error}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value)}}
              />
            </div>
            <button type="submit"
                         className={`bg-[#7C3AED] text-white py-3 rounded-2xl hover:bg-[#6D28D9] w-full
                                    transition-colors cursor-pointer duration-300 hover:scale-[1.02] active:scale-[0.98]
                                    ${ isExpanded ? "opacity-100 translate-y-0 delay-250" : "opacity-0 translate-y-3"
    }`}> 
                        Login
                    </button>             
          </form>
          <div className="flex justify-end mt-3">
            <small className="text-white/80 hover:underline hover:text-[#7C3AED] font-bold text-md cursor-pointer">
              <button className="cursor-pointer"
                onClick={() => (router.push("/forgot-password"))}>Forgot Password?</button>
            </small>
          </div>
        </div>
        
      </div>
      <div className="absolute right-0 bottom-0 h-80 w-80 animate-pulse rounded-full bg-[#7C3AED]/10 blur-3xl" />
    </section>
    )
}
export default Login