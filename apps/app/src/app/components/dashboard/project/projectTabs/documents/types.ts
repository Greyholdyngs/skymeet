export type DocumentType =
    | "document"
    | "design"
    | "notes"
    | "technical";

export type DocumentResourceType = "file" | "link";

export interface ProjectDocument {
    id: string;
    title: string;
    description: string;
    type: DocumentType;
    resourceType: DocumentResourceType;
    externalUrl?: string;
    originalFileName?: string;
    mimeType?: string;
    fileSize?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDocumentInput {
    title: string;
    description: string;
    type: DocumentType;
}

export interface UpdateDocumentInput {
    title?: string;
    description?: string;
    type?: DocumentType;
}