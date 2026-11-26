import type { WorkspacePerson } from "./types";

interface PersonCardProps {
    person: WorkspacePerson;
}

const PersonCard = ({ person }: PersonCardProps) => {
    const { user, sharedProjects } = person;

    const fullName = `${user.firstName} ${user.lastName}`.trim() || user.userName;

    return (
        <article className="rounded-2xl border theme-border theme-surface p-5 transition hover:theme-surface-hover">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A78BFA]/15 text-sm font-semibold text-[#A78BFA]"> {fullName.charAt(0).toUpperCase()} </div>
                <div className="min-w-0">
                    <h2 className="truncate font-semibold theme-text"> {fullName} </h2>
                    <p className="truncate text-sm theme-text-secondary"> @{user.userName} </p>
                </div>
            </div>
            <p className="mt-4 break-all text-sm theme-text-secondary"> {user.email} </p>
            <div className="mt-5 border-t theme-border pt-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider theme-text-muted"> Shared projects </p>
                <div className="flex flex-wrap gap-2">
                    {sharedProjects.map((project) => (
                        <span
                            key={project.projectId}
                            className="rounded-lg border theme-border theme-surface-elevated px-3 py-1.5 text-xs theme-text-secondary"
                        >
                            {project.projectName}
                            <span className="ml-2 theme-text-muted"> · {project.role.replace("_", " ")} </span>
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default PersonCard;