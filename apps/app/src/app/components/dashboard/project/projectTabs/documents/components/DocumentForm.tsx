
"use client";

import { useState, type FormEvent } from "react";
import { X, Upload, Link as LinkIcon } from "lucide-react";
import type { CreateDocumentInput, DocumentType, ProjectDocument } from "../types";

interface DocumentFormProps {
    document?: ProjectDocument | null;
    onClose: () => void;
    onSubmit: ( input: CreateDocumentInput, resource: { file?: File; externalUrl?: string } ) => Promise<void>;
}

const categories: { label: string; value: DocumentType }[] = [
    { label: "Document", value: "document" },
    { label: "Design", value: "design" },
    { label: "Notes", value: "notes" },
    { label: "Technical", value: "technical" },
];

const DocumentForm = ({ document, onClose, onSubmit }: DocumentFormProps) => {
    const isEditing = Boolean(document);

    const [resourceType, setResourceType] = useState<"file" | "link">( document?.resourceType ?? "file");
    const [title, setTitle] = useState(document?.title ?? "");
    const [description, setDescription] = useState(document?.description ?? "");

    const [type, setType] = useState<DocumentType>(document?.type ?? "document");
    const [externalUrl, setExternalUrl] = useState(document?.externalUrl ?? "");
    const [file, setFile] = useState<File | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fieldClass = "w-full rounded-lg border theme-border theme-surface-elevated px-3 py-2.5 text-sm theme-text outline-none placeholder:text-[var(--text-muted)] focus:border-cyan-500/50";

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Enter a resource title.");
            return;
        }

        if (!isEditing && resourceType === "file" && !file) {
            setError("Select a file to upload.");
            return;
        }

        if (!isEditing && resourceType === "link" && !externalUrl.trim()) {
            setError("Enter an external link.");
            return;
        }

        if (file && file.size > 10 * 1024 * 1024) {
            setError("File size must not exceed 10 MB.");
            return;
        }

        setIsSaving(true);

        try {
            await onSubmit(
                {
                    title: title.trim(),
                    description: description.trim(),
                    type,
                },
                {
                    file: isEditing ? undefined : file ?? undefined,
                    externalUrl: isEditing ? undefined : resourceType === "link" ? externalUrl.trim()  : undefined,
                }
            );

            onClose();
        } catch (err) {
            setError( err instanceof Error ? err.message : "Unable to save this resource." );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <form
                onSubmit={handleSubmit}
                className="max-h-[90vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl border theme-border theme-surface p-6 shadow-2xl"
            >
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold theme-text"> {isEditing ? "Edit resource" : "Add resource"} </h2>
                        <p className="mt-1 text-xs theme-text-muted"> Manage files and external project links. </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 theme-text-secondary transition hover:bg-(--surface-hover) hover:text-(--text-primary)"
                    >
                        <X size={18} />
                    </button>
                </div>
                {!isEditing && (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setResourceType("file")}
                            className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition ${
                                resourceType === "file" ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-500"
                                    : "theme-border theme-text-secondary hover:bg-(--surface-hover)" }`}
                        >
                            <Upload size={16} />
                            Upload file
                        </button>
                        <button
                            type="button"
                            onClick={() => setResourceType("link")}
                            className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition ${
                                resourceType === "link" ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-500"
                                    : "theme-border theme-text-secondary hover:bg-(--surface-hover)" }`}
                        >
                            <LinkIcon size={16} />
                            External link
                        </button>
                    </div>
                )}
                <div className="space-y-2">
                    <label className="block text-xs font-medium theme-text-secondary"> Title </label>
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        maxLength={150}
                        required
                        placeholder="e.g. Project requirements"
                        className={fieldClass}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-medium theme-text-secondary"> Category </label>
                    <select
                        value={type}
                        onChange={(event) => setType(event.target.value as DocumentType)}
                        className={fieldClass}
                    >
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-medium theme-text-secondary"> Description </label>
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        maxLength={1000}
                        rows={3}
                        placeholder="Add some context..."
                        className={`${fieldClass} resize-none`}
                    />
                </div>
                {!isEditing && resourceType === "file" && (
                    <div className="space-y-2">
                        <label className="block text-xs font-medium theme-text-secondary">
                            File
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                            className="block w-full text-sm theme-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-(--surface-hover) file:px-3 file:py-2 file:text-xs file:text-(--text-primary)"
                        />
                        <p className="text-xs theme-text-muted"> PDF, DOCX, XLSX, PNG or JPG. Maximum 10 MB. </p>
                    </div>
                )}
                {!isEditing && resourceType === "link" && (
                    <div className="space-y-2">
                        <label className="block text-xs font-medium theme-text-secondary">  External URL </label>
                        <input
                            type="url"
                            value={externalUrl}
                            onChange={(event) =>
                                setExternalUrl(event.target.value)
                            }
                            required
                            placeholder="https://..."
                            className={fieldClass}
                        />
                    </div>
                )}
                {error && ( <p role="alert" className="text-sm text-red-500"> {error} </p> )}
                <div className="flex justify-end gap-3 border-t theme-border-subtle pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-lg px-4 py-2 text-sm theme-text-secondary transition hover:bg-(--surface-hover)"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-medium text-black transition hover:bg-cyan-400 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : isEditing ? "Save changes" : "Add resource"}
                    </button>
                </div>
            </form>
        </div>
    );
}
export default DocumentForm
