export default function EventRow({ item, index, getTagClass }) {
  return (
    <tr
      key={item.id}
      className={`border-b border-slate-100 text-center transition hover:bg-violet-50/60 ${index % 2 === 0 ? "bg-white/80" : "bg-lime-50/30"}`}
    >
      <td className="px-4 py-4 font-bold text-slate-700">{item.id}</td>

      <td className="px-4 py-4">
        <img src={item.image} alt={item.title} className="mx-auto h-14 w-20 rounded-[18px] border 
        border-black/10 object-cover shadow" />
      </td>

      <td className="px-4 py-4 font-black text-slate-800">{item.title}</td>
      <td className="px-4 py-4 text-left text-slate-600">{item.desc}</td>

      <td className="px-4 py-4">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${getTagClass(item.tag)}`} > 
            {item.tag} </span>
      </td>

      <td className="px-4 py-4">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${ item.status === "Open"
              ? "border border-lime-200 bg-lime-100 text-lime-700"
              : "border border-rose-200 bg-rose-100 text-rose-700"
          }`} >
          {item.status}
        </span>
      </td>
      <td className="px-4 py-4 font-medium text-slate-600">{item.mode}</td>
      <td className="px-4 py-4 font-medium text-slate-500">{item.date}</td>
    </tr>
  );
}
