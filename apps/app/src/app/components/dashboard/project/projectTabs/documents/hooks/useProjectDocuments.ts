"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDocumentLink, deleteProjectDocument, getDocumentDownloadUrl, getProjectDocuments,
        updateProjectDocument, uploadDocumentFile } from "../document-service";

import type { CreateDocumentInput, ProjectDocument, UpdateDocumentInput } from "../types";
import { queryKeys } from "@/app/lib/queries/query-key";

export function useProjectDocuments(projectId: string) {
    const queryClient = useQueryClient();

    const documentsQuery = useQuery({
        queryKey: queryKeys.projects.documents(projectId),
        enabled: Boolean(projectId),
        queryFn: () => getProjectDocuments(projectId),
    });

    const invalidateDocuments = () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.documents(projectId),});

    const addLinkMutation = useMutation({
        mutationFn: ( input: CreateDocumentInput & { externalUrl: string },) => createDocumentLink(projectId, input),
        onSuccess: invalidateDocuments,
    });

    const uploadFileMutation = useMutation({
        mutationFn: ({ input, file,}: { input: CreateDocumentInput; file: File }) => uploadDocumentFile(projectId, input, file),
        onSuccess: invalidateDocuments,
    });

    const updateDocumentMutation = useMutation({
        mutationFn: ({ documentId, input, }: { documentId: string; input: UpdateDocumentInput; }) => updateProjectDocument(projectId, documentId, input),
        onSuccess: invalidateDocuments,
    });

    const deleteDocumentMutation = useMutation({
        mutationFn: (documentId: string) => deleteProjectDocument(projectId, documentId),
        onSuccess: invalidateDocuments,
    });

    const addLink = ( input: CreateDocumentInput & { externalUrl: string } ) => addLinkMutation.mutateAsync(input);
    const uploadFile = ( input: CreateDocumentInput, file: File ) => uploadFileMutation.mutateAsync({ input, file });
    const updateDocument = ( documentId: string, input: UpdateDocumentInput ) => updateDocumentMutation.mutateAsync({ documentId, input });

    const deleteDocument = (documentId: string) => deleteDocumentMutation.mutateAsync(documentId);
    const getDownloadUrl = (documentId: string) => getDocumentDownloadUrl(projectId, documentId);

    return {
        documents: documentsQuery.data ?? [],
        isLoading: documentsQuery.isPending,
        error: documentsQuery.error instanceof Error ? documentsQuery.error.message : null,
        refresh: documentsQuery.refetch,
        addLink,
        uploadFile,
        updateDocument,
        deleteDocument,
        getDownloadUrl,
    };
}
