 "use client";

import type { Project } from "@/app/types/project";
import CreateTaskForm from "./CreateTaskForm";

interface CreateTaskModalProps {
    project: Project;
    isOpen: boolean;
    initialSprintId?: string | null;
    onClose: () => void;
    onSubmit: () => void;
}

const CreateTaskModal = ({ project, isOpen, onClose, onSubmit, initialSprintId }: CreateTaskModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#17171F] shadow-2xl">
                <div className="flex items-start justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white"> Create task</h2>
                        <p className="mt-1 text-sm text-white/40"> Add a new task to{" "}{project.name}.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <CreateTaskForm
                    project={project}
                    onCancel={onClose}
                    onSubmit={onSubmit}
                    initialSprintId={initialSprintId}
                />
            </div>
        </div>
    );
};
export default CreateTaskModal;