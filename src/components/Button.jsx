/**
 * Button — Basic Component
 * Props:
 *   variant: "primary" | "secondary" | "danger" | "warning" | "ghost" | "outline"
 *   size:    "sm" | "md" | "lg"
 *   icon:    ReactNode (icon di kiri)
 *   iconRight: ReactNode (icon di kanan)
 *   loading: boolean
 *   disabled: boolean
 *   className: string (override tambahan)
 *   children, onClick, type, ...rest
 */
const variants = {
  primary:   "bg-[#3ABDE8] text-white hover:bg-[#2AADD8] shadow-sm",
  secondary: "bg-[#1A667A] text-white hover:bg-[#155a6b] shadow-sm",
  danger:    "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  warning:   "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
  ghost:     "bg-gray-100 text-gray-600 hover:bg-gray-200",
  outline:   "border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white",
};

const sizes = {
  sm:  "px-3 py-1.5 text-xs gap-1.5",
  md:  "px-4 py-2.5 text-sm gap-2",
  lg:  "px-5 py-3 text-sm gap-2",
};

export default function Button({
  children,
  variant  = "primary",
  size     = "md",
  icon,
  iconRight,
  loading  = false,
  disabled = false,
  className = "",
  type     = "button",
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-xl
        transition-colors duration-150 flex-shrink-0
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="flex-shrink-0">{iconRight}</span>
      )}
    </button>
  );
}
