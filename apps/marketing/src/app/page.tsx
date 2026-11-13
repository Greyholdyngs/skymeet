"use client";
import { useState } from "react";
import { pageStyle } from "@/style/pageStyle";

import SkyMeetLoader from "../components/SkyMeetLoader";
import Navbar from "@/components/Navbar";

import Hero from "@/components/landing/Hero";
import Feature from "@/components/landing/Feature";
import Pricing from "@/components/landing/Pricing";
import Download from "@/components/landing/Download";
import About from "@/components/landing/About";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {

  return (
    <div className="bg-[#050711] min-h-screen">
      <SkyMeetLoader />
      <Navbar />
      <main className={` space-y-20`}>
        <Hero />
        <Feature />
        <Pricing />
        <Download />
        <About />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
