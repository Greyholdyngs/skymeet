
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

import InputField from "@/app/components/ui/InputField";
import type { CreateProjectData, Project } from "@/app/types/project";
import { apiFetch } from "@/app/lib/api";
import { queryKeys } from "@/app/lib/queries/query-key";

const CreateProjectForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createProjectMutation = useMutation({
        mutationFn: (data: CreateProjectData) =>
            apiFetch<Project>("/projects", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: async (createdProject) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() }),
                queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
            ]);

            router.push(`/dashboard/projects/${createdProject._id}`);
        },
    });

    const [formData, setFormData] = useState<CreateProjectData>({ name: "", description: "", });
    const [error, setError] = useState({ name: "", description: "",});

    const [checkingName, setCheckingName] = useState(false);
    const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);

    const checkProjectName = async (name: string) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setNameAvailable(null);
            return;
        }

        setCheckingName(true);

        await new Promise((resolve) => setTimeout(resolve, 500));

        setNameAvailable(true);
        setCheckingName(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setFormData((prev) => ({ ...prev, name: value, }));
        setError((prev) => ({ ...prev, name: "", }));

        setNameAvailable(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = { name: "", description: "",};

        if (!formData.name.trim()) {
            validationErrors.name = "Project name is required.";
        }

        if (formData.name.trim().length < 3) {
            validationErrors.name = "Project name must contain at least 3 characters.";
        }

        if (Object.values(validationErrors).some(Boolean)) {
            setError(validationErrors);
            return;
        }

        if (nameAvailable === false) {
            setError((prev) => ({ ...prev, name: "This project name is already in use.", }));
            return;
        }

        createProjectMutation.mutate(
            {
                name: formData.name.trim(),
                description: formData.description.trim(),
            },
            {
                onError: (error) => {
                    setError((prev) => ({
                        ...prev,
                        name: error instanceof Error ? error.message : "Unable to create project",
                    }));
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="border-b theme-border pb-6">
                <h2 className="text-lg font-semibold theme-text"> Project informatio </h2>
                <p className="mt-1 text-sm leading-6 theme-text-secondary"> Give your project a name and a short description so your team knows what it is about. </p>
            </div>
            <div className="space-y-6 py-6">
                <div>
                    <InputField
                        label="Project name"
                        type="text"
                        value={formData.name}
                        placeholder="e.g. SkyMeet Mobile App"
                        error={error.name}
                        onChange={handleNameChange}
                    />
                    <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-xs theme-text-muted"> Choose a clear name that your team will recognize. </p>
                        {formData.name.trim() && (
                        <button
                            type="button"
                            onClick={() => checkProjectName(formData.name)}
                            disabled={checkingName}
                            className="shrink-0 text-xs font-semibold text-[#A78BFA] transition hover:text-[#7C3AED] disabled:opacity-50"
                        >
                            {checkingName ? "Checking..." : "Check availability"}
                        </button>
                        )}
                    </div>
                    {checkingName && (
                        <div className="mt-3 flex items-center gap-2 text-xs theme-text-secondary">
                            <Loader2 size={14} className="animate-spin" />
                            Checking project name...
                        </div>
                    )}
                    {!checkingName && nameAvailable === true && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400">
                            <Check size={14} />
                            This project name is available.
                        </div>
                    )}
                    {!checkingName && nameAvailable === false && (
                        <p className="mt-3 text-xs font-medium text-red-500"> This project name is already being used. </p>
                    )}
                </div>
                <div>
                <label className="text-sm font-semibold theme-text"> Description </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => {
                        setFormData((prev) => ({ ...prev, description: e.target.value,}));
                        setError((prev) => ({ ...prev, description: "", }));
                    }}
                    placeholder="What are you building?"
                    rows={5}
                    className={`mt-2 w-full resize-none rounded-2xl border theme-surface-elevated px-4 py-3 text-sm theme-text outline-none transition placeholder:opacity-50 ${
                                error.description ? "border-red-500" : "theme-border focus:border-[#7C3AED]"}`}
                />
                {error.description && (
                    <p className="mt-2 text-sm text-red-500"> {error.description} </p>
                )}
                </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t theme-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold theme-text-secondary transition theme-surface-hover"
                >
                    <ArrowLeft size={16} />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={createProjectMutation.isPending || nameAvailable === false}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {createProjectMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                    {createProjectMutation.isPending ? "Creating project..." : "Create project"}
                </button>
            </div>
        </form>
    );
};

export default CreateProjectForm;
