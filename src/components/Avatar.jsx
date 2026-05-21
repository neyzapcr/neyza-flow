/**
 * Avatar — Basic Component
 * Props:
 *   name: string  — diambil huruf pertamanya
 *   size: "sm" | "md" | "lg" | "xl"
 *   color: string tailwind bg class (default gradient biru)
 *   shape: "circle" | "rounded"
 *   className: string
 */
const sizes = {
  sm:  "w-7 h-7 text-xs",
  md:  "w-9 h-9 text-sm",
  lg:  "w-14 h-14 text-xl",
  xl:  "w-20 h-20 text-3xl",
};

const shapes = {
  circle:  "rounded-full",
  rounded: "rounded-xl",
};

export default function Avatar({
  name     = "?",
  size     = "md",
  shape    = "rounded",
  color    = "bg-[#3ABDE8]",
  className = "",
}) {
  return (
    <div
      className={`
        ${sizes[size] || sizes.md}
        ${shapes[shape] || shapes.rounded}
        ${color}
        flex items-center justify-center
        text-white font-bold flex-shrink-0
        ${className}
      `}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
