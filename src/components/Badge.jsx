
const variants = {
  blue:     "bg-[#2940D3]/10 text-[#2940D3]",
  green:    "bg-green-100 text-green-700",
  red:      "bg-red-100 text-red-600",
  yellow:   "bg-yellow-100 text-yellow-700",
  purple:   "bg-purple-100 text-purple-700",
  gray:     "bg-gray-100 text-gray-600",
  teal:     "bg-[#142297]/10 text-[#142297]",
  
  bronze:   "bg-orange-50 text-orange-700 border border-orange-200/40",
  silver:   "bg-slate-100 text-slate-700 border border-slate-200/40",
  gold:     "bg-amber-50 text-amber-700 border border-amber-200/40",
  platinum: "bg-purple-50 text-purple-700 border border-purple-200/40",
};

export default function Badge({ children, variant = "gray", icon, className = "" }) {
  const currentVariant = variant.toLowerCase();

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-full
        text-xs font-medium whitespace-nowrap transition-colors
        ${variants[currentVariant] || variants.gray}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}