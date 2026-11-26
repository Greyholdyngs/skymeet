"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProjectAttendeePicker from "./ProjectAttendeePicker";

import UserAttendeeSearch from "./userAttendeeSearch";
import SelectedAttendees from "./SelectedAttendees";
import { useMeetingAttendees } from "./useMeetingAttendees";

import type { MeetingAttendeeSelectorProps } from "./attendee-types";

const MeetingAttendeeSelector = ({scope, projects, projectId, currentUserId, initialAttendees = [],
                                    onChange,}: MeetingAttendeeSelectorProps) => {

    const { attendees, selectedProjectIds, searchQuery, searchResults, loadingProjects, searching, error,
        setSearchQuery, toggleProject, addIndividualAttendee, removeAttendee,
        isSelected, } = useMeetingAttendees({scope, projectId, currentUserId, initialAttendees, });

    useEffect(() => {
        onChange(attendees);
    }, [attendees, onChange]);

    return (
        <div className="space-y-5">
            {scope === "general" && (
                <>
                    <ProjectAttendeePicker
                        projects={projects}
                        selectedProjectIds={selectedProjectIds}
                        loading={loadingProjects}
                        onToggle={toggleProject}
                    />
                    <UserAttendeeSearch
                        query={searchQuery}
                        results={searchResults}
                        searching={searching}
                        isSelected={isSelected}
                        onQueryChange={setSearchQuery}
                        onAdd={addIndividualAttendee}
                    />
                </>
            )}
            {scope === "project" && (
                <div>
                    <label className="mb-2 block text-sm font-medium theme-text-secondary"> Project attendees </label>
                    <p className="text-xs theme-text-muted"> Attendees are selected from the members of this project. </p>
                </div>
            )}
            {loadingProjects && (
                <p className="flex items-center gap-2 text-xs theme-text-muted">
                    <Loader2 size={14} className="animate-spin" />
                    Loading project members...
                </p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
            <SelectedAttendees attendees={attendees} onRemove={removeAttendee} />
        </div>
    );
};

export default MeetingAttendeeSelector;
