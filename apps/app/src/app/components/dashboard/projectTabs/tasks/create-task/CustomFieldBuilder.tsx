"use client";

import type { CustomField, CustomFieldType } from "../types/types";

import TextFieldBuilder from "./TextFieldBuilder";
import DropdownFieldBuilder from "./DropdownFieldBuilder";
import ChecklistFieldBuilder from "./ChecklistFieldBuilder";

interface CustomFieldBuilderProps {
    type: CustomFieldType;
    onCancel: () => void;
    onSave: (field: CustomField) => void;
}

const CustomFieldBuilder = ({ type, onCancel, onSave }: CustomFieldBuilderProps) => {

    if (type === "text") {
        return (
            <TextFieldBuilder
                onCancel={onCancel}
                onSave={onSave}
            />
        );
    }
    
    if (type === "dropdown") {
        return (
            <DropdownFieldBuilder
                onCancel={onCancel}
                onSave={onSave}
            />
        );
    }

    return (
        <ChecklistFieldBuilder
            onCancel={onCancel}
            onSave={onSave}
        />
    );
};

export default CustomFieldBuilder;