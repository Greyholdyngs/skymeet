"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pageStyle } from "@/style/pageStyle";

import Button from "./Button";
import MobileDrawer from "./navigation/MobileDrawer";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed left-1/2 top-0 z-50 flex w-full -translate-x-1/2 items-center justify-between gap-2 font-semibold transition-all duration-300 min-[360px]:gap-4 ${
                    scrolled ? "top-3 w-[calc(100%-1.5rem)] rounded-4xl border border-white/10 bg-black/5 px-3 py-1 backdrop-blur-xl min-[360px]:w-[90%] min-[360px]:px-5"
                    : `bg-transparent ${pageStyle.padding} py-3`}`}
      >
        <Link
          href="/"
          aria-label="SkyMeet home"
          onClick={() => setMenuOpen(false)}
          className="min-w-0 shrink"
        >
          <img
            src="/images/logo.png"
            alt="SkyMeet"
            className="h-auto w-26.25 max-w-full object-contain min-[360px]:w-31.25 md:w-37.5 lg:w-45"
          />
        </Link>
        <div className="hidden shrink-0 items-center gap-5 md:flex">
          <ul className="hidden items-center gap-5 text-sm text-gray-300 lg:flex">
            <li>
              <Link href="#features" className="transition-colors hover:text-white"> Features </Link>
            </li>
            <li>
              <Link href="#about" className="transition-colors hover:text-white"> About </Link>
            </li>
          </ul>
          <Button href="https://app.skymeet.greyholdyngs.com/login" buttonType="secondary"> Login </Button>
          <Button href="https://app.skymeet.greyholdyngs.com/signup" buttonType="primary"> Get Started </Button>
        </div>
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
          className={`relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-white transition-colors md:hidden ${
                      scrolled ? "border-white/10 bg-white/5" : "border-white/10 bg-white/5" }`}
        >
          <span className="sr-only"> {menuOpen ? "Close menu" : "Open menu"} </span>
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-0.5 w-full bg-white transition-transform duration-300 ${ menuOpen ? "translate-y-2 rotate-45" : "" }`}
            />
            <span
              className={`h-0.5 w-full bg-white transition-opacity duration-300 ${ menuOpen ? "opacity-0" : "opacity-100" }`}
            />
            <span
              className={`h-0.5 w-full bg-white transition-transform duration-300 ${ menuOpen ? "-translate-y-2 -rotate-45" : "" }`}
            />
          </div>
        </button>
      </nav>
      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
