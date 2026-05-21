/**
 * Input — Form Component
 * Props:
 *   label: string
 *   name: string
 *   type: string
 *   value, onChange, placeholder
 *   icon: ReactNode (icon kiri)
 *   iconRight: ReactNode (icon kanan)
 *   error: string
 *   required: boolean
 *   className: string
 */
export default function Input({
  label,
  name,
  type        = "text",
  value,
  onChange,
  placeholder,
  icon,
  iconRight,
  error,
  required    = false,
  className   = "",
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
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full border rounded-xl py-2.5 text-sm outline-none transition-all
            focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20
            ${error ? "border-red-300" : "border-gray-200"}
            ${icon ? "pl-9 pr-4" : "px-4"}
            ${iconRight ? "pr-10" : ""}
          `}
          {...rest}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
