
"use client";

import { useEffect, useState } from "react";
import { Loader2, X, Mail, CalendarClock } from "lucide-react";

import { getPendingProjectInvitation, respondToProjectInvitation, type PendingProjectInvitation,
    type InvitationAction,} from "@/app/lib/invitation/invitation-service";

interface ProjectInvitationModalProps {
    projectId: string;
    onClose: () => void;
    onAccepted: (projectId: string) => void;
}

const ProjectInvitationModal = ({ projectId, onClose, onAccepted,}: ProjectInvitationModalProps) => {
    const [invitation, setInvitation] = useState<PendingProjectInvitation | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<InvitationAction | null>(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadInvitation() {
            try {
                setLoading(true);
                setError(null);

                const data = await getPendingProjectInvitation(projectId);

                if (!cancelled) {
                    setInvitation(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError( err instanceof Error ? err.message : "Unable to load this invitation.",);
                }

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadInvitation();

        return () => {
            cancelled = true;
        };
    }, [projectId]);

    const handleResponse = async (action: InvitationAction) => {
        if (!invitation || submitting) return;

        setSubmitting(action);
        setError(null);

        try {
            const result = await respondToProjectInvitation(
                invitation.id,
                action,
            );

            if (action === "accept") {
                onAccepted(result.projectId ?? invitation.projectId);
                return;
            }

            onClose();
        } catch (err) {
            setError( err instanceof Error ? err.message : "Unable to respond to this invitation. Please try again.",);

        } finally {
            setSubmitting(null);
        }
    };

    return (
            <div
                className="fixed z-60 grid h-dvh w-screen place-items-center overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-sm"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget && !submitting) {
                        onClose();
                    }
                }}
            >
                <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-invitation-title"
                    className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#15151f] p-6 shadow-2xl"
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={!!submitting}
                        aria-label="Close invitation"
                        className="absolute right-4 top-4 rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                    >
                        <X size={18} />
                    </button>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                        <Mail size={22} />
                    </div>
                    <h2
                        id="project-invitation-title"
                        className="text-xl font-semibold text-white"
                    >
                        Project invitation
                    </h2>
                    {loading ? (
                        <div className="flex flex-col items-center gap-3 py-10 text-white/50">
                            <Loader2 className="animate-spin" size={24} />
                            <p className="text-sm">Loading invitation...</p>
                        </div>
                    ) : error && !invitation ? (
                        <div className="mt-5 space-y-4">
                            <p className="text-sm leading-6 text-red-400">{error}</p>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                            >
                                Close
                            </button>
                        </div>
                    ) : invitation ? (
                        <>
                            <p className="mt-3 text-sm leading-6 text-white/60"> You have been invited to join a project on SkyMeet. </p>
                            <div className="mt-6 space-y-4 rounded-xl border border-white/10 bg-white/3 p-4">
                                <div>
                                    <p className="text-xs text-white/40">Project </p>
                                    <p className="mt-1 font-medium text-white"> {invitation.projectName} </p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40"> Invited by </p>
                                    <p className="mt-1 text-sm text-white">
                                        {invitation.inviter.firstName}{" "}
                                        {invitation.inviter.lastName}
                                    </p>
                                    <p className="text-xs text-white/40"> @{invitation.inviter.userName} </p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40"> Your role </p>
                                    <p className="mt-1 text-sm text-white"> {invitation.role.replaceAll("_", " ")} </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/40">
                                    <CalendarClock size={14} />
                                    Expires{" "} {new Date(invitation.expiresAt).toLocaleDateString()}
                                </div>
                            </div>
                            {error && (
                                <p className="mt-4 text-sm text-red-400">{error}</p>
                            )}
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => void handleResponse("decline")}
                                    disabled={!!submitting}
                                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 disabled:opacity-50"
                                >
                                    {submitting === "decline" ? (<Loader2 className="mx-auto animate-spin" size={18} />) : ( "Decline")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => void handleResponse("accept")}
                                    disabled={!!submitting}
                                    className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
                                >
                                    {submitting === "accept" ? ( <Loader2 className="mx-auto animate-spin" size={18} /> ) : ( "Accept invitation")}
                                </button>
                            </div>
                        </>
                    ) : null}
                </section>
            </div>
    );
};

export default ProjectInvitationModal;
