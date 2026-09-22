"use client"
import { useMemo, useState, useEffect } from "react";
import ProjectSearch from "@/app/components/dashboard/project/ProjectSearch";
import ProjectGrid from "@/app/components/dashboard/project/ProjectGrid";

import ProjectEmptyState from "@/app/components/dashboard/project/ProjectEmptyState";
import type { Project } from "@/app/types/project";
import { apiFetch } from "@/app/lib/api";

const page = () => {
  const [search, setSearch] = useState("");
  const [ projects, setProjects ] = useState<Project []>([])
  const [loading, setLoading] = useState(true);

  const [error, setError] =useState("");
  useEffect(() => { 
    const loadProjects = async () => { 
      try { 
        setLoading(true); 
        setError(""); 

        const data = await apiFetch<Project[]>("/projects");
        setProjects(data); 

      } catch (error) { 
        setError( error instanceof Error ? error.message : "Unable to load projects.")

      } finally { 
        setLoading(false)
      }
    }; 
    
    loadProjects(); }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects,search]);

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