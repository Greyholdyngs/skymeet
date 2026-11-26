import { CheckCircle2, ListTodo, Users, ChartNoAxesCombined} from "lucide-react";

interface OverviewMetricsProps {
    membersCount: number;
    totalTasks: number;
    completedTasks: number;
}

const OverviewMetrics = ({ membersCount, totalTasks, completedTasks }: OverviewMetricsProps) => {
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const metrics = [
        { label: "Members", value: membersCount, icon: Users,},
        { label: "Total Tasks", value: totalTasks, icon: ListTodo,},
        { label: "Completed Tasks", value: completedTasks, icon: CheckCircle2,},
        { label: "Completion", value: `${completionRate}%`, icon: ChartNoAxesCombined,},
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ label, value, icon: Icon }) => (
                <div
                    key={label}
                    className="rounded-xl border theme-border theme-surface p-5"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm theme-text-secondary">{label}</p>
                        <Icon size={18} className="text-[#00A1CC]" />
                    </div>
                    <p className="mt-4 text-2xl font-semibold theme-text">{value}</p>
                </div>
            ))}
        </div>
    );
};

export default OverviewMetrics;
