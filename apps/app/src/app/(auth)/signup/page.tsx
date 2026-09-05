"use client"
import InputField from "../../components/ui/InputField";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { User } from "@/app/types/auth";
import Link from "next/link";

import PasswordInput from "@/app/components/ui/PasswordInput";

const SignUpPage = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntered(true);
  }, 300);

  return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState<User>({
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
  
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

        router.push("/verify?purpose=signup");
    }

  return (
    <section className={`flex flex-col justify-center items-center min-h-screen bg-[#050711] relative`}>
      <div className="absolute -left-32 -top-32 h-100 w-100 animate-pulse rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`overflow-auto hover:max-h-[70vh] lg:w-[30vw] md:w-[40vw] w-[80vw]  border-2 hide-scrollbar
                    flex flex-col items-center md:space-y-7 space-y-2.5 py-5 px-4 rounded-2xl hide-scrollbar transition-all duration-1000
                    ease-[cubic-bezier(0.22,1,0.36,1)] bg-[#050711]/20 backdrop-blur-2xl border-white/20 shadow-2xl shadow-[#5B21B6]/10
                    ${isExpanded ? "max-h-[70vh]" : "max-h-20 md:max-h-20"} ${ entered ? "translate-x-0 opacity-100" : "translate-x-[-120vw] opacity-0"}
                        `}>
        {
          isExpanded ? <h1 className="text-white text-2xl font-extrabold">Create Account</h1> : (
            <h1 className="text-white text-2xl font-extrabold">
              <span className="hidden md:inline">Hover here to create account</span>
              <span className="md:hidden">Tap here to create account</span>
            </h1>
          )
        }
        <div className={`transition-all duration-500 ease-out w-full
                        ${ isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}>
          <form onSubmit={handleSubmit}  className="space-y-5 w-full">
            <div className={`flex flex-col space-y-2 transition-all duration-500 
                            ${isExpanded ? "opacity-100 translate-y-0 delay-100" : "opacity-0 translate-y-3"}`}>
              <InputField 
                label="First Name"
                type="text"
                value={formData.firstName}
                error={formData.firstName}
                placeholder="Joe"
                onChange={(e) => { setError({ ...error, firstName: ""});
                                  setFormData({ ...formData, firstName: e.target.value});
                
                }}/>
            </div>
            <div className={`flex flex-col space-y-2 transition-all duration-500 
                                    ${isExpanded ? "opacity-100 translate-y-0 delay-150" : "opacity-0 translate-y-3"}`}>
              <InputField 
                label="Lasst Name"
                type="text"
                value={formData.lastName}
                error={formData.lastName}
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
            <button type="submit"
                         className={`bg-[#7C3AED] text-white py-3 rounded-2xl hover:bg-[#6D28D9] w-full
                                    transition-colors cursor-pointer duration-300 hover:scale-[1.02] active:scale-[0.98]
                                    ${ isExpanded ? "opacity-100 translate-y-0 delay-250" : "opacity-0 translate-y-3"
    }`}> 
                        Create Account
                    </button>             
          </form>
        </div>
        <div className={`text-sm md:text-lg transition-all duration-500 text-white/40
                            ${ isExpanded ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-3 pointer-events-none"}`}>
                Already have an account? {" "}
                <Link href="/login" className="text-[#ffffff]/70 hover:underline hover:text-[#7C3AED] transform duration-300 font-semibold">Login</Link>
            </div>
      </div>
      <div className="absolute right-0 bottom-0 h-80 w-80 animate-pulse rounded-full bg-[#7C3AED]/10 blur-3xl" />
    </section>
  )
}

export default SignUpPage