const heights = {
  sm: "h-1.5",
  md: "h-2",
};

export default function ProgressBar({
  value     = 0,
  color     = "#2940D3",
  height    = "md",
  showLabel = false,
  label,
  className = "",
}) {
  const pct = Math.min(100, Math.max(0, value));
  const isHex = color.startsWith("#");

  return (
    <div className={className}>
      {(label || showLabel) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-xs text-gray-500">{label}</span>}
          {showLabel && <span className="text-xs font-bold text-gray-700">{pct}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full ${heights[height] || heights.md}`}>
        <div
          className={`${heights[height] || heights.md} rounded-full transition-all duration-500 ${!isHex ? color : ""}`}
          style={{ width: `${pct}%`, ...(isHex ? { backgroundColor: color } : {}) }}
        />
      </div>
    </div>
  );
}
