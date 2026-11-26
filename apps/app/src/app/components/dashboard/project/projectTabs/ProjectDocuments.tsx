
"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/app/types/project";
import { useProjectDocuments } from "./documents/hooks/useProjectDocuments";

import DocumentsToolbar from "./documents/components/DocumentToolBar";
import DocumentList from "./documents/components/DocumentList";
import DocumentForm from "./documents/components/DocumentForm";

import DocumentDetails from "./documents/components/DocumentDetails";
import type { CreateDocumentInput, DocumentType, ProjectDocument } from "./documents/types";

interface ProjectDocumentsProps {
    project: Project;
}

const ProjectDocuments = ({ project }: ProjectDocumentsProps) => {
    const { documents, isLoading, error, addLink, uploadFile, updateDocument, deleteDocument,
            getDownloadUrl } = useProjectDocuments(project._id);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<DocumentType | "all">("all");
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [editingDocument, setEditingDocument] = useState<ProjectDocument | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<ProjectDocument | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const filteredDocuments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return documents.filter((document) => {
            const matchesSearch =
                document.title.toLowerCase().includes(query) ||
                document.description.toLowerCase().includes(query) ||
                document.originalFileName?.toLowerCase().includes(query) ||
                document.externalUrl?.toLowerCase().includes(query);

            const matchesFilter = filter === "all" || document.type === filter;

            return matchesSearch && matchesFilter;
        });
    }, [documents, search, filter]);

    const openCreateForm = () => {
        setEditingDocument(null);
        setActionError(null);
        setIsFormOpen(true);
    };

    const openEditForm = (document: ProjectDocument) => {
        setEditingDocument(document);
        setActionError(null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingDocument(null);
    };

    const handleSubmit = async ( input: CreateDocumentInput, resource: { file?: File; externalUrl?: string } ) => {
        setActionError(null);

        if (editingDocument) {
            const updated = await updateDocument( editingDocument.id, input );
            setSelectedDocument((current) => current?.id === updated.id ? updated : current );

            return;
        }

        if (resource.file) {
            await uploadFile(input, resource.file);
            return;
        }

        if (resource.externalUrl) {
            await addLink({
                ...input,
                externalUrl: resource.externalUrl,
            });

            return;
        }

        throw new Error("Select a file or provide an external link.");
    };

    const handleDelete = async (document: ProjectDocument) => {
        const confirmed = window.confirm( `Delete "${document.title}"? This action cannot be undone.`);

        if (!confirmed) return;

        setActionError(null);

        try {
            await deleteDocument(document.id);

            setSelectedDocument((current) => current?.id === document.id ? null : current);

        } catch (err) {
            setActionError( err instanceof Error ? err.message : "Unable to delete this resource.");
        }
    };

    const handleDownload = async (document: ProjectDocument) => {
        setActionError(null);

        try {
            const url = await getDownloadUrl(document.id);
            window.location.assign(url);

        } catch (err) {
            setActionError( err instanceof Error ? err.message : "Unable to download this file." );
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold theme-text"> Documents </h2>
                    <p className="mt-1 text-sm theme-text-secondary"> Manage project files and resources for {project.name}. </p>
                </div>
            </div>
            <div className="mt-6">
                <DocumentsToolbar
                    search={search}
                    onSearchChange={setSearch}
                    filter={filter}
                    onFilterChange={setFilter}
                    onAdd={openCreateForm}
                />
            </div>
            {error && (
                <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500"> {error} </p>
            )}
            {actionError && (
                <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500"> {actionError} </p>
            )}
            <div className="mt-5">
                <DocumentList
                    documents={filteredDocuments}
                    isLoading={isLoading}
                    onOpen={setSelectedDocument}
                    onDownload={handleDownload}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                />
            </div>
            {isFormOpen && (
                <DocumentForm
                    document={editingDocument}
                    onClose={closeForm}
                    onSubmit={handleSubmit}
                />
            )}
            {selectedDocument && (
                <DocumentDetails
                    document={selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                    onDownload={handleDownload}
                />
            )}
        </div>
    );
};

export default ProjectDocuments;
