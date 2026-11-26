import { apiFetch } from "@/app/lib/api";
import type { CreateDocumentInput, ProjectDocument, UpdateDocumentInput } from "./types";

interface BackendDocument {
    _id: string;
    title: string;
    description?: string;
    type: ProjectDocument["type"];
    resourceType: ProjectDocument["resourceType"];
    externalUrl?: string;
    originalFileName?: string;
    mimeType?: string;
    fileSize?: number;
    createdAt: string;
    updatedAt: string;
}

function mapDocument(document: BackendDocument): ProjectDocument {
    return {
        id: document._id,
        title: document.title,
        description: document.description ?? "",
        type: document.type,
        resourceType: document.resourceType,
        externalUrl: document.externalUrl,
        originalFileName: document.originalFileName,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
    };
}

export async function getProjectDocuments( projectId: string ): Promise<ProjectDocument[]> {
    const documents = await apiFetch<BackendDocument[]>(
        `/projects/${projectId}/documents`,
    );

    return documents.map(mapDocument);
}

export async function createDocumentLink( projectId: string, input: CreateDocumentInput & { externalUrl: string },
                                        ): Promise<ProjectDocument> {
    const document = await apiFetch<BackendDocument>(
        `/projects/${projectId}/documents/links`,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );

    return mapDocument(document);
}

export async function uploadDocumentFile( projectId: string, input: CreateDocumentInput, file: File): Promise<ProjectDocument> {
    const formData = new FormData();

    formData.append("title", input.title);
    formData.append("description", input.description);
    formData.append("type", input.type);
    formData.append("file", file);

    const document = await apiFetch<BackendDocument>(
        `/projects/${projectId}/documents/files`,
        {
            method: "POST",
            body: formData,
        },
    );

    return mapDocument(document);
}

export async function updateProjectDocument( projectId: string, documentId: string, input: UpdateDocumentInput): Promise<ProjectDocument> {
    const document = await apiFetch<BackendDocument>(
        `/projects/${projectId}/documents/${documentId}`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
        },
    );

    return mapDocument(document);
}

export async function deleteProjectDocument( projectId: string, documentId: string ): Promise<void> {
    await apiFetch<void>(
        `/projects/${projectId}/documents/${documentId}`,
        { method: "DELETE" },
    );
}

export async function getDocumentDownloadUrl( projectId: string, documentId: string ): Promise<string> {
    const result = await apiFetch<{ url: string }>(
        `/projects/${projectId}/documents/${documentId}/download`,
    );

    return result.url;
}