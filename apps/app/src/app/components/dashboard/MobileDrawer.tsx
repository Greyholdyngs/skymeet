"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { X, House, Video, FolderKanban, Users } from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { label: "Home", href: "/dashboard", icon: House },
  { label: "Meeting", href: "/dashboard/meetings", icon: Video },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "People", href: "/dashboard/people", icon: Users },
];

const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden bg-[#0B0B10]">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />
      <aside className="relative flex h-screen w-[min(20rem,calc(100vw-3rem))] flex-col border-r border-white/10 bg-[#0B0B10] px-4 py-5 shadow-2xl">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/dashboard" onClick={onClose}>
            <Image
              src="/icons/logo.png"
              alt="SkyMeet"
              width={140}
              height={40}
              priority
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/30"> Workspace </p>
        <nav>
          <ul className="space-y-2">
            {
              navigation.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg p-3 transition ${ isActive  ? "bg-[#5B21B6]/50 font-medium text-white"
                                : "text-white/50 hover:bg-white/5 hover:text-white" }`}
                  >
                    <Icon size={20} className={isActive ? "text-[#A78BFA]" : "text-white/40"} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/3 p-4">
          <p className="text-sm font-semibold text-white">SkyMeet Workspace</p>
          <p className="mt-1 text-xs leading-5 text-white/40"> Collaborate, meet and manage your work from one place.</p>
        </div>
      </aside>
    </div>
  );
};

export default MobileDrawer;
