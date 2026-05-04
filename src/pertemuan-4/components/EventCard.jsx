export default function EventCard({ item, index, getTagClass, getStatusClass }) {
  const Sticker = ({ children, className = "" }) => (
    <div
      className={`pointer-events-none absolute flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/70 text-sm shadow-md backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );

  const locationText =
    item.mode === "Online"
      ? item.location?.platform || item.location?.city || "Online"
      : item.location?.venue || item.location?.city || "Offline";

  return (
    <div className="group relative overflow-hidden rounded-[32px] border-[2px] border-black/10 bg-white/80 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
        <div className="h-full w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45)_0px,rgba(255,255,255,0.45)_1px,transparent_1px,transparent_12px)]"></div>
      </div>

      <Sticker className="right-3 top-3 z-20 rotate-[8deg]">
        {index % 4 === 0 ? "💚" : index % 4 === 1 ? "✨" : index % 4 === 2 ? "🐰" : "📼"}
      </Sticker>

      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-lime-300/40 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-violet-300/40 blur-2xl" />

      <img
        src={item.image}
        alt={item.title}
        className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
      />

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-[13px] font-black leading-snug text-slate-800 sm:text-[15px]">
            {item.title}
          </h3>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-extrabold sm:text-[10px] ${getStatusClass(
              item.status
            )}`}
          >
            {item.status}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[9px] font-bold sm:text-[10px] ${getTagClass(
              item.tag
            )}`}
          >
            #{item.tag}
          </span>

          <span className="rounded-full border border-violet-200 bg-violet-100 px-3 py-1 text-[9px] font-bold text-violet-700 sm:text-[10px]">
            {item.mode} 🎧
          </span>
        </div>

        <p className="mb-3 min-h-[52px] text-[12px] leading-relaxed text-slate-600 sm:text-[13px]">
          {item.desc}
        </p>

        <div className="mb-3 space-y-1 rounded-[18px] bg-slate-50/90 px-3 py-2">
          <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">
            📍 {locationText}
          </p>
          <p className="line-clamp-1 text-[10px] text-slate-500 sm:text-[11px]">
            🎤 {item.speaker?.name} — {item.speaker?.expertise}
          </p>
          <p className="line-clamp-1 text-[10px] text-slate-500 sm:text-[11px]">
            🏢 {item.organizer?.name}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold text-slate-500 sm:text-[11px]">
            📅 {item.date}
          </p>

          <button className="rounded-full border-2 border-black/10 bg-gradient-to-r from-[#c9f76f] to-[#d8c8ff] px-4 py-2 text-[10px] font-black text-slate-800 shadow transition hover:scale-105 sm:text-[11px]">
            View 💌
          </button>
        </div>
      </div>
    </div>
  );
}