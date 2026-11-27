"use client";

import Link from "next/link";
import Button from "../Button";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => {
  const linkStyle = "block w-full rounded-xl px-3 py-3 text-sm min-[360px]:text-base text-zinc-300 transition-colors hover:bg-white/5 hover:text-white";

  return (
    <div
      className={`fixed inset-0 z-40 min-h-dvh md:hidden ${ open ? "pointer-events-auto" : "pointer-events-none" }`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0" }`}
      />
      <div
        id="mobile-navigation"
        className={`absolute right-0 top-0 flex h-dvh w-[85%] max-w-sm flex-col border-l border-white/10 bg-[#0F0F14] px-3 pb-5 pt-20 shadow-2xl transition-transform duration-300 ease-out min-[360px]:px-6 min-[360px]:pb-8 min-[360px]:pt-24 ${
                    open ? "translate-x-0" : "translate-x-full" }`}
      >
        <nav className="flex flex-col gap-2">
          <Link
            href="#features"
            onClick={onClose}
            className={linkStyle}
            tabIndex={open ? 0 : -1}
          >
            Features
          </Link>
          <Link
            href="#about"
            onClick={onClose}
            className={linkStyle}
            tabIndex={open ? 0 : -1}
          >
            About
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <Button
            href="https://app.skymeet.greyholdyngs.com/login"
            buttonType="secondary"
            className="w-full px-3! py-3! text-sm"
            onClick={onClose}
          >
            Login
          </Button>
          <Button
            href="https://app.skymeet.greyholdyngs.com/signup"
            buttonType="primary"
            className="w-full px-3! py-3! text-sm"
            onClick={onClose}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
