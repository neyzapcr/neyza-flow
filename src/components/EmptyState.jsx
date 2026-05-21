export default function EmptyState({ icon, message = "Tidak ada data ditemukan", className = "" }) {
  return (
    <div className={`text-center py-12 text-gray-400 ${className}`}>
      {icon && (
        <div className="flex justify-center mb-2 opacity-25">
          {icon}
        </div>
      )}
      <p className="text-sm">{message}</p>
    </div>
  );
}
