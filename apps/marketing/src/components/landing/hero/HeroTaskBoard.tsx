import { heroTaskColumns } from "./data/heroPreviewData";

const priorityStyles: Record<string, string> = {
  Urgent: "bg-rose-400/10 text-rose-300",
  High: "bg-orange-400/10 text-orange-300",
  Medium: "bg-amber-400/10 text-amber-300",
  Low: "bg-zinc-400/10 text-zinc-400",
};

const HeroTaskBoard = () => {

    return (
        <div className="min-w-0 border-t border-white/[0.07] px-3 py-4 sm:px-5">
            <div className="mb-3 flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-white sm:text-sm"> Task board </h4>
                <span className="text-[9px] text-zinc-500 sm:text-[10px]"> Project workflow </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {heroTaskColumns.map((column) => (
                <div
                    key={column.id}
                    className="min-w-0 rounded-lg border border-white/6 bg-white/2 p-2"
                >
                    <div className="mb-2 flex min-w-0 items-center justify-between gap-1">
                        <p className="truncate text-[9px] font-medium text-zinc-400 sm:text-[10px]"> {column.title} </p>
                        <span className="shrink-0 text-[9px] text-zinc-600"> {column.tasks.length} </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {column.tasks.map((task) => (
                            <article
                                key={task.id}
                                className="min-w-0 rounded-md border border-white/[0.07] bg-[#11111A] p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-[#171522]"
                            >
                                <p className="line-clamp-2 wrap-break-word text-[9px] leading-4 text-zinc-200 sm:text-[10px]"> {task.title} </p>
                                <span
                                    className={`mt-2 inline-flex max-w-full truncate rounded px-1.5 py-0.5 text-[8px] font-medium ${
                                                priorityStyles[task.priority] ?? "bg-zinc-400/10 text-zinc-400" }`}
                                >
                                    {task.priority}
                                </span>
                            </article>
                        ))}
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
};

export default HeroTaskBoard;
