export default function EventRow({ item, index, getTagClass }) {
  const locationText =
    item.mode === "Online"
      ? item.location?.platform || item.location?.city || "-"
      : item.location?.venue || item.location?.city || "-";

  return (
    <tr
      className={`border-b border-slate-100 text-center transition hover:bg-violet-50/60 ${
        index % 2 === 0 ? "bg-white/80" : "bg-lime-50/30"
      }`}
    >
      <td className="px-4 py-4 text-[12px] font-bold text-slate-700">{item.id}</td>

      <td className="px-4 py-4">
        <img
          src={item.image}
          alt={item.title}
          className="mx-auto h-14 w-20 rounded-[18px] border border-black/10 object-cover shadow"
        />
      </td>

      <td className="px-4 py-4 text-left">
        <p className="text-[12px] font-black text-slate-800">{item.title}</p>
        <p className="mt-1 text-[10px] text-slate-500">
          🎤 {item.speaker?.name}
        </p>
      </td>

      <td className="px-4 py-4 text-left text-[12px] text-slate-600">
        <p>{item.desc}</p>
        <p className="mt-1 text-[10px] text-slate-500">
          🏢 {item.organizer?.name}
        </p>
      </td>

      <td className="px-4 py-4">
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${getTagClass(item.tag)}`}>
          {item.tag}
        </span>
      </td>

      <td className="px-4 py-4">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
            item.status === "Open"
              ? "border border-lime-200 bg-lime-100 text-lime-700"
              : "border border-rose-200 bg-rose-100 text-rose-700"
          }`}
        >
          {item.status}
        </span>
      </td>

      <td className="px-4 py-4 text-[12px] font-medium text-slate-600">
        {item.mode}
      </td>

      <td className="px-4 py-4 text-left text-[11px] font-medium text-slate-500">
        <p>{locationText}</p>
        <p className="mt-1">📅 {item.date}</p>
      </td>
    </tr>
  );
}