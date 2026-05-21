/**
 * Card — Layout / Data Display Component
 * Props:
 *   className: string
 *   padding: boolean (default true)
 *   children
 */
export default function Card({ children, className = "", padding = true }) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100
        ${padding ? "p-5" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
