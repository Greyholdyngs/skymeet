"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  House,
  Video,
  FolderKanban,
  CirclePlay,
  Users,
} from "lucide-react";

const sidebarContent = [
    {
        label: "Home",
        icon: House,
        href: "/dashboard",
    },
    {
        label: "Meetings",
        icon: Video,
        href: "/dashboard/meetings",
    },
    {
        label: "Project",
        icon: FolderKanban,
        href: "/dashboard/projects",
    },
    {
        label: "People",
        icon: Users,
        href: "/dashboard/people",
    },
    ]
const Sidebar = () => {
    const pathname = usePathname();
  return (
    <aside className="bg-[#0B0B10] border-r border-r-[#27272A] px-5 pt-3 max-w-[18vw] space-y-3">
        <div>
            <Link href="/dashboard">
                <Image
                    src="/icons/logo.png"
                    alt="SkyMeet"
                    width={140}
                    height={40}
                    priority
                />
            </Link>
        </div>
        <nav className="flex flex-col justify-between">
            <div>
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/30">Workspace</p>
                <ul className="space-y-3">
                {
                    sidebarContent.map((item) => {
                        const Icon = item.icon;

                        const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-3 p-2 rounded-lg ${isActive ? "bg-[#5B21B6]/50 font-medium shadow-[inset_0_0_0_1px_rgba(124,58,237,0.25)] text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                                >
                                    <Icon
                                        size={20}
                                        className={`transition-transform duration-300 group-hover:scale-110 ${
                                        isActive
                                            ? "text-[#A78BFA]"
                                            : "text-white/40 hover:text-white"
                                        }`}
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        )
                    })
                }
                </ul>
            </div>
            <div className="mt-auto rounded-2xl border border-white/10 bg-white/3 p-4">
                <p className="text-sm font-semibold text-white">
                SkyMeet Workspace
                </p>

                <p className="mt-1 text-xs leading-5 text-white/40">
                Collaborate, meet and manage your work from one place.
                </p>
            </div>
        </nav>
        
    </aside>
  )
}

export default Sidebar