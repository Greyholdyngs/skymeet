import type { Project } from "@/app/types/project";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
    projects: Project[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
    return (
        <div className="flex flex-col space-y-3">
            {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
            ))}
        </div>
    )
}
export default ProjectList;