"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    label: string;
    value: string;
    placeholder?: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({label, value, placeholder, error, onChange,}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <div className="relative flex flex-col space-y-2">
            <label className="text-sm font-semibold text-white">
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`w-full rounded-2xl border-y bg-transparent px-3 py-3 pr-12 text-white outline-none
                                ${ error ? "border-red-500" : "border-white/20 focus:border-[#7C3AED]"}`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {
                        showPassword ? (
                            <EyeOff size={18} /> ) : (<Eye size={18} />
                    )}
                </button>
            </div>
            {error && (
                <p className="text-sm text-red-500">
                {error}
                </p>
            )}
        </div>
    )
}

export default PasswordInput