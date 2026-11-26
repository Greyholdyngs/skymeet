
"use client";

import { useState } from "react";

interface SprintFormProps {
    loading: boolean;
    onSubmit: (data: {
        name: string;
        description: string;
        startDate: string;
        endDate: string;
    }) => Promise<void>;
    onCancel: () => void;
}

const SprintForm = ({ loading, onSubmit, onCancel }: SprintFormProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim() || !startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
            setError("Enter valid sprint details and dates.");
            return;
        }

        setError("");

        await onSubmit({
            name: name.trim(),
            description: description.trim(),
            startDate,
            endDate,
        });
    };

    const inputClass = "w-full min-w-0 rounded-lg border theme-border theme-surface-elevated px-3 py-2.5 text-sm theme-text outline-none placeholder:theme-text-muted focus:border-[#7C3AED]";

    return (
        <form
            onSubmit={handleSubmit}
            className="min-w-0 space-y-4 rounded-xl border theme-border theme-surface p-4 sm:p-5"
        >
            <h3 className="font-semibold theme-text">Create a sprint</h3>
            {error && (
                <p role="alert" className="text-sm text-red-500"> {error} </p>
            )}
            <div>
                <label className="mb-2 block text-sm theme-text-secondary"> Sprint name </label>
                <input
                    required
                    maxLength={100}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Sprint 1"
                    className={inputClass}
                />
            </div>
            <div>
                <label className="mb-2 block text-sm theme-text-secondary"> Goal / Description </label>
                <textarea
                    maxLength={1000}
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What should this sprint achieve?"
                    className={`${inputClass} resize-y`}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                    <label className="mb-2 block text-sm theme-text-secondary"> Start date </label>
                    <input
                        required
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        className={inputClass}
                    />
                </div>
                <div className="min-w-0">
                    <label className="mb-2 block text-sm theme-text-secondary"> End date </label>
                    <input
                        required
                        type="date"
                        min={startDate || undefined}
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border theme-border px-4 py-2 text-sm theme-text-secondary transition hover:theme-surface-hover"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !name.trim() || !startDate || !endDate}
                    className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {loading ? "Creating..." : "Create sprint"}
                </button>
            </div>
        </form>
    );
};

export default SprintForm;
