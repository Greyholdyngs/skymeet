"use client"
import { useRouter } from "next/navigation";
import { Calendar, FolderKanban, Users, Video } from "lucide-react";
import { apiFetch } from "../lib/api";

import StatCard from "../components/dashboard/homepage/StatCard";
import WelcomeBanner from "../components/dashboard/homepage/WelcomeBanner";
import AuthGuard from "../components/auth/AuthGuard";

const DashboardPage = () => {
    const isNewUser = true;

    return (
      <AuthGuard>
        <section >
          <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:px-10">
              <WelcomeBanner name="Emmanuel" isNewUser={isNewUser} />
              {
                !isNewUser && (
                  <div  className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total Projects" value={12} icon={FolderKanban} />
                    <StatCard title="Total Meetings" value={5} icon={Video} />
                    <StatCard title="Total Users" value={20} icon={Users} />
                    <StatCard title="Upcoming Meetings" value={3} icon={Calendar} />
                  </div>
                )
              }
              <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6">
                  <h2 className="text-lg font-semibold text-white">Upcoming Meetings</h2>
                  <p className="mt-2 text-sm text-white/40">Your scheduled meetings will appear here.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6">
                  <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                  <p className="mt-2 text-sm text-white/40">Recent workspace activity will appear here.</p>
                </div>
              </section>
              <section className="rounded-2xl border border-white/10 bg-[#14141B] p-6">
                <h2 className="text-lg font-semibold text-white">Active Projects</h2>
                <p className="mt-2 text-sm text-white/40">Projects you are currently working on.</p>
              </section>
          </div>
        </section>
      </AuthGuard>
      
    )
}

export default DashboardPage