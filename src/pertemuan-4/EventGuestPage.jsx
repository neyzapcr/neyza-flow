export default function EventGuestPage({
  filteredEvents,
  dataForm,
  handleChange,
  allTags,
  allStatuses,
  setShowLoginModal
}) {
  const getStatusClass = (status) =>
    status === "Open"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  const getTagClass = (tag) => {
    const colorMap = {
      Design: "bg-pink-100 text-pink-700",
      Data: "bg-blue-100 text-blue-700",
      Programming: "bg-indigo-100 text-indigo-700",
      Technology: "bg-cyan-100 text-cyan-700",
      "Soft Skill": "bg-yellow-100 text-yellow-700",
      Business: "bg-emerald-100 text-emerald-700",
      Creative: "bg-purple-100 text-purple-700",
      Language: "bg-orange-100 text-orange-700",
      Finance: "bg-lime-100 text-lime-700"
    };

    return colorMap[tag] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 overflow-x-hidden">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-bold sm:text-2xl lg:text-4xl">
              Event Guest
            </h1>

            <button
              onClick={() => setShowLoginModal(true)}
              className="shrink-0 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-indigo-700 shadow hover:bg-slate-100 sm:text-sm"
            >
              Login
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-3 shadow">
          <div className="flex gap-2 overflow-x-auto">
            <input
              type="text"
              name="searchTerm"
              value={dataForm.searchTerm}
              onChange={handleChange}
              placeholder="Search..."
              className="min-w-[120px] flex-1 rounded border p-2 text-xs sm:text-sm"
            />

            <select
              name="selectedTag"
              value={dataForm.selectedTag}
              onChange={handleChange}
              className="w-[90px] rounded border p-2 text-xs sm:w-[120px]"
            >
              <option value="">Tag</option>
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
              className="w-[90px] rounded border p-2 text-xs sm:w-[120px]"
            >
              <option value="">Status</option>
              {allStatuses.map((status, i) => (
                <option key={i} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredEvents.map((item) => (
            <div
              key={item.id}
              className="w-full overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:shadow-xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold leading-snug text-slate-800 sm:text-base">
                    {item.title}
                  </h3>

                  <span
                    className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>


                <div className="mb-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${getTagClass(
                      item.tag
                    )}`}
                  >
                    {item.tag}
                  </span>
                  

                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {item.mode}
                  </span>
                <p className="mb-3 text-sm text-slate-500">{item.desc}</p>

                </div>

                <p className="text-sm text-slate-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}