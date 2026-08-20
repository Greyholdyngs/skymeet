"use client";

import Link from "next/link";
import Button from "../Button";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => {

    const listStye = `rounded-xl py-1 text-lg text-zinc-300 transition-colors hover:bg-white/5 hover:text-white`
  return (
    <div
      className={`fixed min-h-screen  inset-0 z-40 md:hidden ${ open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
    <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute right-0 top-0 h-full w-[80%] max-w-sm border-l border-white/10 bg-[#0F0F14] px-6 pb-8 pt-24 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <nav className="flex flex-col space-y-3">
            <Link
              href="#features"
              onClick={onClose}
              className={listStye}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              onClick={onClose}
              className={listStye}
            >
              Pricing
            </Link>
            <Link
              href="#download"
              onClick={onClose}
              className={listStye}
            >
              Download
            </Link>

            <Link
              href="#about"
              onClick={onClose}
              className={listStye}
            >
              About
            </Link>
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Button
              href="/login"
              buttonType="secondary"
              className="w-full"
              onClick={onClose}
            >
              Login
            </Button>

            <Button
              href="/register"
              buttonType="primary"
              className="w-full"
              onClick={onClose}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;