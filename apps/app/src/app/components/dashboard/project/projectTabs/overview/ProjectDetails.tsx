
import type { Project } from "@/app/types/project";

interface ProjectDetailsProps {
    project: Project;
}

const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unavailable";

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
};

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
    return (
        <section className="rounded-xl border theme-border theme-surface p-5">
            <h3 className="font-semibold theme-text">Project details</h3>
            <div className="mt-5">
                <p className="text-sm theme-text-secondary">Description</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 theme-text"> {project.description || "No project description yet."} </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 border-t theme-border pt-5 sm:grid-cols-2">
                <div>
                    <p className="text-sm theme-text-secondary">Created</p>
                    <p className="mt-2 text-sm theme-text"> {formatDate(project.createdAt)} </p>
                </div>
                <div>
                    <p className="text-sm theme-text-secondary">Last updated</p>
                    <p className="mt-2 text-sm theme-text"> {formatDate(project.updatedAt)} </p>
                </div>
            </div>
        </section>
    );
};

export default ProjectDetails;
