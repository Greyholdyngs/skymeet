
"use client";

import { X, ExternalLink, Download, FileText } from "lucide-react";
import type { ProjectDocument } from "../types";

interface DocumentDetailsProps {
    document: ProjectDocument;
    onClose: () => void;
    onDownload: (document: ProjectDocument) => void;
}

const DocumentDetails = ({ document, onClose, onDownload, }: DocumentDetailsProps) => {
    const isLink = document.resourceType === "link";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl border theme-border theme-surface p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                            {isLink ? ( <ExternalLink size={20} /> ) : ( <FileText size={20} /> )}
                        </div>
                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-semibold theme-text"> {document.title} </h2>
                            <p className="mt-1 text-xs capitalize theme-text-muted"> {document.type} · {document.resourceType} </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 theme-text-secondary transition hover:bg-(--surface-hover) hover:text-(--text-primary)"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="mb-1 text-xs font-medium theme-text-muted"> Description </p>
                        <p className="whitespace-pre-wrap text-sm theme-text-secondary"> {document.description || "No description provided."} </p>
                    </div>
                    {isLink ? (
                        <div>
                            <p className="mb-1 text-xs font-medium theme-text-muted"> External URL </p>
                            <p className="break-all text-sm text-cyan-500"> {document.externalUrl} </p>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-1 text-xs font-medium theme-text-muted"> File </p>
                            <p className="text-sm theme-text-secondary"> {document.originalFileName || "Uploaded file"} </p>
                        </div>
                    )}
                    <div>
                        <p className="mb-1 text-xs font-medium theme-text-muted"> Last updated </p>
                        <p className="text-sm theme-text-secondary"> {new Date(document.updatedAt).toLocaleString()} </p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 border-t theme-border-subtle pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm theme-text-secondary transition hover:bg-(--surface-hover)"
                    >
                        Close
                    </button>
                    {isLink ? (
                        <a
                            href={document.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
                        >
                            Open link
                            <ExternalLink size={15} />
                        </a>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onDownload(document)}
                            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
                        >
                            Download file
                            <Download size={15} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentDetails;
