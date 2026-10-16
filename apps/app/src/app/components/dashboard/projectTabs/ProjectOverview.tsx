import { CalendarDays, ListTodo, Users } from "lucide-react";
import type { Project } from "@/app/types/project";

interface ProjectOverviewProps {
    project: Project;
}

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
    return (
        <div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]/10 text-[#A78BFA]">
                            <Users size={17} />
                        </div>
                        <p className="text-sm text-white/40"> Members </p>
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-white"> {project.membersCount} </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]/10 text-[#A78BFA]">
                            <ListTodo size={17} />
                        </div>
                        <p className="text-sm text-white/40"> Tasks </p>
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-white"> — </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]/10 text-[#A78BFA]">
                            <ListTodo size={17} />
                        </div>
                        <p className="text-sm text-white/40"> Completed </p>
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-white"> — </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]/10 text-[#A78BFA]">
                            <CalendarDays size={17} />
                        </div>
                        <p className="text-sm text-white/40"> Status </p>
                    </div>
                    <p className="mt-4 text-sm font-medium text-[#A78BFA]"> Active </p>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-white"> Project overview </h2>
                    <p className="mt-2 text-sm leading-6 text-white/40"> { project.description || "No project description yet."} </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6">
                    <h2 className="text-lg font-semibold text-white"> Project details </h2>
                    <div className="mt-5 space-y-4">
                        <div>
                            <p className="text-xs text-white/30"> Created </p>
                            <p className="mt-1 text-sm text-white/70"> { new Date(project.createdAt).toLocaleDateString()} </p>
                        </div>
                        <div>
                            <p className="text-xs text-white/30"> Last updated </p>
                            <p className="mt-1 text-sm text-white/70"> { new Date(project.updatedAt).toLocaleDateString()} </p>
                        </div>
                        <div>
                            <p className="text-xs text-white/30"> Status </p>
                            <p className="mt-1 text-sm font-medium text-[#A78BFA]"> Active </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;