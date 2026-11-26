
import type { ReactNode } from "react";

interface SprintSectionProps {
    title: string;
    count: number;
    icon: ReactNode;
    children: ReactNode;
    emptyMessage: string;
    isEmpty: boolean;
}

const SprintSection = ({ title, count, icon, children, emptyMessage, isEmpty }: SprintSectionProps) => {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="font-semibold theme-text">{title}</h3>
                <span className="text-xs theme-text-muted">{count}</span>
            </div>
            {isEmpty ? (
                <p className="rounded-xl border border-dashed theme-border p-6 text-center text-sm theme-text-muted"> {emptyMessage} </p>
            ) : (
                children
            )}
        </section>
    );
};

export default SprintSection;
