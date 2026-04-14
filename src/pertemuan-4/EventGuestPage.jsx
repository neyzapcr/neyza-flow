import EventCard from "./components/EventCard";

export default function EventGuestPage({
  filteredEvents, dataForm, handleChange, allTags,
  allStatuses, setShowLoginModal,
}) {
  const getStatusClass = (status) =>
    status === "Open"
      ? "bg-lime-100 text-lime-700 border border-lime-200"
      : "bg-rose-100 text-rose-700 border border-rose-200";

  const getTagClass = (tag) => {
    const colorMap = {
      Design: "bg-pink-100 text-pink-700 border border-pink-200",
      Data: "bg-sky-100 text-sky-700 border border-sky-200",
      Programming: "bg-indigo-100 text-indigo-700 border border-indigo-200",
      Technology: "bg-cyan-100 text-cyan-700 border border-cyan-200",
      "Soft Skill": "bg-yellow-100 text-yellow-700 border border-yellow-200",
      Business: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      Creative: "bg-purple-100 text-purple-700 border border-purple-200",
      Language: "bg-orange-100 text-orange-700 border border-orange-200",
      Finance: "bg-lime-100 text-lime-700 border border-lime-200",
    };

    return colorMap[tag] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const Sticker = ({ children, className = "" }) => (
    <div
      className={`pointer-events-none absolute flex h-8 w-8 items-center justify-center rounded-full border 
        border-white/60 bg-white/70 text-sm shadow-md backdrop-blur-sm ${className}`} > {children} </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c9f76f] via-[#d8c8ff] to-[#f4f4f4]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="relative mb-6 overflow-hidden rounded-[36px] border-[3px] border-black/10 bg-white/55 p-6 shadow-xl backdrop-blur-md">
          <div className="absolute left-1 top-2 -rotate-12 text-lg sm:text-xl"> ✨ </div>
          <div className="absolute bottom-2 left-1 -rotate-6 text-xl sm:text-2xl"> 🐰 </div>
          <div className="absolute bottom-4 right-8 text-xl sm:text-2xl"> 📱 </div>
          <div className="absolute right-4 top-4 text-[12px] sm:text-[16px]"> 💙🩷💛💚💜 </div>

          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-lime-300/40 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-violet-300/40 blur-2xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 inline-block rounded-full bg-violet-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.25em] text-violet-700">
                Guest - Pertemuan 4
              </p>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Event 💫
              </h1>
            </div>

            <button
              onClick={() => setShowLoginModal(true)}
              className="shrink-0 rounded-full border-2 border-black/10 bg-white px-5 py-2 text-xs font-extrabold text-violet-700 
              shadow-md transition hover:-translate-y-0.5 hover:bg-violet-50 sm:text-sm" > Login 🔐
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="relative mb-6 rounded-[30px] border-[2px] border-black/10 bg-white/70 p-4 shadow-lg backdrop-blur-md">
          <Sticker className="left-3 top-3 rotate-[-10deg]">💚</Sticker>
          <Sticker className="right-5 top-3 rotate-[12deg]">🐰</Sticker>

          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
            <span>💚</span>
            <span>Filter Event</span>
            <span>✨</span>
            <span>🎶</span>
          </div>

          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto sm:gap-3">
            <input
              type="text"
              name="searchTerm"
              value={dataForm.searchTerm}
              onChange={handleChange}
              placeholder="Search event... 🔎"
              className="min-w-[170px] flex-1 rounded-full border-2 border-lime-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-lime-400 focus:ring-4 focus:ring-lime-100"
            />

            <select
              name="selectedTag"
              value={dataForm.selectedTag}
              onChange={handleChange}
              className="min-w-[130px] rounded-full border-2 border-violet-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              <option value="">All Tag 🏷️</option>
              {allTags.map((tag, i) => (
                <option key={i} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            <select
              name="selectedStatus"
              value={dataForm.selectedStatus}
              onChange={handleChange}
              className="min-w-[140px] rounded-full border-2 border-cyan-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="">All Status 📌</option>
              {allStatuses.map((status, i) => (
                <option key={i} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards */}
        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredEvents.map((item, index) => (
            <EventCard key={item.id} item={item} index={index} getTagClass={getTagClass} getStatusClass={getStatusClass}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="mt-8 rounded-[28px] border-2 border-dashed border-violet-200 bg-white/70 p-8 text-center shadow-md">
            <p className="text-sm font-bold text-slate-600"> Event tidak ditemukan 🥹 </p>
          </div>
        )}
      </div>
    </div>
  );
}
