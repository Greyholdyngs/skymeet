"use client";

import { FormEvent, useEffect, useState } from "react";
import { AtSign, FolderKanban, LoaderCircle, Mail, UserPlus, X } from "lucide-react";
import { InviteMemberInput, InviteProjectOption, InviteMethod, InviteRole, InviteUser } from "./types";

import UserSearchSelector from "../../UserSearchSelector";

interface InviteMemberModalProps {
    isOpen: boolean;
    projects: InviteProjectOption[];
    projectId?: string;
    projectName?: string;
    onClose: () => void;
    onInvite: (input: InviteMemberInput) => Promise<void>;
}

const InviteMemberModal = ({ isOpen, projects, projectId, projectName, onClose,
                            onInvite }: InviteMemberModalProps) => {

    const isProjectScoped = Boolean(projectId);
    const [selectedProjectId, setSelectedProjectId] = useState(projectId ?? "");
    const [method, setMethod] = useState<InviteMethod>("email");

    const [identifier, setIdentifier] = useState("");
    const [selectedUser, setSelectedUser] = useState<InviteUser | null>(null);
    const [role, setRole] = useState<InviteRole>("team_member");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setSelectedProjectId(projectId ?? "");
        setMethod("email");
        setIdentifier("");
        setError("");
        setIsSubmitting(false);
        setSelectedUser(null);
        setRole("team_member");
    }, [isOpen, projectId]);

    if (!isOpen) return null;

    const selectedProject = projects.find((project) => project.id === selectedProjectId,);
    const displayedProjectName =projectName ?? selectedProject?.name ?? "your project";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const value = identifier.trim();
        setError("");

        if (!selectedProjectId) {
            setError("Select a project for this invitation.");
            return;
        }

        if (!value) {
            setError(method === "email" ? "Enter the recipient's email address." : "Enter the recipient's username.",);

            return;
        }

        if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setError("Enter a valid email address.");
            return;
        }

        if (method === "username" && !selectedUser) {
            setError("Select a user from the search results.");
            return;
        }

        setIsSubmitting(true);

        try {
            await onInvite({
                projectId: selectedProjectId,
                method,
                identifier: method === "email" ? value.toLowerCase() : selectedUser!.userName,
                role,
            });

            onClose();
        } catch (err) {
            setError( err instanceof Error ? err.message : "The invitation could not be sent. Please try again.");

        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldClass = "w-full rounded-xl border theme-border theme-surface-elevated px-3 py-3 text-sm theme-text outline-none focus:border-[#7C3AED]/60 disabled:opacity-50";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm hide-scrollbar"
            onMouseDown={(event) => {
                if ( event.target === event.currentTarget && !isSubmitting ) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="invite-member-title"
                className="my-auto w-full max-w-md overflow-hidden rounded-2xl border theme-border theme-surface shadow-2xl"
            >
                <header className="flex items-start justify-between border-b theme-border p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/15">
                            <UserPlus size={19} className="text-[#A78BFA]" />
                        </div>
                        <div>
                            <h2
                                id="invite-member-title"
                                className="text-base font-semibold theme-text"
                            >
                                Invite a member
                            </h2>
                            <p className="mt-1 text-sm theme-text-secondary"> Add someone to collaborate on a project. </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close invitation dialog"
                        className="rounded-lg p-2 theme-text-muted transition hover:theme-surface-hover hover:theme-text disabled:opacity-40"
                    >
                        <X size={18} />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="space-y-5 p-5">
                    {!isProjectScoped ? (
                        <div>
                            <label
                                htmlFor="invite-project"
                                className="mb-2 block text-sm font-medium theme-text-secondary"
                            >
                                Project
                            </label>
                            <div className="relative">
                                <FolderKanban
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"
                                />
                                <select
                                    id="invite-project"
                                    value={selectedProjectId}
                                    onChange={(event) => setSelectedProjectId(event.target.value)}
                                    disabled={isSubmitting}
                                    className={`${fieldClass} appearance-none pl-10`}
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((project) => (
                                        <option
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 rounded-xl border theme-border theme-surface-elevated p-3">
                            <FolderKanban
                                size={16}
                                className="shrink-0 theme-text-muted"
                            />
                            <span className="truncate text-sm theme-text-secondary"> {displayedProjectName} </span>
                        </div>
                    )}
                    <div>
                        <label className="mb-2 block text-sm font-medium theme-text-secondary"> Invite using </label>
                        <div className="grid grid-cols-2 gap-2 rounded-xl theme-surface-elevated p-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setMethod("email");
                                    setIdentifier("");
                                    setError("");
                                    setSelectedUser(null);
                                }}
                                disabled={isSubmitting}
                                aria-pressed={method === "email"}
                                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                                    method === "email" ? "bg-[#7C3AED]/15 text-[#A78BFA]" : "theme-text-secondary hover:theme-text" }`}
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
                                    setSelectedUser(null);
                                }}
                                disabled={isSubmitting}
                                aria-pressed={method === "username"}
                                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                                    method === "username" ? "bg-[#7C3AED]/15 text-[#A78BFA]" : "theme-text-secondary hover:theme-text" }`}
                            >
                                <AtSign size={15} />
                                Username
                            </button>
                        </div>
                    </div>
                    <div>
                        <UserSearchSelector
                            method={method}
                            value={identifier}
                            selectedUser={selectedUser}
                            disabled={isSubmitting}
                            onChange={(value) => {
                                setIdentifier(value);
                                if (error) setError("");
                            }}
                            onSelect={(user) => {
                                setSelectedUser(user);
                                if (method === "username") {
                                    setIdentifier(user.userName);
                                }
                                setError("");
                            }}
                            onClearSelection={() => setSelectedUser(null)}
                        />

                        <p className="mt-2 text-xs leading-5 theme-text-muted">
                            {method === "email" ? "An invitation email will be sent, even if the recipient hasn't registered yet."
                                                : "Select an existing SkyMeet account to invite it to your project."}
                        </p>
                    </div>
                    <div>
                        <label
                            htmlFor="invite-role"
                            className="mb-2 block text-sm font-medium theme-text-secondary"
                        >
                            Member role
                        </label>
                        <select
                            id="invite-role"
                            value={role}
                            onChange={(event) => setRole(event.target.value as InviteRole)}
                            disabled={isSubmitting}
                            className={fieldClass}
                        >
                            <option value="team_member">Team Member</option>
                            <option value="admin">Admin</option>
                        </select>
                        <p className="mt-2 text-xs theme-text-muted"> Admins can help manage project members and invitations. </p>
                    </div>
                    {error && ( <p role="alert" className="text-sm text-red-400"> {error} </p>)}
                    <footer className="flex justify-end gap-3 border-t theme-border pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg border theme-border px-4 py-2.5 text-sm theme-text-secondary transition hover:theme-surface-hover disabled:opacity-40"
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