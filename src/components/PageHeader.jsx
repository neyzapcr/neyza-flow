import { useState, useRef } from "react";
import { Search, X } from "lucide-react";

export default function PageHeader({ title, subtitle, children, onSearch }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  return (
    <div className="mb-6 font-lagusans">
      {/* Top row: title + actions */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {children && <div className="flex items-center gap-2 flex-shrink-0">{children}</div>}
      </div>

      {/* Search bar — hanya tampil jika onSearch di-pass */}
      {onSearch !== undefined && (
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-full max-w-md focus-within:border-[#3ABDE8] focus-within:ring-2 focus-within:ring-[#3ABDE8]/10 transition-all shadow-sm">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={`Cari di ${title.toLowerCase()}...`}
            className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400 font-lagusans"
          />
          {query && (
            <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <X size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
