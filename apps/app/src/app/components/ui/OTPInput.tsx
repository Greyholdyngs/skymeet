"use client";
import { useRef } from "react";

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  error?: boolean;
  success?: boolean;
}
const OTPInput = ({value, onChange, length = 6, error = false, success = false}: OTPInputProps) => {

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = ( input: string, index: number) => {
    if (!/^\d*$/.test(input)) return;

    const newValue = [...value];

    newValue[index] = input.slice(-1);

    onChange(newValue);

    if (input && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = ( e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (
      e.key === "Backspace" &&
      !value[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getInputStyle = (digit: string) => {
    if (success) {
      return "border-green-500/70 shadow-[0_0_20px_rgba(34,197,94,0.25)]";
    }

    if (error) {
      return "border-red-500 animate-shake";
    }

    if (digit) {
      return "border-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.25)]";
    }

    return "border-white/10";
  };
  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) =>
            handleChange(e.target.value, index)
          }
          onKeyDown={(e) =>
            handleKeyDown(e, index)
          }
          className={`h-11 w-10 rounded-xl border bg-white/5 text-center text-lg font-bold text-white outline-none transition-all duration-300
                      focus:scale-105 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 sm:h-14 sm:w-12
                      ${getInputStyle(value[index])}
          `}
        />
      ))}
    </div>
  )
}

export default OTPInput