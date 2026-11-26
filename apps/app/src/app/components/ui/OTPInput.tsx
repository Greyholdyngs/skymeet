"use client";
import { useRef } from "react";

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  error?: boolean;
  success?: boolean;
}

const OTPInput = ({ value, onChange, length = 6, error = false, success = false }: OTPInputProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (input: string, index: number) => {
    const digits = input.replace(/\D/g, "");
    if (!digits) {
      const nextValue = [...value];
      nextValue[index] = "";
      onChange(nextValue);
      return;
    }

    const nextValue = [...value];

    digits.split("").forEach((digit, offset) => {
      const targetIndex = index + offset;
      if (targetIndex < length) {
        nextValue[targetIndex] = digit;
      }
    });

    onChange(nextValue);

    const nextIndex = Math.min(index + digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

    if (!digits) return;
    const nextValue = Array(length).fill("");
    digits.split("").forEach((digit, index) => { nextValue[index] = digit; });

    onChange(nextValue);
    inputRefs.current[Math.min(digits.length, length) - 1]?.focus();
  };

  const handleKeyDown = ( e: React.KeyboardEvent<HTMLInputElement>, index: number ) => {

    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
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
    <div
      onPaste={handlePaste}
      className="flex justify-center gap-2 sm:gap-3 max-[320px]:gap-1"
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={length}
          aria-label={`Verification code digit ${index + 1} of ${length}`}
          value={value[index] || ""}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          disabled={success}
          className={`h-11 w-10 rounded-xl border bg-white/5 text-center text-lg font-bold text-white outline-none transition-all duration-300
            focus:scale-105 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20
            sm:h-14 sm:w-12 max-[320px]:h-10 max-[320px]:w-6 max-[320px]:rounded-lg max-[320px]:text-base
            ${getInputStyle(value[index])}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
