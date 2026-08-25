"use client";
import Link from "next/link";
import Button from "./Button";

import { useState,useEffect } from "react";
import { pageStyle } from "@/style/pageStyle";

import MobileDrawer from "./navigation/MobileDrawer";



const Navbar = () => {

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, []);
  return (
    <>
    <nav className={`flex fixed left-1/2 justify-between items-center z-50 font-semibold -translate-x-1/2 transition-all duration-300 
                    ${ scrolled ? `rounded-4xl border border-white/10 bg-black/80 backdrop-blur-md w-[80vw] px-5 py-1 top-5` : `rounded-none bg-transparent w-full ${pageStyle.padding}`
                    } `}>
        <Link href="/">
          <img src="/images/logo.png" alt="SkyMeet" className="lg:w-[13.5vw] md:w-[14vw] w-[36vw]" />
        </Link>
      <ul className="space-x-5 hidden md:flex">
        <li><Link href="#features">Features</Link></li>
        <li><Link href="#pricing">Pricing</Link></li>
        <li><Link href="#download">Download</Link></li>
        <li><Link href="#about">About</Link></li>
      </ul>
      <span className="hidden md:flex space-x-5">
        <Button href="/login" buttonType="secondary">Login</Button>
        <Button href="/signup" buttonType="primary">Sign Up</Button>
      </span>
      <button
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
          className={`relative z-50 flex h-11 w-11 items-center justify-center rounded-xl border  text-white md:hidden ${ scrolled ? "border-none" : "border-white/10 bg-white/5"}`}>
         <span className="sr-only">
            {menuOpen ? "Close menu" : "Open menu"}
          </span>

          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-0.5 w-full bg-white transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-full bg-white transition-transform duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
      </button>
    </nav>
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
  </>
  )
}

export default Navbar
