export default function Tabs({
  tabs      = [],
  active,
  onChange,
  variant   = "pill",
  size      = "md",
  className = "",
}) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const padding  = size === "sm" ? "px-3 py-2" : "px-4 py-2.5";

  if (variant === "underline") {
    return (
      <div className={`flex gap-1 border-b border-gray-200 ${className}`}>
        {tabs.map(({ key, label, icon, badge }) => (
          <button
            key={key}
            onClick={() => onChange?.(key)}
            className={`
              flex items-center gap-2 ${padding} ${textSize} font-medium transition-all
              border-b-2 -mb-px
              ${active === key
                ? "border-[#3ABDE8] text-[#3ABDE8]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {label}
            {badge !== undefined && (
              <span className={`
                min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center
                ${active === key ? "bg-[#3ABDE8] text-white" : "bg-gray-200 text-gray-600"}
              `}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Default: pill variant
  return (
    <div className={`flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit ${className}`}>
      {tabs.map(({ key, label, icon, badge }) => (
        <button
          key={key}
          onClick={() => onChange?.(key)}
          className={`
            flex items-center gap-2 ${padding} rounded-xl ${textSize} font-medium transition-all
            ${active === key
              ? "bg-[#3ABDE8] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }
          `}
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {label}
          {badge !== undefined && (
            <span className={`
              min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center
              ${active === key ? "bg-white/30 text-white" : "bg-gray-200 text-gray-600"}
            `}>
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
