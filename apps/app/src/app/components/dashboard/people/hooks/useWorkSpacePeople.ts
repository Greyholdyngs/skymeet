"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";

import { queryKeys } from "@/app/lib/queries/query-key";
import type { WorkspacePerson } from "../types";

export const useWorkspacePeople = () => {
    const [search, setSearch] = useState("");

    const { data: people = [], isPending, error, } = useQuery({
        queryKey: queryKeys.people.workspace(),
        queryFn: () => apiFetch<WorkspacePerson[]>("/users/people"),
    });

    const filteredPeople = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return people;

        return people.filter(({ user, sharedProjects }) => {
            const name = `${user.firstName} ${user.lastName}`.toLowerCase();

            return (
                name.includes(query) ||
                user.userName?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                sharedProjects.some((project) => project.projectName.toLowerCase().includes(query), )
            );
        });
    }, [people, search]);

    return {
        people,
        filteredPeople,
        search,
        setSearch,
        loading: isPending,
        error: error instanceof Error ? error.message : "",
    };
};
