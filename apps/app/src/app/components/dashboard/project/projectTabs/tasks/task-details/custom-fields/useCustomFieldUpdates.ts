"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { apiFetch } from "@/app/lib/api";

interface UseCustomFieldUpdatesProps {
    projectId: string;
    taskId: string;
    onUpdated: ( fieldId: string, update: { value: string } | { itemId: string; completed: boolean } ) => void;
}

type CustomFieldUpdate = | { value: string } | { itemId: string; completed: boolean };

interface UpdateVariables {
    fieldId: string;
    payload: CustomFieldUpdate;
}

export const useCustomFieldUpdates = ({ projectId, taskId, onUpdated }: UseCustomFieldUpdatesProps) => {
    const savingKeysRef = useRef(new Set<string>());
    const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
    const [error, setError] = useState("");

    const updateMutation = useMutation({
        mutationFn: ({ fieldId, payload }: UpdateVariables) =>
            apiFetch(
                `/projects/${projectId}/tasks/${taskId}/custom-fields/${fieldId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                },
            ),
    });

    const updateField = async ( fieldId: string, key: string, payload: CustomFieldUpdate ) => {
        if (savingKeysRef.current.has(key)) return;

        savingKeysRef.current.add(key);
        setSavingKeys(new Set(savingKeysRef.current));
        setError("");

        try {
            await updateMutation.mutateAsync({ fieldId, payload });
            onUpdated(fieldId, payload);
        } catch (err) {
            setError( err instanceof Error ? err.message : "Unable to update custom field.",);

        } finally {
            savingKeysRef.current.delete(key);
            setSavingKeys(new Set(savingKeysRef.current));
        }
    };

    return { updateField, savingKeys, error };
};

