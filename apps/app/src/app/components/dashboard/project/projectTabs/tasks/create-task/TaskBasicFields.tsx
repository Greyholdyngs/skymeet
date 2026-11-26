"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import type { TaskPriority } from "../types/types";

interface TaskBasicFieldsProps {
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onDueDateChange: (value: string) => void;
    onPriorityChange: ( value: TaskPriority ) => void;
}

const TaskBasicFields = ({ title, description, dueDate, priority, onTitleChange, onDescriptionChange, 
    onDueDateChange, onPriorityChange }: TaskBasicFieldsProps) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="mb-2 block text-sm font-medium text-white/70"> Task name </label>
                <input
                    value={title}
                    onChange={(event) => onTitleChange( event.target.value )}
                    placeholder="e.g. Build authentication flow"
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]"
                />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium text-white/70"> Task description </label>
                <textarea
                    value={description}
                    onChange={(event) => onDescriptionChange( event.target.value )}
                    rows={4}
                    placeholder="Describe what needs to be done..."
                    className="w-full resize-none rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#7C3AED]"
                />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium text-white/70"> Due date </label>
                <div className="relative">
                    <CalendarDays
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(event) => onDueDateChange( event.target.value )}
                        className="w-full rounded-lg border border-white/10 bg-[#101017] py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-[#7C3AED]"
                    />
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-white/70"> Priority </label>
                    <div className="relative">
                        <select
                            value={priority}
                            onChange={(event) => onPriorityChange( event.target.value as TaskPriority)}
                            className="w-full appearance-none rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white outline-none focus:border-[#7C3AED]"
                        >
                            <option value="low"> Low </option>
                            <option value="medium"> Medium </option>
                            <option value="high"> High </option>
                            <option value="urgent"> Urgent </option>
                        </select>
                        <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
                        />
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-white/70"> Status </label>
                    <div className="rounded-lg border border-white/10 bg-[#101017] px-3 py-2.5 text-sm text-white/50"> Todo </div>
                </div>
            </div>
        </div>
    );
};

export default TaskBasicFields;