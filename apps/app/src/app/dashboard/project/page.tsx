"use client"
import { useMemo, useState } from "react";
import ProjectSearch from "@/app/components/dashboard/project/ProjectSearch";

import ProjectGrid from "@/app/components/dashboard/project/ProjectGrid";
import ProjectEmptyState from "@/app/components/dashboard/project/ProjectEmptyState";

import type { Project } from "@/app/types/project";

const projects: Project[] = [
  
  {
    id: "1",
    name: "SkyMeet",
    description: "Meeting and collaboration platform built for teams and individuals.",
    ownerId: "user-1",
    ownerName: "Emmanuel",
    membersCount: 4,
    tasksCount: 18,
    createdAt: "2026-11-01",
    updatedAt: "today",
    status: "active"
  },
  {
    id: "2",
    name: "Thrilla",
    description: "Thrills",
    ownerId: "user-1",
    ownerName: "Emmanuel",
    membersCount: 5,
    tasksCount: 18,
    createdAt: "2026-08-01",
    updatedAt: "today",
    status: "active"
  },
  {
    id: "3",
    name: "Rosewood",
    description: "Cargo Project Management",
    ownerId: "user-1",
    ownerName: "Emmanuel",
    membersCount: 2,
    tasksCount: 18,
    createdAt: "2026-07-01",
    updatedAt: "yesterday",
    status: "active"
  },
  {
    id: "4",
    name: "GreyHound",
    description: "Consulting and Project Management",
    ownerId: "user-1",
    ownerName: "Emmanuel",
    membersCount: 10,
    tasksCount: 18,
    createdAt: "2026-02-01",
    updatedAt: "today",
    status: "active"
  }
];

const page = () => {
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);
  return (
    <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#A78BFA]">Workspace</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Projects</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/40">Create and manage projects, collaborate with your team, and keep your work organized.</p>
        </div>
        <ProjectSearch onSearch={setSearch} />
        <div className="mt-8">
          {filteredProjects.length > 0 ? (
            <ProjectGrid projects={filteredProjects} />
          ) : (
            <ProjectEmptyState />
          )}
        </div>
      </div>
    </div>
  )
}

export default page