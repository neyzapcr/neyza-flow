/**
 * Select — Form Component
 * Props:
 *   label: string
 *   name: string
 *   value, onChange
 *   options: { value, label }[] | string[]
 *   placeholder: string
 *   error: string
 *   required: boolean
 *   className: string
 *   icon: ReactNode
 */
export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  required   = false,
  className  = "",
  icon,
  ...rest
}) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full border rounded-xl py-2.5 text-sm outline-none transition-all
            appearance-none bg-white
            focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20
            ${error ? "border-red-300" : "border-gray-200"}
            ${icon ? "pl-9 pr-9" : "px-4 pr-9"}
          `}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
