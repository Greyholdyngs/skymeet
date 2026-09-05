"use client"
import { Bell, Search, ChevronDown, } from "lucide-react";
import { useState } from "react";


const TopBar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    return (
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-[#0F0F14]/80 px-6 backdrop-blur-xl md:px-10">
            <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="mt-1 text-sm text-white/40">Overview of your workspace</p>
            </div>
            <section className="relative flex space-x-3 items-center">
                <div  className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-4 py-2 md:flex">
                    <Search size={20} className="text-white/40"/>
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                    />
                </div>
                <div className="relative">
                    <button 
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/3 text-white/70 transition hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/10 hover:text-white"
                        onClick={() => setShowNotification((prev) => !prev)}>
                        <Bell size={20}/>
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#7C3AED]" />
                    </button>
                    {showNotification && (
                        <div className="absolute right-0 top-14 w-80 rounded-2xl border border-white/10 bg-[#16161F] p-4 shadow-2xl">
                            <p className="font-semibold text-white">Notifications</p>
                            <p className="mt-4 text-sm text-white/40">You're all caught up.</p>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <button
                        onClick={() =>
                        setShowProfile((prev) => !prev)
                        }
                        className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/4"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#7C3AED] to-[#A78BFA] font-bold text-white">E</div>
                        <div className="hidden text-left lg:block">
                            <p className="text-sm font-semibold text-white">Emmanuel</p>
                            <p className="text-xs text-white/40">
                                Workspace owner
                            </p>
                        </div>
                        <ChevronDown size={16} className="hidden text-white/40 lg:block"/>
                    </button>
                    {showProfile && (
                        <div className="absolute right-0 top-14 w-56 rounded-2xl border border-white/10 bg-[#16161F] p-2 shadow-2xl">
                            <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white">Profile</button>
                            <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white">Settings</button>
                            <div className="my-2 border-t border-white/10" />
                            <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10">Logout</button>
                        </div>
                    )}
                </div>
            </section>
        </header>
    )
}

export default TopBar