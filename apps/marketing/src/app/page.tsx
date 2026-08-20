"use client";
import { useState } from "react";
import SkyMeetLoader from "../components/SkyMeetLoader";
import Navbar from "@/components/Navbar";

export default function Home() {

  return (
    <div className="bg-[#0F0F14] min-h-screen">
      <SkyMeetLoader />
        <Navbar />
      <main>
        
      </main>
    </div>
  );
}
