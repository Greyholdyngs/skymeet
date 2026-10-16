
"use client";

import { useMemo, useState } from "react";
import { FileText, FileCode2, Image as ImageIcon, NotebookPen, Search, Plus, MoreHorizontal, X, Eye, Pencil, Trash2, FolderOpen, } from "lucide-react";
import type { Project } from "@/app/types/project";

interface ProjectDocumentsProps {
    project: Project;
}

type DocumentType =
    | "document"
    | "design"
    | "notes"
    | "technical";

interface ProjectDocument {
    id: string;
    title: string;
    description: string;
    type: DocumentType;
    updatedAt: string;
}

const initialDocuments: ProjectDocument[] = [
    {
        id: "1",
        title: "Project Requirements",
        description: "Requirements, scope, and key objectives for this project.",
        type: "document",
        updatedAt: "Today",
    },
    {
        id: "2",
        title: "UI Design Guidelines",
        description: "Design references, components, and interface guidelines.",
        type: "design",
        updatedAt: "Yesterday",
    },
    {
        id: "3",
        title: "API Documentation",
        description: "API routes, request formats, and response details.",
        type: "technical",
        updatedAt: "Sep 28, 2026",
    },
    {
        id: "4",
        title: "Meeting Notes",
        description: "Notes and action items from the latest project meeting.",
        type: "notes",
        updatedAt: "Sep 26, 2026",
    },
];

const typeLabels: Record<DocumentType, string> = {
    document: "Document",
    design: "Design",
    notes: "Notes",
    technical: "Technical",
};

