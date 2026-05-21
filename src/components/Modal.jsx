import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Modal — Feedback Component
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   title: string
 *   subtitle: string
 *   size: "sm" | "md" | "lg" | "xl"
 *   children: ReactNode
 *   footer: ReactNode — custom footer (overrides default)
 *   hideClose: boolean
 */
const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  size      = "md",
  children,
  footer,
  hideClose = false,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${sizes[size] || sizes.md} max-h-[90vh] flex flex-col font-lagusans`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-0 flex-shrink-0">
            <div>
              {title && <h2 className="text-base font-bold text-gray-800">{title}</h2>}
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500 transition-colors flex-shrink-0 ml-4"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 pb-6 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
