export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows      = 4,
  error,
  required  = false,
  resize    = false,
  className = "",
  hint,
  ...rest
}) {
  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`
          w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all
          focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20
          ${error ? "border-red-300" : "border-gray-200"}
          ${resize ? "" : "resize-none"}
        `}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
