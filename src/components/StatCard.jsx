export default function StatCard({
  Icon,
  iconBg    = "bg-[#3ABDE8]/10",
  iconColor = "text-[#3ABDE8]",
  label,
  value,
  sub,
  subColor  = "text-green-500",
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className={`text-xs mt-0.5 font-medium ${subColor}`}>{sub}</p>}
      </div>
    </div>
  );
}
