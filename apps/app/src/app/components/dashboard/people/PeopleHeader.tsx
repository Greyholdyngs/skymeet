interface PeopleHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    totalPeople: number;
}

const PeopleHeader = ({ search, onSearchChange, totalPeople }: PeopleHeaderProps) => {
    return (
        <>
            <div>
                <p className="text-sm font-medium text-[#A78BFA]"> Workspace </p>
                <h1 className="mt-1 text-2xl font-bold theme-text sm:text-3xl"> People </h1>
                <p className="mt-2 max-w-2xl text-sm theme-text-secondary"> Find and connect with people you collaborate with across your projects. </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search people or projects..."
                    aria-label="Search people or projects"
                    className="w-full rounded-xl border theme-border theme-surface-elevated px-4 py-3 text-sm theme-text outline-none transition placeholder:theme-text-muted focus:border-[#A78BFA]/50 sm:max-w-md"
                />
                <p className="text-sm theme-text-secondary"> {totalPeople} {totalPeople === 1 ? "person" : "people"} </p>
            </div>
        </>
    );
};

export default PeopleHeader;