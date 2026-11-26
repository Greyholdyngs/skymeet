"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AtSign, LoaderCircle, Mail, X } from "lucide-react";

import { apiFetch } from "@/app/lib/api";
import { queryKeys } from "@/app/lib/queries/query-key";
import type { InviteMethod, InviteUser } from "./project/members/types";

interface UserSearchSelectorProps {
    method: InviteMethod;
    value: string;
    selectedUser: InviteUser | null;
    disabled?: boolean;
    onChange: (value: string) => void;
    onSelect: (user: InviteUser) => void;
    onClearSelection: () => void;
}

const UserSearchSelector = ({ method, value, selectedUser, disabled = false, onChange, onSelect,
                            onClearSelection, }: UserSearchSelectorProps) => {

    const query = value.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);
    const isValidSearch = method === "username" ? query.length >= 2 : isValidEmail;

    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    const searchEnabled = !selectedUser && isValidSearch && debouncedQuery === query;

    const usersQuery = useQuery({
        queryKey: queryKeys.users.inviteDirectory(debouncedQuery, method),
        queryFn: () => {
            const type = method === "email" ? "&type=email" : "";

            return apiFetch<InviteUser[]>(
                `/users/directory?q=${encodeURIComponent(debouncedQuery)}${type}`,
            );
        },
        enabled: searchEnabled,
    });

    const results = searchEnabled ? usersQuery.data ?? [] : [];
    const searching = !selectedUser && isValidSearch && (debouncedQuery !== query || usersQuery.isFetching);
    const showEmptyState = searchEnabled && usersQuery.isFetched && !usersQuery.isFetching && results.length === 0;

    return (
        <div>
            <label
                htmlFor="invite-identifier"
                className="mb-2 block text-sm font-medium theme-text-secondary"
            >
                {method === "email" ? "Email address" : "Username"}
            </label>
            <div className="relative">
                {method === "email" ? (
                    <Mail
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"
                    />
                ) : (
                    <AtSign
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"
                    />
                )}
                <input
                    id="invite-identifier"
                    type={method === "email" ? "email" : "text"}
                    value={value}
                    onChange={(event) => {
                        onClearSelection();
                        onChange(event.target.value);
                    }}
                    placeholder={ method === "email" ? "name@example.com" : "Search by name or username" }
                    autoComplete="off"
                    maxLength={method === "email" ? 254 : 30}
                    disabled={disabled}
                    className="w-full rounded-xl border theme-border theme-surface-elevated py-3 pl-10 pr-3 text-sm theme-text outline-none placeholder:theme-text-muted focus:border-[#7C3AED]/60 disabled:opacity-50"
                />
            </div>
            {searching && (
                <p className="mt-2 flex items-center gap-2 text-xs theme-text-muted">
                    <LoaderCircle size={13} className="animate-spin" />
                    Searching users...
                </p>
            )}
            {results.length > 0 && !selectedUser && (
                <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border theme-border theme-surface-elevated">
                    {results.map((user) => (
                        <button
                            key={user._id}
                            type="button"
                            onClick={() => onSelect(user)}
                            className="flex w-full items-center gap-3 border-b theme-border-subtle p-3 text-left transition last:border-0 hover:theme-surface-hover"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/15 text-sm font-semibold text-[#A78BFA]">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium theme-text"> {user.firstName} {user.lastName} </p>
                                <p className="truncate text-xs theme-text-muted"> @{user.userName} </p>
                                {user.email && ( <p className="truncate text-xs theme-text-muted"> {user.email} </p> )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {selectedUser && (
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/20 text-sm font-semibold text-[#A78BFA]">
                        {selectedUser.firstName.charAt(0)}
                        {selectedUser.lastName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium theme-text"> {selectedUser.firstName} {selectedUser.lastName} </p>
                        <p className="truncate text-xs theme-text-secondary"> @{selectedUser.userName} </p>
                        {selectedUser.email && ( <p className="truncate text-xs theme-text-muted"> {selectedUser.email} </p> )}
                    </div>
                    <button
                        type="button"
                        onClick={onClearSelection}
                        disabled={disabled}
                        aria-label="Clear selected user"
                        className="rounded-lg p-1.5 theme-text-muted hover:theme-surface-hover hover:theme-text"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}
            {showEmptyState && (
                <p className="mt-2 text-xs theme-text-muted">
                    {method === "email" ? "No existing account found. You can still invite this email address." : "No matching users found."}
                </p>
            )}
        </div>
    );
};

export default UserSearchSelector;

