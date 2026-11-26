import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => {
  return (
    <div className="min-w-0 rounded-2xl border theme-border theme-surface p-4 transition hover:border-[#7C3AED]/30 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm theme-text-secondary">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#7C3AED]">
          <Icon size={19} />
        </div>
      </div>
      <h3 className="mt-4 wrap-break-word text-2xl font-bold theme-text sm:mt-6 sm:text-3xl"> {value} </h3>
    </div>
  );
};

export default StatCard;
