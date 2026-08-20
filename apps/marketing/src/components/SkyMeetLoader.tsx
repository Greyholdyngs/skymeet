"use client";
import { useEffect, useState } from "react";

const SkyMeetLoader = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#0F0F14]">
        <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,#7C3AED,#211B30,#5B21B6,#7C3AED)]" />
        <div className="absolute inset-0.75 rounded-full bg-[#0B0811]" />
        <img
          src="/images/logoload.png"
          alt="SkyMeet"
          className="relative z-10 h-16 w-16 object-contain"
        />
      </div>
    </div>
  )
}

export default SkyMeetLoader