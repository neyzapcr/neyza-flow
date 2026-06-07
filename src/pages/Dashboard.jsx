import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { DollarSign, Users, ClipboardList, Star, Plus, Check } from "lucide-react";
import PageHeader from "../components/PageHeader";
import rawCustomers from "../data/customers.json";
const customers = rawCustomers.flatMap((c) => {
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
import transactions from "../data/transactions.json";
import feedback from "../data/feedback.json";
import Modal from "../components/Modal";
import Button from "../components/Button";
import DynamicForm from "../components/DynamicForm";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Table from "../components/Table";

// Helper — kirim toast tanpa import context
const toast = (type, title, desc, duration) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc, duration } }));

// ── Chart data ────────────────────────────────────────────────────────────────
const revenueData = [
  { day: "01", thisWeek: 120000, lastWeek: 95000 },
  { day: "02", thisWeek: 85000, lastWeek: 110000 },
  { day: "03", thisWeek: 145000, lastWeek: 80000 },
  { day: "04", thisWeek: 200000, lastWeek: 130000 },
  { day: "05", thisWeek: 175000, lastWeek: 160000 },
  { day: "06", thisWeek: 220000, lastWeek: 190000 },
  { day: "07", thisWeek: 195000, lastWeek: 175000 },
];

const orderTrendData = [
  { day: "01", thisWeek: 5, lastWeek: 4 },
  { day: "02", thisWeek: 3, lastWeek: 6 },
  { day: "03", thisWeek: 7, lastWeek: 3 },
  { day: "04", thisWeek: 9, lastWeek: 5 },
  { day: "05", thisWeek: 8, lastWeek: 7 },
  { day: "06", thisWeek: 11, lastWeek: 9 },
  { day: "07", thisWeek: 10, lastWeek: 8 },
];

const serviceData = [
  { name: "Cuci + Setrika", value: 45 },
  { name: "Cuci Kering", value: 30 },
  { name: "Cuci + Setrika + Parfum", value: 25 },
];

const ratingData = [
  { name: "Kebersihan", value: 88, color: "#2940D3" },
  { name: "Kecepatan", value: 82, color: "#142297" },
  { name: "Pelayanan", value: 92, color: "#2940D3" },
];

const PIE_COLORS = ["#2940D3", "#142297", "#7DD3F0"];
const statusMap = { selesai: "green", diproses: "blue", menunggu: "yellow" };
const SERVICES = ["Cuci + Setrika", "Cuci Kering", "Cuci + Setrika + Parfum"];
const PAYMENT_METHODS = ["Cash", "Transfer", "QRIS"];
const priceMap = { "Cuci + Setrika": 8000, "Cuci Kering": 7000, "Cuci + Setrika + Parfum": 12000 };

