export default function EventAdminPage({
  filteredEvents,
  handleLogout,
  dataForm,
  handleChange,
  allTags,
  allStatuses
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl p-4">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-600 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-bold sm:text-2xl lg:text-4xl">
              Event Admin
            </h1>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-xl bg-white p-3 shadow">
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

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Tag</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredEvents.map((item) => (
                <tr key={item.id} className="border-b text-center hover:bg-slate-50">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mx-auto h-14 w-20 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-left">{item.desc}</td>
                  <td className="px-4 py-3">{item.tag}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.mode}</td>
                  <td className="px-4 py-3">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}