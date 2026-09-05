
interface InputFieldProps {
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  placeholder: string;
  error?: string;
  onChange: ( e: React.ChangeEvent<HTMLInputElement> ) => void;
}

const InputField = ({ label, type, value, placeholder, error, onChange }: InputFieldProps) => {
  return (
    <div className="flex flex-col space-y-2 ">
      <label className="text-white font-semibold text-sm md:text-md lg:text-md">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`py-1.5 px-3 min-w-full rounded-xl text-white/80 border-y focus:border-[#7C3AED] hover:border-white focus:outline-none truncate ${ error ? "border-red-500" : "border-[#27272A]"}`}
      />
      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;