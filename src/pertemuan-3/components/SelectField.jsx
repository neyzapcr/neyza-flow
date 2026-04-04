export default function SelectField({ label, value, onChange, options, error, placeholder,
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
{/* tes sebelum ubah */}
      <select
        value={value}
        onChange={onChange}
        className={`w-full max-w-[350px] rounded-xl border px-4 pr-10 py-3 text-sm text-slate-700 outline-none transition-all duration-200 bg-white/90 ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            : "border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 hover:border-slate-300"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          ⚠ {error}
        </div>
      )}
    </div>
  );
}