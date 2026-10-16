import type { CustomFieldType } from "../types/types";

interface AddFieldMenuProps {
    onSelect: (
        type: CustomFieldType,
    ) => void;
}

const AddFieldMenu = ({ onSelect }: AddFieldMenuProps) => {

    const fields: {
        type: CustomFieldType;
        title: string;
        description: string;
        icon: string;
    }[] = [
        {
            type: "text",
            title: "Text",
            description: "Short text value",
            icon: "T",
        },
        {
            type: "dropdown",
            title: "Dropdown",
            description: "Select one option",
            icon: "▼",
        },
        {
            type: "checklist",
            title: "Checklist",
            description: "Multiple items",
            icon: "☑",
        },
    ];

    return (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {fields.map((field) => (
                <button
                    key={field.type}
                    type="button"
                    onClick={() =>
                        onSelect(field.type)
                    }
                    className="rounded-xl border border-white/10 bg-[#101017] p-4 text-left transition hover:border-[#7C3AED]/40 hover:bg-white/2"
                >
                    <div className="mb-2 text-sm font-semibold text-white"> {field.icon} </div>
                    <p className="text-sm font-medium text-white/70"> {field.title} </p>
                    <p className="mt-1 text-xs text-white/30"> {field.description} </p>
                </button>
            ))}
        </div>
    );
};

export default AddFieldMenu;