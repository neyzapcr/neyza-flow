import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";
import Badge from "../components/Badge";
import Card from "../components/Card";
import Table from "../components/Table";
import Avatar from "../components/Avatar";

const segmentConfig = {
  VIP:     { variant: "purple", desc: "Pelanggan dengan pengeluaran tertinggi dan frekuensi transaksi sangat tinggi" },
  Loyal:   { variant: "blue",   desc: "Pelanggan yang rutin bertransaksi dan memiliki loyalitas tinggi" },
  Regular: { variant: "green",  desc: "Pelanggan dengan frekuensi transaksi sedang" },
  New:     { variant: "yellow", desc: "Pelanggan baru yang baru bergabung" },
};

const PIE_COLORS = ["#8B5CF6", "#2940D3", "#10B981", "#F59E0B"];

export default function Segmentation() {
  const [customers] = useState(customersData);
  const [activeSegment, setActiveSegment] = useState("Semua");

  const segmentData = Object.keys(segmentConfig).map((seg) => ({
    name: seg,
    value: customers.filter((c) => c.segment === seg).length,
  }));

  const filtered = activeSegment === "Semua" ? customers : customers.filter((c) => c.segment === activeSegment);

  return (
    <div>
      <PageHeader title="Segmentasi Pelanggan" subtitle="Kelompokkan pelanggan berdasarkan perilaku dan nilai transaksi" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Pie Chart */}
        <Card>
          <p className="font-bold text-gray-800 mb-1">Distribusi Segmen</p>
          <p className="text-xs text-gray-400 mb-3">Total {customers.length} pelanggan</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={segmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {segmentData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {segmentData.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}></span>
                  <span className="text-xs text-gray-600">{s.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{s.value} pelanggan</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Segment Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {Object.entries(segmentConfig).map(([seg, cfg]) => {
            const list = customers.filter((c) => c.segment === seg);
            const count = list.length;
            const avgSpent = Math.round(list.reduce((s, c) => s + c.totalSpent, 0) / (count || 1));
            return (
              <div
                key={seg}
                onClick={() => setActiveSegment(activeSegment === seg ? "Semua" : seg)}
                className={`rounded-2xl p-4 cursor-pointer transition-all border-2 ${activeSegment === seg ? "border-[#2940D3] shadow-md bg-[#2940D3]/5" : "border-transparent bg-white shadow-sm"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={cfg.variant}>{seg}</Badge>
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
        <Table headers={["Pelanggan", "Segmen", "Frekuensi", "Total Belanja", "Transaksi Terakhir", "Status"]}>
          {filtered.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} size="md" color="bg-[#2940D3]/10" className="text-[#2940D3]" />
                  <p className="font-semibold text-gray-800">{c.name}</p>
                </div>
              </td>
              <td className="px-5 py-4">
                <Badge variant={segmentConfig[c.segment]?.variant}>{c.segment}</Badge>
              </td>
              <td className="px-5 py-4 font-semibold text-gray-700">{c.totalTransactions}x</td>
              <td className="px-5 py-4 font-bold text-gray-800">Rp {c.totalSpent.toLocaleString("id-ID")}</td>
              <td className="px-5 py-4 text-gray-500 text-xs">{c.lastTransaction}</td>
              <td className="px-5 py-4">
                <Badge variant={c.status === "active" ? "green" : "red"}>
                  {c.status === "active" ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}