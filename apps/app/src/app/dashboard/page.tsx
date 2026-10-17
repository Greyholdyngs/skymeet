
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, ListTodo, Clock3, Activity } from "lucide-react";

import AuthGuard from "../components/auth/AuthGuard";
import StatCard from "../components/dashboard/homepage/StatCard";
import WelcomeBanner from "../components/dashboard/homepage/WelcomeBanner";

import DashboardProjectSection, { type DashboardProject } from "../components/dashboard/homepage/DashboardProjectSection";
import InviteMemberModal from "../components/dashboard/project/members/InviteMemberModal";
import type { InviteMemberInput, InviteProjectOption } from "../components/dashboard/project/members/types";

import { apiFetch } from "../lib/api";

const DashboardPage = () => {
  const router = useRouter();

  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const data = await apiFetch<DashboardProject[]>("/projects");
      setProjects(data);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load your projects.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
     void loadProjects();
  }, [loadProjects]);

  const isNewUser = !loading && !loadError && projects.length === 0;

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

  const handleInvite = async (input: InviteMemberInput) => {
    console.info("Invitation UI submitted:", input);
    throw new Error("Invitation sending is not connected to the backend yet.");
  };

  return (
    <AuthGuard>
      <main className="min-h-full">
        <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:px-10">
          <WelcomeBanner
            name="Emmanuel"
            isNewUser={isNewUser}
            onCreateProject={handleCreateProject}
            onInvitePeople={handleInvitePeople}
          />
          {loadError && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4"
            >
              <p className="text-sm text-red-300">{loadError}</p>
              <button
                type="button"
                onClick={() => void loadProjects()}
                className="text-sm font-medium text-white hover:text-[#A78BFA]"
              >
                Try again
              </button>
            </div>
          )}
          {!isNewUser && !loading && !loadError && (
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Projects"
                value={projects.length}
                icon={FolderKanban}
              />
              <StatCard
                title="My Tasks"
                value="—"
                icon={ListTodo}
              />
              <StatCard
                title="Upcoming Deadlines"
                value="—"
                icon={Clock3}
              />
              <StatCard
                title="Recent Activity"
                value="—"
                icon={Activity}
              />
            </section>
          )}
          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6">
              <h2 className="text-lg font-semibold text-white">My Tasks</h2>
              <p className="mt-2 text-sm leading-6 text-white/40"> Your assigned tasks and work requiring your attention will appear here once task data is connected. </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6">
              <h2 className="text-lg font-semibold text-white"> Recent Activity </h2>
              <p className="mt-2 text-sm leading-6 text-white/40"> Project updates, comments, and task activity will appear here when the activity feed is connected. </p>
            </div>
          </section>
          <DashboardProjectSection
            projects={projects}
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
} 

export default DashboardPage
