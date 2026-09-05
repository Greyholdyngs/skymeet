import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

const StatCard = ({title, value, icon: Icon }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6 transition hover:border-[#7C3AED]/30">
        <div className="flex items-center justify-between">
            <p className="text-sm text-white/50">{title}</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A78BFA]">            
                <Icon size={19} />
            </div>
        </div>
        <h3 className="mt-6 text-3xl font-bold text-white">
            {value}
        </h3>
    </div>
  );
};

export default StatCard;