import { useState } from "react";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const segmentConfig = {
  VIP: { color: "#8B5CF6", bg: "bg-purple-100 text-purple-700", desc: "Pelanggan dengan pengeluaran tertinggi dan frekuensi transaksi sangat tinggi" },
  Loyal: { color: "#2940D3", bg: "bg-blue-100 text-[#2940D3]", desc: "Pelanggan yang rutin bertransaksi dan memiliki loyalitas tinggi" },
  Regular: { color: "#10B981", bg: "bg-[2CC5BD] text-green-700", desc: "Pelanggan dengan frekuensi transaksi sedang" },
  New: { color: "#F59E0B", bg: "bg-yellow-100 text-yellow-700", desc: "Pelanggan baru yang baru bergabung" },
};

export default function Segmentation() {
  const [customers] = useState(customersData);
  const [activeSegment, setActiveSegment] = useState("Semua");

  const segmentData = Object.keys(segmentConfig).map((seg) => ({
    name: seg,
    value: customers.filter((c) => c.segment === seg).length,
    color: segmentConfig[seg].color,
  }));

  const filtered = activeSegment === "Semua" ? customers : customers.filter((c) => c.segment === activeSegment);

  return (
    <div>
      <PageHeader title="Segmentasi Pelanggan" subtitle="Kelompokkan pelanggan berdasarkan perilaku dan nilai transaksi" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-800 mb-1">Distribusi Segmen</p>
          <p className="text-xs text-gray-400 mb-3">Total {customers.length} pelanggan</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={segmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {segmentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {segmentData.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-xs text-gray-600">{s.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{s.value} pelanggan</span>
              </div>
            ))}
          </div>
        </div>

        {/* Segment Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {Object.entries(segmentConfig).map(([seg, cfg]) => {
            const count = customers.filter((c) => c.segment === seg).length;
            const avgSpent = Math.round(
              customers.filter((c) => c.segment === seg).reduce((s, c) => s + c.totalSpent, 0) / (count || 1)
            );
            return (
              <div
                key={seg}
                onClick={() => setActiveSegment(activeSegment === seg ? "Semua" : seg)}
                className={`rounded-2xl p-4 cursor-pointer transition-all border-2 ${
                  activeSegment === seg ? "border-[#2940D3] shadow-md" : "border-transparent bg-white shadow-sm"
                }`}
                style={{ backgroundColor: activeSegment === seg ? `${cfg.color}10` : "white" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg}`}>{seg}</span>
                  <span className="text-2xl font-bold text-gray-800">{count}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{cfg.desc}</p>
                <p className="text-xs text-gray-400 mt-2">Rata-rata belanja: <span className="font-semibold text-gray-700">Rp {avgSpent.toLocaleString("id-ID")}</span></p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["Semua", ...Object.keys(segmentConfig)].map((s) => (
          <button
            key={s}
            onClick={() => setActiveSegment(s)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSegment === s ? "bg-[#2940D3] text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s} ({s === "Semua" ? customers.length : customers.filter((c) => c.segment === s).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-5 py-3.5 font-semibold">Pelanggan</th>
                <th className="px-5 py-3.5 font-semibold">Segmen</th>
                <th className="px-5 py-3.5 font-semibold">Frekuensi</th>
                <th className="px-5 py-3.5 font-semibold">Total Belanja</th>
                <th className="px-5 py-3.5 font-semibold">Transaksi Terakhir</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#2940D3]/10 flex items-center justify-center text-[#2940D3] font-bold text-sm">
                        {c.name.charAt(0)}
                      </div>
                      <p className="font-semibold text-gray-800">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${segmentConfig[c.segment]?.bg}`}>{c.segment}</span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-700">{c.totalTransactions}x</td>
                  <td className="px-5 py-4 font-bold text-gray-800">Rp {c.totalSpent.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{c.lastTransaction}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.status === "active" ? "bg-[2CC5BD] text-green-700" : "bg-red-100 text-red-600"}`}>
                      {c.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
