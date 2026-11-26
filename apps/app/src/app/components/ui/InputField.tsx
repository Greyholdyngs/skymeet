interface InputFieldProps {
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({label, type, value, placeholder, error, onChange,}: InputFieldProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold theme-text md:text-base"> {label} </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`min-w-full truncate rounded-xl border bg-transparent px-3 py-2.5 text-sm theme-text outline-none transition placeholder:opacity-50 focus:border-[#7C3AED] ${
                    error ? "border-red-500" : "theme-border hover:border-[#7C3AED]/50"}`}
      />
        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
