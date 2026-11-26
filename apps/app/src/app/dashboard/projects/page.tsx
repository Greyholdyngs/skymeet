"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectSearch from "@/app/components/dashboard/project/ProjectSearch";

import ProjectGrid from "@/app/components/dashboard/project/ProjectGrid";
import ProjectEmptyState from "@/app/components/dashboard/project/ProjectEmptyState";
import type { Project } from "@/app/types/project";

import { apiFetch } from "@/app/lib/api";
import { queryKeys } from "@/app/lib/queries/query-key";

const ProjectsPage = () => {
    const [search, setSearch] = useState("");

    const { data: projects = [], isLoading: loading, error } = useQuery({
        queryKey: queryKeys.projects.lists(),
        queryFn: () => apiFetch<Project[]>("/projects"),
    });

    const errorMessage = error instanceof Error ? error.message : "";

    const filteredProjects = useMemo(
        () => projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()), ),
        [projects, search],
    );

    return (
        <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <p className="text-sm font-medium text-[#A78BFA]"> Workspace </p>
                    <h1 className="mt-1 text-2xl font-bold theme-text sm:text-3xl"> Projects </h1>
                    <p className="mt-2 max-w-2xl text-sm theme-text-secondary"> Create and manage projects, collaborate with your team, and keep your work organized. </p>
                </div>
                <ProjectSearch onSearch={setSearch} />
                <div className="mt-8">
                    {loading ? (
                        <p className="text-sm theme-text-muted"> Loading projects... </p>
                    ) : error ? (
                        <p className="text-sm text-red-500"> {errorMessage || "Unable to load projects."} </p>
                    ) : filteredProjects.length > 0 ? (
                        <ProjectGrid projects={filteredProjects} />
                    ) : (
                        <ProjectEmptyState />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;

