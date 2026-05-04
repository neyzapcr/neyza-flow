import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { DollarSign, Users, ClipboardList, Star, Plus, X, Check } from "lucide-react";
import PageHeader from "../components/PageHeader";
import customers from "../data/customers.json";
import transactions from "../data/transactions.json";
import feedback from "../data/feedback.json";

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
  { name: "Kebersihan", value: 88, color: "#3ABDE8" },
  { name: "Kecepatan", value: 82, color: "#1A667A" },
  { name: "Pelayanan", value: 92, color: "#3ABDE8" },
];

// Two-color palette
const PIE_COLORS = ["#3ABDE8", "#1A667A", "#7DD3F0"];

const statusMap = {
  selesai: "bg-green-100 text-green-700",
  diproses: "bg-blue-100 text-[#3ABDE8]",
  menunggu: "bg-yellow-100 text-yellow-700",
};

const SERVICES = ["Cuci + Setrika", "Cuci Kering", "Cuci + Setrika + Parfum"];
const PAYMENT_METHODS = ["Cash", "Transfer", "QRIS"];

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ Icon, iconBg, iconColor = "text-[#3ABDE8]", label, value, sub, subColor = "text-green-500" }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className={`text-xs mt-0.5 font-medium ${subColor}`}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Tambah Cucian modal ───────────────────────────────────────────────────────
function TambahCucianModal({ onClose, onSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    service: SERVICES[0],
    weight: "",
    paymentMethod: PAYMENT_METHODS[0],
    notes: "",
  });
  const [saved, setSaved] = useState(false);

  const priceMap = {
    "Cuci + Setrika": 8000,
    "Cuci Kering": 7000,
    "Cuci + Setrika + Parfum": 12000,
  };

  const total = form.weight ? Math.round(parseFloat(form.weight) * priceMap[form.service]) : 0;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.weight) return;
    setSaved(true);
    // Panggil onSuccess untuk trigger toast
    onSuccess?.({
      customerName: form.customerName,
      service: form.service,
      weight: form.weight,
      total,
    });
    setTimeout(() => {
      onClose();
      navigate("/tracking");
    }, 1400);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Tambah Cucian Baru</h2>
            <p className="text-xs text-gray-400 mt-0.5">Isi data pelanggan dan detail cucian</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500">
            <X size={14} />
          </button>
        </div>

        {saved ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Check size={26} className="text-green-500" />
            </div>
            <p className="font-bold text-gray-800 mb-1">Cucian Berhasil Ditambahkan!</p>
            <p className="text-sm text-gray-500">Mengarahkan ke halaman tracking...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Pelanggan <span className="text-red-400">*</span></label>
                <input name="customerName" value={form.customerName} onChange={handleChange} required
                  placeholder="Nama lengkap" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">No. Telepon <span className="text-red-400">*</span></label>
                <input name="phone" value={form.phone} onChange={handleChange} required
                  placeholder="08xxxxxxxxxx" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all" />
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jenis Layanan</label>
              <div className="grid grid-cols-3 gap-2">
                {SERVICES.map((s) => (
                  <label key={s}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${form.service === s ? "border-[#3ABDE8] bg-[#3ABDE8]/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="service" value={s} checked={form.service === s} onChange={handleChange} className="sr-only" />
                    <span className={`text-xs font-semibold leading-tight ${form.service === s ? "text-[#3ABDE8]" : "text-gray-600"}`}>{s}</span>
                    <span className="text-xs text-gray-400">Rp {priceMap[s].toLocaleString("id-ID")}/kg</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Weight + Payment */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Berat (kg) <span className="text-red-400">*</span></label>
                <input name="weight" type="number" min="0.1" step="0.1" value={form.weight} onChange={handleChange} required
                  placeholder="Contoh: 3.5" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Metode Pembayaran</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3ABDE8] transition-all">
                  {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Catatan (opsional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Contoh: ada noda membandel di bagian kerah..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 resize-none transition-all" />
            </div>

            {/* Total preview */}
            {total > 0 && (
              <div className="flex items-center justify-between bg-[#3ABDE8]/5 border border-[#3ABDE8]/20 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-600">Estimasi Total</span>
                <span className="text-base font-bold text-[#3ABDE8]">Rp {total.toLocaleString("id-ID")}</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#3ABDE8] text-white text-sm font-semibold hover:bg-[#2AADD8] transition-colors shadow-sm flex items-center justify-center gap-1.5">
                <Plus size={15} /> Tambah Cucian
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [period, setPeriod] = useState("minggu");
  const [showTambah, setShowTambah] = useState(false);

  const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const avgRating = (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1);
  const pendingOrders = transactions.filter((t) => t.status !== "selesai").length;

  const handleCucianSuccess = ({ customerName, service, weight, total }) => {
    toast("laundry", "Cucian Baru Ditambahkan!",
      `${customerName} · ${service} · ${weight} kg · Rp ${total.toLocaleString("id-ID")}`, 6000);
  };

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Selamat datang kembali, Admin">
        <div className="flex items-center gap-2">
          {/* Period filter */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {["hari", "minggu", "bulan"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? "bg-white text-[#3ABDE8] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {p}
              </button>
            ))}
          </div>
          {/* Tambah Cucian CTA */}
          <button
            onClick={() => setShowTambah(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1A667A] text-white rounded-xl text-sm font-semibold hover:bg-[#155a6b] transition-colors shadow-sm"
          >
            <Plus size={15} /> Tambah Cucian
          </button>
        </div>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard Icon={DollarSign} iconBg="bg-[#3ABDE8]/10" label="Total Pendapatan" value={`Rp ${totalRevenue.toLocaleString("id-ID")}`} sub="↑ 2.1% vs minggu lalu" />
        <StatCard Icon={Users} iconBg="bg-[#1A667A]/10" iconColor="text-[#1A667A]" label="Pelanggan Aktif" value={activeCustomers} sub="↑ 3 pelanggan baru" />
        <StatCard Icon={ClipboardList} iconBg="bg-orange-50" iconColor="text-orange-500" label="Order Pending" value={pendingOrders} sub="Perlu diproses" subColor="text-orange-500" />
        <StatCard Icon={Star} iconBg="bg-yellow-50" iconColor="text-yellow-500" label="Rata-rata Rating" value={`${avgRating}/5`} sub="Dari pelanggan" subColor="text-yellow-500" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Pendapatan</p>
              <p className="text-2xl font-bold text-gray-800">Rp {totalRevenue.toLocaleString("id-ID")}</p>
              <p className="text-xs text-green-500 font-medium mt-0.5">↑ 2.1% vs minggu lalu</p>
            </div>
            <Link to="/reports" className="text-xs text-[#3ABDE8] font-semibold hover:underline">Lihat Laporan</Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => [`Rp ${v.toLocaleString("id-ID")}`, ""]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="thisWeek" fill="#3ABDE8" radius={[4, 4, 0, 0]} name="Minggu Ini" />
              <Bar dataKey="lastWeek" fill="#1A667A" radius={[4, 4, 0, 0]} name="Minggu Lalu" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#3ABDE8]"></span><span className="text-xs text-gray-500">Minggu Ini</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1A667A]"></span><span className="text-xs text-gray-500">Minggu Lalu</span></div>
          </div>
        </div>

        {/* Service Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium">Distribusi Layanan</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5 mb-4">Jenis Layanan</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {serviceData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
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
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rating bars */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">Rating Layanan</p>
          <p className="text-sm font-bold text-gray-800 mb-4">Kepuasan Pelanggan</p>
          <div className="space-y-4">
            {ratingData.map((r, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">{r.name}</span>
                  <span className="text-xs font-bold text-gray-700">{r.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${r.value}%`, backgroundColor: r.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Trend Line */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Tren Order</p>
              <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
              <p className="text-xs text-red-500 font-medium mt-0.5">↓ 2.1% vs minggu lalu</p>
            </div>
            <Link to="/reports" className="text-xs text-[#3ABDE8] font-semibold hover:underline">Lihat Laporan</Link>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={orderTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="thisWeek" stroke="#3ABDE8" strokeWidth={2.5} dot={false} name="Minggu Ini" />
              <Line type="monotone" dataKey="lastWeek" stroke="#1A667A" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Minggu Lalu" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#3ABDE8]"></span><span className="text-xs text-gray-500">Minggu Ini</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1A667A]"></span><span className="text-xs text-gray-500">Minggu Lalu</span></div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-800">Transaksi Terbaru</p>
          <Link to="/transactions" className="text-xs text-[#3ABDE8] font-semibold hover:underline">Lihat Semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Pelanggan</th>
                <th className="pb-3 font-medium">Layanan</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-xs text-gray-400 font-mono">{t.id}</td>
                  <td className="py-3 font-medium text-gray-700">{t.customerName}</td>
                  <td className="py-3 text-gray-500 text-xs">{t.service}</td>
                  <td className="py-3 font-semibold text-gray-800">Rp {t.total.toLocaleString("id-ID")}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusMap[t.status] || "bg-gray-100 text-gray-600"}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tambah Cucian Modal */}
      {showTambah && (
        <TambahCucianModal
          onClose={() => setShowTambah(false)}
          onSuccess={handleCucianSuccess}
        />
      )}
    </div>
  );
}