const ProjectDocuments = ({ project }: ProjectDocumentsProps) => {
    const [documents, setDocuments] = useState<ProjectDocument[]>(initialDocuments);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<ProjectDocument | null>(null);
    const [editingDocument, setEditingDocument] = useState<ProjectDocument | null>(null);

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [type, setType] = useState<DocumentType>("document");
    const filteredDocuments = useMemo(() => {
        return documents.filter((document) => {
            const matchesSearch = document.title.toLowerCase().includes(search.toLowerCase()) || document.description.toLowerCase().includes(search.toLowerCase());

            const matchesType = filter === "all" || document.type === filter;
            return matchesSearch && matchesType;
        });
    }, [documents, search, filter]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setType("document");
        setEditingDocument(null);
    };

    const closeForm = () => {
        setIsAddOpen(false);
        resetForm();
    };

    const openCreateForm = () => {
        resetForm();
        setIsAddOpen(true);
    };

    const openEditForm = (document: ProjectDocument) => {
        setEditingDocument(document);
        setTitle(document.title);
        setDescription(document.description);
        setType(document.type);
        setOpenMenuId(null);
        setIsAddOpen(true);
    };

    const handleSave = (event: React.FormEvent) => {
        event.preventDefault();

        const cleanTitle = title.trim();

        if (!cleanTitle) return;

        if (editingDocument) {
            setDocuments((current) =>
                current.map((document) =>
                    document.id === editingDocument.id
                        ? {
                              ...document,
                              title: cleanTitle,
                              description: description.trim(),
                              type,
                              updatedAt: "Just now",
                          }
                        : document,
                ),
            );
        } else {
            const newDocument: ProjectDocument = {
                id: crypto.randomUUID(),
                title: cleanTitle,
                description: description.trim(),
                type,
                updatedAt: "Just now",
            };

            setDocuments((current) => [
                newDocument,
                ...current,
            ]);
        }

        closeForm();
    };

    const handleDelete = (id: string) => {
        setDocuments((current) =>
            current.filter((document) => document.id !== id),
        );

        setOpenMenuId(null);

        if (selectedDocument?.id === id) {
            setSelectedDocument(null);
        }
    };

    const getIcon = (documentType: DocumentType) => {
        switch (documentType) {
            case "design":  return <ImageIcon size={18} />;
            case "technical": return <FileCode2 size={18} />;

            case "notes": return <NotebookPen size={18} />;
            default: return <FileText size={18} />;
        }
    };

    const getIconStyle = (documentType: DocumentType) => {
        switch (documentType) {
            case "design": return "bg-amber-400/10 text-amber-300";
            case "technical": return "bg-blue-400/10 text-blue-300";
            case "notes": return "bg-emerald-400/10 text-emerald-300";
            default: return "bg-violet-400/10 text-violet-300";
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Documents
                    </h2>
                    <p className="mt-1 text-sm text-white/40">
                        Manage project files and resources for{" "}
                        {project.name}.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openCreateForm}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
                >
                    <Plus size={16} />
                    Add document
                </button>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#14141B] px-3">
                    <Search size={16} className="text-white/30" />
                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search documents..."
                        className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/25"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(event) =>
                        setFilter(event.target.value)
                    }
                    className="rounded-lg border border-white/10 bg-[#14141B] px-3 py-2.5 text-sm text-white/70 outline-none"
                >
                    <option value="all">All types</option>
                    <option value="document">Documents</option>
                    <option value="design">Design</option>
                    <option value="notes">Notes</option>
                    <option value="technical">Technical</option>
                </select>
            </div>
            <div className="mt-5 overflow-visible rounded-2xl border border-white/10 bg-[#14141B]">
                <div className="grid grid-cols-[minmax(0,1fr)_120px_40px] gap-3 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-wide text-white/30 sm:px-5">
                    <span>Name</span>
                    <span className="hidden sm:block">Updated</span>
                    <span />
                </div>
                {filteredDocuments.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {filteredDocuments.map((document) => (
                            <div
                                key={document.id}
                                className="grid grid-cols-[minmax(0,1fr)_120px_40px] items-center gap-3 px-4 py-3 transition hover:bg-white/2.5 sm:px-5"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedDocument(document)
                                    }
                                    className="flex min-w-0 items-center gap-3 text-left"
                                >
                                    <span
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getIconStyle(document.type)}`}
                                    >
                                        {getIcon(document.type)}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-medium text-white">
                                            {document.title}
                                        </span>
                                        <span className="mt-1 block truncate text-xs text-white/35">
                                            {typeLabels[document.type]}
                                        </span>
                                    </span>
                                </button>
                                <span className="hidden text-xs text-white/40 sm:block">
                                    {document.updatedAt}
                                </span>
                                <div className="relative flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setOpenMenuId(openMenuId === document.id ? null : document.id)}
                                        aria-label={`Actions for ${document.title}`}
                                        className="rounded-md p-2 text-white/40 hover:bg-white/5 hover:text-white"
                                    >
                                        <MoreHorizontal size={17} />
                                    </button>
                                    {openMenuId === document.id && (
                                        <div className="absolute right-0 top-10 z-20 w-40 rounded-lg border border-white/10 bg-[#20202A] p-1 shadow-xl">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDocument(document);
                                                    setOpenMenuId(null);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-white/70 hover:bg-white/5 hover:text-white"
                                            >
                                                <Eye size={14} />
                                                View details
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditForm(document)
                                                }
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-white/70 hover:bg-white/5 hover:text-white"
                                            >
                                                <Pencil size={14} />
                                                Rename / edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(document.id)
                                                }
                                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-red-400 hover:bg-red-400/10"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center px-6 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white/30">
                            <FolderOpen size={22} />
                        </div>
                        <h3 className="mt-4 text-sm font-medium text-white">
                            No documents found
                        </h3>
                        <p className="mt-1 max-w-sm text-xs text-white/35">
                            {search || filter !== "all" ? "Try changing your search or filter." : "Add a document to keep project resources organized."}
                        </p>
                        {!search && filter === "all" && (
                            <button
                                type="button"
                                onClick={openCreateForm}
                                className="mt-4 text-sm font-medium text-violet-300 hover:text-violet-200"
                            >
                                Add your first document
                            </button>
                        )}
                    </div>
                )}
            </div>
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <form
                        onSubmit={handleSave}
                        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#17171F] p-5 shadow-2xl sm:p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {editingDocument ? "Edit document" : "Add document"}
                                </h3>
                                <p className="mt-1 text-sm text-white/40">
                                    Add a resource to this project.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm text-white/70">
                                    Title
                                </label>
                                <input
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    required
                                    minLength={2}
                                    placeholder="e.g. Product requirements"
                                    className="w-full rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-white/70">
                                    Category
                                </label>
                                <select
                                    value={type}
                                    onChange={(event) =>
                                        setType(
                                            event.target.value as DocumentType,
                                        )
                                    }
                                    className="w-full rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                                >
                                    <option value="document">Document</option>
                                    <option value="design">Design</option>
                                    <option value="notes">Notes</option>
                                    <option value="technical">Technical</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-white/70">
                                    Description
                                    <span className="ml-1 text-white/30">
                                        (optional)
                                    </span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value) }
                                    rows={4}
                                    placeholder="What is this document about?"
                                    className="w-full resize-none rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {editingDocument ? "Save changes" : "Add document"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {selectedDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#17171F] p-5 shadow-2xl sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <span
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getIconStyle(selectedDocument.type)}`}
                                >
                                    {getIcon(selectedDocument.type)}
                                </span>
                                <div className="min-w-0">
                                    <h3 className="truncate text-lg font-semibold text-white">
                                        {selectedDocument.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-white/40">
                                        {typeLabels[selectedDocument.type]}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedDocument(null)}
                                aria-label="Close details"
                                className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="mt-6 rounded-xl border border-white/5 bg-white/2 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-white/30"> Description</p>
                            <p className="mt-2 text-sm leading-6 text-white/70"> {selectedDocument.description || "No description provided."}</p>
                        </div>
                        <p className="mt-4 text-xs text-white/35"> Last updated: {selectedDocument.updatedAt}</p>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedDocument(null)}
                                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDocuments;