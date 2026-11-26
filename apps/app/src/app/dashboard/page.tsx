"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban,  ListTodo,  Clock3,  Activity, } from "lucide-react";

import AuthGuard from "../components/auth/AuthGuard";
import StatCard from "../components/dashboard/homepage/StatCard";
import WelcomeBanner from "../components/dashboard/homepage/WelcomeBanner";

import DashboardProjectSection, { type DashboardProject } from "../components/dashboard/homepage/DashboardProjectSection";
import InviteMemberModal from "../components/dashboard/project/members/InviteMemberModal";
import type { InviteMemberInput, InviteProjectOption } from "../components/dashboard/project/members/types";

import { useDashboardData } from "./hooks/useDashboardData";
import MyTasksSection from "../components/dashboard/homepage/MyTaskSection";
import RecentActivitySection from "../components/dashboard/homepage/RecentActivitySection";

import { apiFetch } from "@/app/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/lib/queries/query-key";


interface DashboardSummary {
  totalProjects: number;
  myTasksCount: number;
  overdueTasks: number;
  upcomingDeadlinesCount: number;
  recentActivityCount: number;
}

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { projects, summary, user, loading, error: loadError, isNewUser, reload: loadDashboard} = useDashboardData();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const inviteProjects: InviteProjectOption[] = projects.map((project) => ({
    id: project._id,
    name: project.name,
  }));

  const handleCreateProject = () => {
    router.push("/dashboard/projects/new");
  };

  const handleInvitePeople = () => {
    if (projects.length === 0) {
      handleCreateProject();
      return;
    }

    setIsInviteOpen(true);
  };

  const inviteMutation = useMutation({
      mutationFn: (input: InviteMemberInput) =>
          apiFetch(`/projects/${input.projectId}/invitations`, {
              method: "POST",
              body: JSON.stringify({
                  ...(input.method === "email" ? { email: input.identifier } : { userName: input.identifier }),
                  role: input.role,
              }),
          }),
      onSuccess: async (_, input) => {
          await Promise.all([
              queryClient.invalidateQueries({ queryKey: queryKeys.projects.members(input.projectId), }),
              loadDashboard(),
          ]);
      },
  });

  const handleInvite = async (input: InviteMemberInput): Promise<void> => {
      await inviteMutation.mutateAsync(input);
  };

  const metric = (value: number | undefined) => {
    if (loading || loadError || value === undefined) return "—";
    return value;
  };

  return (
    <AuthGuard>
      <main className="min-h-full">
        <div className="mx-auto w-full max-w-7xl min-w-0 space-y-6 px-3 py-5 min-[400px]:px-4 sm:space-y-8 sm:px-6 sm:py-8 md:px-10">
          <WelcomeBanner
            name={user?.firstName ?? "there"}
            isNewUser={isNewUser}
            onCreateProject={handleCreateProject}
            onInvitePeople={handleInvitePeople}
          />
          <section className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Projects"
              value={metric(summary?.totalProjects)}
              icon={FolderKanban}
            />
            <StatCard
              title="My Tasks"
              value={metric(summary?.myTasksCount)}
              icon={ListTodo}
            />
            <StatCard
              title="Upcoming Deadlines"
              value={metric(summary?.upcomingDeadlinesCount)}
              icon={Clock3}
            />
            <StatCard
              title="Activity Events"
              value={metric(summary?.recentActivityCount)}
              icon={Activity}
            />
          </section>
          {
            loadError && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4" >
              <p className="text-sm text-red-300">{loadError}</p>
              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="text-sm font-medium text-white hover:text-[#A78BFA]"
              >
                Try again
              </button>
            </div>
          )}
          <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
            <MyTasksSection
              tasks={summary?.myTasks ?? []}
              loading={loading}
            />
            <RecentActivitySection
              activities={summary?.recentActivity ?? []}
              loading={loading}
            />
          </section>
          <DashboardProjectSection
            projects={projects}
            loading={loading}
            hasError={!!loadError}
            onCreateProject={handleCreateProject}
          />
        </div>
      </main>
      <InviteMemberModal
        isOpen={isInviteOpen}
        projects={inviteProjects}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />
    </AuthGuard>
  );
};

export default DashboardPage;

