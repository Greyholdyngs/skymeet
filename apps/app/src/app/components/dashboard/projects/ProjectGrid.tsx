import type { Project } from "@/app/types/project";
import ProjectCard from "../project/ProjectCard";

interface ProjectGridProps {
    projects: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
                <ProjectCard
                    key={project._id}
                    project={project}/>
            ))}
        </div>
    );
};

export default ProjectGrid;