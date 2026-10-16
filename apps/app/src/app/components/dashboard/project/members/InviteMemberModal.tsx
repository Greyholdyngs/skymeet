"use client";

import { FormEvent, useEffect, useState } from "react";
import { AtSign, FolderKanban, LoaderCircle, Mail, UserPlus, X } from "lucide-react";
import { InviteMemberInput, InviteProjectOption, InviteMethod } from "./types";


interface InviteMemberModalProps {
    isOpen: boolean;
    projects: InviteProjectOption[];
    projectId?: string;
    projectName?: string;
    onClose: () => void;
    onInvite: (input: InviteMemberInput) => Promise<void>;
}

const InviteMemberModal = ({ isOpen, projects, projectId, projectName, onClose, onInvite }: InviteMemberModalProps) => {
    const isProjectScoped = Boolean(projectId);
    const [selectedProjectId, setSelectedProjectId] = useState(projectId ?? "");
    const [method, setMethod] = useState<InviteMethod>("email");

    const [identifier, setIdentifier] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setSelectedProjectId(projectId ?? "");
        setMethod("email");
        setIdentifier("");
        setError("");
        setIsSubmitting(false);
    }, [isOpen, projectId]);

    if (!isOpen) return null;

    const selectedProject = projects.find((project) => project.id === selectedProjectId);
    const displayedProjectName = projectName ?? selectedProject?.name ?? "your project";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const value = identifier.trim();
        setError("");

        if (!selectedProjectId) {
            setError("Select a project for this invitation.");
            return;
        }

        if (!value) {
            setError( method === "email" ? "Enter the recipient's email address." : "Enter the recipient's username." );
            return;
        }

        if ( method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setError("Enter a valid email address.");
            return;
        }

        if (method === "username" && !/^[a-zA-Z0-9_.-]{1,30}$/.test(value.replace(/^@/, ""))) {
            setError("Enter a valid username.");
            return;
        }

        setIsSubmitting(true);

        try {
            await onInvite({
                projectId: selectedProjectId,
                method,
                identifier: method === "email" ? value.toLowerCase() : value.replace(/^@/, ""),
            });

            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "The invitation could not be sent. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if ( event.target === event.currentTarget && !isSubmitting) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="invite-member-title"
                className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#17171F] shadow-2xl"
            >
                <header className="flex items-start justify-between border-b border-white/10 p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/15">
                            <UserPlus size={19} className="text-[#B69AFF]" />
                        </div>
                        <div>
                            <h2
                                id="invite-member-title"
                                className="text-base font-semibold text-white"
                            >
                                Invite a member
                            </h2>
                            <p className="mt-1 text-sm text-white/45">
                                Add someone to collaborate on a project.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close invitation dialog"
                        className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                    >
                        <X size={18} />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="space-y-5 p-5">
                    {!isProjectScoped ? (
                        <div>
                            <label
                                htmlFor="invite-project"
                                className="mb-2 block text-sm font-medium text-white/75"
                            >
                                Project
                            </label>
                            <div className="relative">
                                <FolderKanban
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                                />
                                <select
                                    id="invite-project"
                                    value={selectedProjectId}
                                    onChange={(event) => setSelectedProjectId(event.target.value) }
                                    disabled={isSubmitting}
                                    className="w-full appearance-none rounded-xl border border-white/10 bg-[#111117] py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-[#7C3AED]/60"
                                >
                                    <option value="" className="bg-[#17171F]"> Select a project </option>
                                    {projects.map((project) => (
                                        <option
                                            key={project.id}
                                            value={project.id}
                                            className="bg-[#17171F]"
                                        >
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                            <FolderKanban
                                size={16}
                                className="shrink-0 text-white/40"
                            />
                            <span className="truncate text-sm text-white/75"> {displayedProjectName} </span>
                        </div>
                    )}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/75"> Invite using </label>
                        <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#111117] p-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setMethod("email");
                                    setIdentifier("");
                                    setError("");
                                }}
                                disabled={isSubmitting}
                                aria-pressed={method === "email"}
                                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm transition 
                                        ${ method === "email" ? "bg-[#292532] text-white" : "text-white/45 hover:text-white/75"}`}
                            >
                                <Mail size={15} />
                                Email
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMethod("username");
                                    setIdentifier("");
                                    setError("");
                                }}
                                disabled={isSubmitting}
                                aria-pressed={method === "username"}
                                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm transition
                                         ${ method === "username" ? "bg-[#292532] text-white" : "text-white/45 hover:text-white/75" }`}
                            >
                                <AtSign size={15} />
                                Username
                            </button>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="invite-identifier"
                            className="mb-2 block text-sm font-medium text-white/75"
                        >
                            {method === "email" ? "Email address" : "Username"}
                        </label>
                        <div className="relative">
                            {method === "email" ? (
                                <Mail
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                                />
                            ) : (
                                <AtSign
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                                />
                            )}
                            <input
                                id="invite-identifier"
                                type={method === "email" ? "email" : "text"}
                                value={identifier}
                                onChange={(event) => {
                                    setIdentifier(event.target.value);
                                    if (error) setError("");
                                }}
                                placeholder={ method === "email" ? "name@example.com" : "Enter username" }
                                autoComplete="off"
                                maxLength={method === "email" ? 254 : 30}
                                disabled={isSubmitting}
                                className="w-full rounded-xl border border-white/10 bg-[#111117] py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]/60"
                            />
                        </div>
                        <p className="mt-2 text-xs leading-5 text-white/40">
                            {method === "email" ? "An invitation email will be sent, even if the recipient hasn't registered yet."
                                : "We'll find the existing account and send the invitation to its registered email."}
                        </p>
                    </div>
                    {error && (
                        <p role="alert" className="text-sm text-red-400"> {error} </p>
                    )}
                    <footer className="flex justify-end gap-3 border-t border-white/5 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/65 transition hover:bg-white/5 disabled:opacity-40"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !identifier.trim()}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isSubmitting && (
                                <LoaderCircle
                                    size={15}
                                    className="animate-spin"
                                />
                            )}
                            {isSubmitting ? "Sending..." : "Send invitation"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
};

export default InviteMemberModal;