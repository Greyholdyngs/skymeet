"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { House, Video, FolderKanban, Users} from "lucide-react";

const sidebarContent = [
    { label: "Home", icon: House, href: "/dashboard" },
    { label: "Meetings", icon: Video, href: "/dashboard/meetings" },
    { label: "Projects", icon: FolderKanban, href: "/dashboard/projects" },
    { label: "People", icon: Users, href: "/dashboard/people" },
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden h-full w-64 shrink-0 flex-col space-y-6 border-r theme-border theme-bg px-4 py-4 lg:flex">
            <div>
                <Link href="/dashboard">
                    <Image
                        src="/icons/logo.png"
                        alt="SkyMeet"
                        width={160}
                        height={46}
                        priority
                    />
                </Link>
            </div>
            <nav className="flex flex-1 flex-col justify-between">
                <div>
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] theme-text-muted"> Workspace </p>
                    <ul className="space-y-3">
                        {sidebarContent.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

                            return (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center space-x-3 rounded-lg p-2 transition ${
                                            isActive ? "bg-[#7C3AED]/10 font-medium text-[#7C3AED] shadow-[inset_0_0_0_1px_rgba(124,58,237,0.2)]"
                                                     : "theme-text-secondary hover:bg-black/5 hover:theme-text"
                                        }`}
                                    >
                                        <Icon
                                            size={20}
                                            className={isActive ? "text-[#7C3AED]" : "theme-text-muted" }
                                        />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="mt-auto rounded-2xl border theme-border theme-surface p-4">
                    <p className="text-sm font-semibold theme-text"> SkyMeet Workspace</p>
                    <p className="mt-1 text-xs leading-5 theme-text-secondary"> Collaborate, meet and manage your work from one place. </p>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
