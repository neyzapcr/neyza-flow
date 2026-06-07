import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { FileText, Download, Users, TrendingUp, RefreshCw, UserPlus, Send } from "lucide-react";
import PageHeader from "../components/PageHeader";
import rawCustomersData from "../data/customers.json";
const customersData = rawCustomersData.flatMap((c) => {
  const historyList = c.transactionHistory || [];
  if (historyList.length === 0) {
    return [{
      ...c,
      customerId: c.customerId || String(Math.random()),
      joinDate: c.joinDate || "-",
      totalTransactions: c.totalTransactions !== undefined ? c.totalTransactions : 0,
      totalSpent: c.totalSpent !== undefined ? c.totalSpent : 0,
      points: c.points !== undefined ? c.points : 0,
      segment: c.segment || "New",
      lastTransaction: c.lastTransaction || "-",
      status: c.status || "active",
    }];
  }
  return historyList.map((history) => ({
    ...c,
    customerId: history.customerId || c.customerId || String(Math.random()),
    joinDate: history.joinDate || c.joinDate || "-",
    totalTransactions: history.totalTransactions !== undefined ? history.totalTransactions : (c.totalTransactions || 0),
    totalSpent: history.totalSpent !== undefined ? history.totalSpent : (c.totalSpent || 0),
    points: history.points !== undefined ? history.points : (c.points || 0),
    segment: history.segment || c.segment || "New",
    lastTransaction: history.lastTransaction || c.lastTransaction || "-",
    status: history.status || c.status || "active",
  }));
});
import transactionsData from "../data/transactions.json";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Avatar from "../components/Avatar";

const monthlyData = [
  { month: "Jan", pelangganBaru: 3, transaksi: 18, pendapatan: 540000 },
  { month: "Feb", pelangganBaru: 2, transaksi: 22, pendapatan: 660000 },
  { month: "Mar", pelangganBaru: 5, transaksi: 30, pendapatan: 900000 },
  { month: "Apr", pelangganBaru: 4, transaksi: 28, pendapatan: 840000 },
  { month: "Mei", pelangganBaru: 6, transaksi: 35, pendapatan: 1050000 },
];

// --- Fungsi Export PDF & Word tetap sama ---
async function exportPDF(args) { /* ... */ }
function exportWord(args) { /* ... */ }

export default function Reports() {
  const [period, setPeriod] = useState("bulan");
  const [exporting, setExporting] = useState(null);

  const totalRevenue = transactionsData.reduce((s, t) => s + t.total, 0);
  const activeCustomers = customersData.filter((c) => c.status === "active").length;
  const newCustomers = customersData.filter((c) => c.joinDate >= "2025-01-01").length;
  const retentionRate = Math.round((activeCustomers / customersData.length) * 100);

  const handleExport = async (type) => {
    setExporting(type);
    const args = { totalRevenue, activeCustomers, newCustomers, retentionRate, period };
    type === "pdf" ? await exportPDF(args) : exportWord(args);
    setExporting(null);
  };

  return (
    <div>
      <PageHeader title="Laporan CRM" subtitle="Analisis performa bisnis dan data pelanggan">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {["hari", "minggu", "bulan"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? "bg-white text-[#2940D3] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {p}
              </button>
            ))}
          </div>
          <Button variant="danger" size="sm" icon={<FileText size={13} />} loading={exporting === "pdf"} onClick={() => handleExport("pdf")}>PDF</Button>
          <Button variant="secondary" size="sm" icon={<Download size={13} />} loading={exporting === "word"} onClick={() => handleExport("word")}>Word</Button>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Pendapatan", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, Icon: TrendingUp, sub: "↑ 12% vs bulan lalu", subColor: "text-green-500", color: "bg-blue-50", iconColor: "text-[#2940D3]" },
          { label: "Pelanggan Aktif", value: activeCustomers, Icon: Users, sub: `${retentionRate}% retensi`, subColor: "text-[#2940D3]", color: "bg-green-50", iconColor: "text-green-500" },
          { label: "Pelanggan Baru", value: newCustomers, Icon: UserPlus, sub: "Tahun 2025", subColor: "text-purple-500", color: "bg-purple-50", iconColor: "text-purple-500" },
          { label: "Tingkat Retensi", value: `${retentionRate}%`, Icon: RefreshCw, sub: "Pelanggan kembali", subColor: "text-orange-500", color: "bg-orange-50", iconColor: "text-orange-500" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-white`}>
            <s.Icon size={20} className={`${s.iconColor} mb-2`} />
            <p className="text-xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            <p className={`text-xs font-medium mt-1 ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <p className="font-bold text-gray-800 mb-1">Tren Pendapatan</p>
          <p className="text-xs text-gray-400 mb-4">Pendapatan per bulan (2025)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => [`Rp ${v.toLocaleString("id-ID")}`, "Pendapatan"]} />
              <Bar dataKey="pendapatan" fill="#2940D3" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <p className="font-bold text-gray-800 mb-1">Pertumbuhan Pelanggan</p>
          <p className="text-xs text-gray-400 mb-4">Pelanggan baru per bulan</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="pelangganBaru" stroke="#2940D3" strokeWidth={2.5} dot={{ fill: "#2940D3", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Segment Report Table */}
      <Card className="mb-4">
        <p className="font-bold text-gray-800 mb-4">Laporan per Segmen</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-4 py-3 font-semibold rounded-l-xl">Segmen</th>
                <th className="px-4 py-3 font-semibold">Jumlah</th>
                <th className="px-4 py-3 font-semibold">Total Belanja</th>
                <th className="px-4 py-3 font-semibold">Rata-rata Belanja</th>
                <th className="px-4 py-3 font-semibold">Rata-rata Transaksi</th>
                <th className="px-4 py-3 font-semibold rounded-r-xl">% dari Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {["VIP", "Loyal", "Regular", "New"].map((seg) => {
                const sc = customersData.filter((c) => c.segment === seg);
                const total = sc.reduce((s, c) => s + c.totalSpent, 0);
                const avg = Math.round(total / (sc.length || 1));
                const avgTrx = Math.round(sc.reduce((s, c) => s + c.totalTransactions, 0) / (sc.length || 1));
                const pct = Math.round((sc.length / customersData.length) * 100);
                return (
                  <tr key={seg} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><Badge variant={seg}>{seg}</Badge></td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{sc.length}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">Rp {total.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-gray-600">Rp {avg.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-gray-600">{avgTrx}x</td>
                    <td className="px-4 py-3"><ProgressBar value={pct} height="sm" className="w-16" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inactive Reminder */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-gray-800">Pelanggan Tidak Aktif</p>
            <p className="text-xs text-gray-400">Tidak bertransaksi lebih dari 30 hari</p>
          </div>
          <Button variant="ghost" size="sm" icon={<Send size={13} />}>Kirim Reminder</Button>
        </div>
        <div className="space-y-3">
          {customersData.filter((c) => c.status === "inactive").map((c) => (
            <div key={c.customerId} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Avatar name={c.customerName} size="md" color="bg-red-100" className="text-red-500" />
                <div><p className="font-semibold text-sm">{c.customerName}</p><p className="text-xs text-gray-500">Terakhir: {c.lastTransaction}</p></div>
              </div>
              <Button size="sm" icon={<Send size={11} />}>Pesan</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}