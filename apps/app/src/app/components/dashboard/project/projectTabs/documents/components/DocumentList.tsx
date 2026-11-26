
"use client";

import { FileText, FileCode2, Image as ImageIcon, NotebookPen, ExternalLink, Download, Pencil,
    Trash2, FolderOpen,
} from "lucide-react";
import type { ProjectDocument } from "../types";

interface DocumentListProps {
    documents: ProjectDocument[];
    isLoading: boolean;
    onOpen: (document: ProjectDocument) => void;
    onDownload: (document: ProjectDocument) => void;
    onEdit: (document: ProjectDocument) => void;
    onDelete: (document: ProjectDocument) => void;
}

function getDocumentIcon(document: ProjectDocument) {
    if (document.resourceType === "link") return ExternalLink;
    if (document.mimeType?.startsWith("image/")) return ImageIcon;

    switch (document.type) {
        case "design":
            return ImageIcon;
        case "notes":
            return NotebookPen;
        case "technical":
            return FileCode2;
        default:
            return FileText;
    }
}

function formatFileSize(bytes?: number) {
    if (!bytes) return "";

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const DocumentList = ({ documents, isLoading, onOpen, onDownload, onEdit, onDelete, }: DocumentListProps) => {
    if (isLoading) {
        return (
            <div className="py-16 text-center text-sm theme-text-muted"> Loading project resources... </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed theme-border py-16 text-center">
                <FolderOpen size={32} className="mb-3 theme-text-muted" />
                <p className="text-sm font-medium theme-text">
                    No resources found
                </p>
                <p className="mt-1 text-xs theme-text-muted">
                    Upload a file or add an external link to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border theme-border theme-surface">
            <div className="hidden grid-cols-[minmax(0,1fr)_120px_130px_140px] gap-4 border-b theme-border theme-surface-elevated px-5 py-3 text-xs theme-text-muted md:grid">
                <span>Resource</span>
                <span>Category</span>
                <span>Last updated</span>
                <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-(--border-subtle)">
                {documents.map((document) => {
                    const Icon = getDocumentIcon(document);

                    return (
                        <div
                            key={document.id}
                            className="grid grid-cols-1 gap-3 px-4 py-4 transition hover:bg-(--surface-hover) md:grid-cols-[minmax(0,1fr)_120px_130px_140px] md:items-center md:gap-4 md:px-5"
                        >
                            <button
                                type="button"
                                onClick={() => onOpen(document)}
                                className="flex min-w-0 items-center gap-3 text-left"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                                    <Icon size={19} />
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-medium theme-text"> {document.title} </span>
                                    <span className="mt-1 block truncate text-xs theme-text-muted">
                                        {document.resourceType === "link" ? document.externalUrl : [
                                                  document.originalFileName, formatFileSize(document.fileSize),].filter(Boolean).join(" · ")}
                                    </span>
                                </span>
                            </button>
                            <span className="text-xs capitalize theme-text-secondary"> {document.type} </span>
                            <span className="text-xs theme-text-muted"> {formatDate(document.updatedAt)} </span>
                            <div className="flex items-center gap-2 md:justify-end">
                                {document.resourceType === "file" ? (
                                    <button
                                        type="button"
                                        onClick={() => onDownload(document)}
                                        title="Download"
                                        className="rounded-md p-2 theme-text-secondary transition hover:bg-(--surface-hover) hover:theme-text"
                                    >
                                        <Download size={15} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => onOpen(document)}
                                        title="Open link"
                                        className="rounded-md p-2 theme-text-secondary transition hover:bg-(--surface-hover) hover:theme-text"
                                    >
                                        <ExternalLink size={15} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onEdit(document)}
                                    title="Edit"
                                    className="rounded-md p-2 theme-text-secondary transition hover:bg-(--surface-hover) hover:theme-text"
                                >
                                    <Pencil size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(document)}
                                    title="Delete"
                                    className="rounded-md p-2 theme-text-secondary transition hover:bg-red-500/10 hover:text-red-500"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DocumentList;