export default function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("minggu");
  const [showTambah, setShowTambah] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localForm, setLocalForm] = useState({});

  const total = localForm.weight ? Math.round(parseFloat(localForm.weight) * priceMap[localForm.service || SERVICES[0]]) : 0;
  const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const avgRating = (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1);
  const pendingOrders = transactions.filter((t) => t.status !== "selesai").length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localForm.customerName || !localForm.phone || !localForm.weight) return;
    setSaved(true);
    toast("laundry", "Cucian Baru Ditambahkan!", `${localForm.customerName} · ${localForm.service || SERVICES[0]} · ${localForm.weight} kg · Rp ${total.toLocaleString("id-ID")}`, 6000);
    setTimeout(() => { 
      setShowTambah(false); 
      setSaved(false);
      setLocalForm({});
      navigate("/tracking"); 
    }, 1400);
  };

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Selamat datang kembali, Admin">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {["hari", "minggu", "bulan"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? "bg-white text-[#2940D3] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{p}</button>
            ))}
          </div>
          <button onClick={() => setShowTambah(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#142297] text-white rounded-xl text-sm font-semibold hover:bg-[#155a6b] transition-colors shadow-sm">
            <Plus size={15} /> Tambah Cucian
          </button>
        </div>
      </PageHeader>

      {/* Stat Cards dengan Sub-Teks Naik Turun Performa */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard Icon={DollarSign} iconBg="bg-[#2940D3]/10" label="Total Pendapatan" value={`Rp ${totalRevenue.toLocaleString("id-ID")}`} sub="↑ 2.1% vs minggu lalu" subColor="text-green-500" />
        <StatCard Icon={Users} iconBg="bg-[#142297]/10" iconColor="text-[#142297]" label="Pelanggan Aktif" value={activeCustomers} sub="↑ 3 pelanggan baru" subColor="text-green-500" />
        <StatCard Icon={ClipboardList} iconBg="bg-orange-50" iconColor="text-orange-500" label="Order Pending" value={pendingOrders} sub="Perlu diproses" subColor="text-orange-500" />
        <StatCard Icon={Star} iconBg="bg-yellow-50" iconColor="text-yellow-500" label="Rata-rata Rating" value={`${avgRating}/5`} sub="Dari pelanggan" subColor="text-yellow-500" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Pendapatan</p>
              <p className="text-2xl font-bold text-gray-800">Rp {totalRevenue.toLocaleString("id-ID")}</p>
              <p className="text-xs text-green-500 font-medium mt-0.5">↑ 2.1% vs minggu lalu</p>
            </div>
            <Link to="/reports" className="text-xs text-[#2940D3] font-semibold hover:underline">Lihat Laporan</Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => [`Rp ${v.toLocaleString("id-ID")}`, ""]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="thisWeek" fill="#2940D3" radius={[4, 4, 0, 0]} name="Minggu Ini" />
              <Bar dataKey="lastWeek" fill="#142297" radius={[4, 4, 0, 0]} name="Minggu Lalu" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#2940D3]"></span><span className="text-xs text-gray-500">Minggu Ini</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#142297]"></span><span className="text-xs text-gray-500">Minggu Lalu</span></div>
          </div>
        </Card>

        {/* Service Pie */}
        <Card>
          <p className="text-xs text-gray-400 font-medium">Distribusi Layanan</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5 mb-4">Jenis Layanan</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {serviceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ borderRadius: 12, border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {serviceData.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                  <span className="text-xs text-gray-500">{s.name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rating Bars */}
        <Card>
          <p className="text-xs text-gray-400 font-medium mb-1">Rating Layanan</p>
          <p className="text-sm font-bold text-gray-800 mb-4">Kepuasan Pelanggan</p>
          <div className="space-y-4">
            {ratingData.map((r, i) => <ProgressBar key={i} label={r.name} value={r.value} color={r.color} showLabel />)}
          </div>
        </Card>

        {/* Order Trend Line */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Tren Order</p>
              <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
              <p className="text-xs text-red-500 font-medium mt-0.5">↓ 2.1% vs minggu lalu</p>
            </div>
            <Link to="/reports" className="text-xs text-[#2940D3] font-semibold hover:underline">Lihat Laporan</Link>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={orderTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="thisWeek" stroke="#2940D3" strokeWidth={2.5} dot={false} name="Minggu Ini" />
              <Line type="monotone" dataKey="lastWeek" stroke="#142297" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Minggu Lalu" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#2940D3]"></span><span className="text-xs text-gray-500">Minggu Ini</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#142297]"></span><span className="text-xs text-gray-500">Minggu Lalu</span></div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-800">Transaksi Terbaru</p>
          <Link to="/transactions" className="text-xs text-[#2940D3] font-semibold hover:underline">Lihat Semua</Link>
        </div>
        <Table headers={["ID", "Pelanggan", "Layanan", "Total", "Status"]}>
          {transactions.slice(0, 5).map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3 text-xs text-gray-400 font-mono">{t.id}</td>
              <td className="px-5 py-3 font-medium text-gray-700">{t.customerName}</td>
              <td className="px-5 py-3 text-gray-500 text-xs">{t.service}</td>
              <td className="px-5 py-3 font-semibold text-gray-800">Rp {t.total.toLocaleString("id-ID")}</td>
              <td className="px-5 py-3"><Badge variant={statusMap[t.status] || "gray"} className="capitalize">{t.status}</Badge></td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Tambah Cucian Modal */}
      {showTambah && (
        <Modal open onClose={() => { setShowTambah(false); setLocalForm({}); }} title="Tambah Cucian Baru" subtitle="Isi data pelanggan dan detail cucian">
          {saved ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Check size={26} className="text-green-500" /></div>
              <p className="font-bold text-gray-800 mb-1">Cucian Berhasil Ditambahkan!</p>
              <p className="text-sm text-gray-500">Mengarahkan ke halaman tracking...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <DynamicForm
                onChange={setLocalForm}
                initialData={{ service: SERVICES[0], paymentMethod: PAYMENT_METHODS[0] }}
                fields={[
                  { name: "customerName", label: "Nama Pelanggan", type: "text", placeholder: "Nama lengkap", required: true },
                  { name: "phone", label: "No. Telepon", type: "tel", placeholder: "08xxxxxxxxxx", required: true },
                  { name: "weight", label: "Berat (kg)", type: "number", min: "0.1", step: "0.1", placeholder: "Contoh: 3.5", required: true },
                  { name: "paymentMethod", label: "Metode Pembayaran", type: "select", options: PAYMENT_METHODS, defaultValue: PAYMENT_METHODS[0] },
                  { name: "notes", label: "Catatan (opsional)", type: "textarea", placeholder: "Contoh: ada noda membandel...", rows: 2 }
                ]}
                customRender={(formState, handleInputChange) => (
                  <div className="text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jenis Layanan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SERVICES.map((s) => {
                        const isActive = (formState.service || SERVICES[0]) === s;
                        return (
                          <label key={s} className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${isActive ? "border-[#2940D3] bg-[#2940D3]/5" : "border-gray-200 hover:border-gray-300"}`}>
                            <input type="radio" name="service" checked={isActive} onChange={() => handleInputChange("service", s)} className="sr-only" />
                            <span className={`text-xs font-semibold leading-tight ${isActive ? "text-[#2940D3]" : "text-gray-600"}`}>{s}</span>
                            <span className="text-xs text-gray-400">Rp {priceMap[s].toLocaleString("id-ID")}/kg</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              />

              {total > 0 && (
                <div className="flex items-center justify-between bg-[#2940D3]/5 border border-[#2940D3]/20 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-600">Estimasi Total</span>
                  <span className="text-base font-bold text-[#2940D3]">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowTambah(false); setLocalForm({}); }}>Batal</Button>
                <Button type="submit" variant="primary" icon={<Plus size={15} />} className="flex-1">Tambah Cucian</Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}