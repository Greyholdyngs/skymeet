"use client";

import PeopleHeader from "@/app/components/dashboard/people/PeopleHeader";
import PeopleList from "@/app/components/dashboard/people/PeopleList";
import { useWorkspacePeople } from "@/app/components/dashboard/people/hooks/useWorkSpacePeople";

const PeoplePage = () => {
    const { people, filteredPeople, search, setSearch, loading, error} = useWorkspacePeople();

    return (
        <section className="min-h-full space-y-8 p-6 md:p-8">
            <PeopleHeader
                search={search}
                onSearchChange={setSearch}
                totalPeople={people.length}
            />
            <PeopleList
                people={filteredPeople}
                loading={loading}
                error={error}
                search={search}
            />
        </section>
    );
};

export default PeoplePage;