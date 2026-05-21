import { useRef, useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Cari...",
  className   = "",
  size        = "md",
}) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const padding = size === "sm" ? "px-3 py-2" : "px-4 py-2.5";

  return (
    <div
      className={`
        flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-100
        focus-within:border-[#3ABDE8] focus-within:ring-2 focus-within:ring-[#3ABDE8]/10
        transition-all ${padding} ${className}
      `}
    >
      <Search size={14} className="text-gray-400 flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
