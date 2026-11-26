import PersonCard from "./PersonCard";
import type { WorkspacePerson } from "./types";

interface PeopleListProps {
    people: WorkspacePerson[];
    loading: boolean;
    error: string;
    search: string;
}

const PeopleList = ({ people, loading, error, search }: PeopleListProps) => {
    if (loading) {
        return (
            <p className="text-sm theme-text-secondary"> Loading people... </p>
        );
    }
    if (error) {
        return (
            <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-5">
                <p className="text-sm text-red-400">{error}</p>
            </div>
        );
    }

    if (people.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed theme-border theme-surface px-6 py-16 text-center">
                <h2 className="text-lg font-semibold theme-text"> {search ? "No people found" : "Your workspace is quiet"} </h2>
                <p className="mx-auto mt-2 max-w-md text-sm theme-text-secondary">
                    {search ? "Try another name, username, email, or project." : "People you share projects with will appear here when they join your workspace."}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {people.map((person) => (
                <PersonCard
                    key={person.user._id}
                    person={person}
                />
            ))}
        </div>
    );
};

export default PeopleList;