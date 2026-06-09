import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { DollarSign, Users, ClipboardList, Star, Plus, Check } from "lucide-react";
import PageHeader from "../components/PageHeader";
import rawCustomers from "../data/customers.json";
const customers = rawCustomers.flatMap(c => (c.transactionHistory?.length ? c.transactionHistory : [{}]).map(h => ({
  ...c,
  customerId: h.customerId || c.customerId || String(Math.random()),
  joinDate: h.joinDate || c.joinDate || "-",
  totalTransactions: h.totalTransactions ?? c.totalTransactions ?? 0,
  totalSpent: h.totalSpent ?? c.totalSpent ?? 0,
  points: h.points ?? c.points ?? 0,
  segment: h.segment || c.segment || "New",
  lastTransaction: h.lastTransaction || c.lastTransaction || "-",
  status: h.status || c.status || "active",
})));
import transactions from "../data/transactions.json";
import feedback from "../data/feedback.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Table from "../components/Table";
import Input from "../components/Input";
import Select from "../components/Select";
import TextArea from "../components/TextArea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { Combobox } from "../components/ui/combobox";

// Helper — kirim toast tanpa import context
const toast = (type, title, desc, duration) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc, duration } }));

// ── Konfigurasi & Status ──────────────────────────────────────────────────────
const statusMap = { selesai: "green", diproses: "blue", menunggu: "yellow" };
const SERVICES = ["Cuci + Setrika", "Cuci Kering", "Cuci + Setrika + Parfum", "Cuci Basah", "Setrika Saja"];
const PAYMENT_METHODS = ["Cash", "Transfer", "QRIS"];
const priceMap = {
  "Cuci + Setrika": 8000,
  "Cuci Kering": 7000,
  "Cuci + Setrika + Parfum": 12000,
  "Cuci Basah": 6000,
  "Setrika Saja": 5000,
};

const PIE_COLORS = ["#2940D3", "#142297", "#7DD3F0", "#3ABDE8", "#A5F3FC"];

const chartConfig = {
  thisWeek: { label: "Minggu Ini", color: "#2940D3" },
  lastWeek: { label: "Minggu Lalu", color: "#142297" },
};

const pieChartConfig = {
  value: { label: "Porsi" },
  "Cuci + Setrika": { label: "Cuci + Setrika", color: "#2940D3" },
  "Cuci Kering": { label: "Cuci Kering", color: "#142297" },
  "Cuci + Setrika + Parfum": { label: "Cuci + Setrika + Parfum", color: "#7DD3F0" },
  "Cuci Basah": { label: "Cuci Basah", color: "#3ABDE8" },
  "Setrika Saja": { label: "Setrika Saja", color: "#A5F3FC" },
};

const Legend = () => (
  <div className="flex gap-4 mt-2">
    {[{ bg: "bg-[#2940D3]", label: "Minggu Ini" }, { bg: "bg-[#142297]", label: "Minggu Lalu" }].map(l => (
      <div key={l.label} className="flex items-center gap-1.5">
        <span className={`w-3 h-3 rounded-full ${l.bg}`}></span>
        <span className="text-xs text-gray-500">{l.label}</span>
      </div>
    ))}
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("minggu");

  // ── Perhitungan Data Grafik Dinamis dari File JSON ────────────────────────
  const maxDateStr = transactions.map(t => t.date).filter(Boolean).sort().pop() || "2026-05-31";
  const [yr, mt, dy] = maxDateStr.split("-").map(Number);

  const getOffsetDay = (offset) => {
    const d = new Date(yr, mt - 1, dy - offset);
    return {
      dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      dayLabel: String(d.getDate()).padStart(2, "0")
    };
  };

  const thisWeekDays = Array.from({ length: 7 }, (_, i) => getOffsetDay(6 - i));
  const lastWeekDays = Array.from({ length: 7 }, (_, i) => getOffsetDay(13 - i));

  const dailyStats = {};
  transactions.forEach(t => t.date && ((dailyStats[t.date] ||= { revenue: 0, count: 0 }).revenue += t.total, dailyStats[t.date].count++));

  const [revenueData, orderTrendData] = ["revenue", "count"].map(key =>
    thisWeekDays.map((day, idx) => ({
      day: day.dayLabel,
      thisWeek: dailyStats[day.dateStr]?.[key] || 0,
      lastWeek: dailyStats[lastWeekDays[idx].dateStr]?.[key] || 0,
    }))
  );

  const serviceCounts = {};
  transactions.forEach(t => t.service && (serviceCounts[t.service] = (serviceCounts[t.service] || 0) + 1));
  const serviceData = Object.entries(serviceCounts).map(([name, count]) => ({
    name,
    value: Math.round((count / (transactions.length || 1)) * 100)
  })).sort((a, b) => b.value - a.value);

  const ratingData = ["Kebersihan", "Kecepatan", "Pelayanan"].map((cat, idx) => {
    const fbs = feedback.filter(f => f.category === cat);
    const avg = fbs.length ? fbs.reduce((s, f) => s + f.rating, 0) / fbs.length : 4;
    return { name: cat, value: Math.round((avg / 5) * 100), color: idx % 2 === 0 ? "#2940D3" : "#142297" };
  });
  const [showTambah, setShowTambah] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localForm, setLocalForm] = useState({});
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const handleInputChange = (name, val) => {
    setLocalForm(prev => ({ ...prev, [name]: val }));
  };

  const handleCustomerSelect = (val) => {
    setSelectedCustomerId(val);
    const cust = val !== "new_customer" && customers.find(c => c.customerId === val);
    setLocalForm(prev => ({
      ...prev,
      customerName: cust ? cust.customerName : "",
      phone: cust ? cust.phone : "",
    }));
  };

  const seen = new Set();
  const customerOptions = [
    { label: "+ Tambah Pelanggan Baru", value: "new_customer" },
    ...customers.filter(c => !seen.has(c.customerName) && seen.add(c.customerName))
                .map(c => ({ label: `${c.customerName} (${c.phone})`, value: c.customerId }))
  ];

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
          <button onClick={() => { setShowTambah(true); setSelectedCustomerId(""); setLocalForm({ service: SERVICES[0], paymentMethod: PAYMENT_METHODS[0] }); }} className="flex items-center gap-1.5 px-4 py-2 bg-[#142297] text-white rounded-xl text-sm font-semibold hover:bg-[#155a6b] transition-colors shadow-sm">
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
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={revenueData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />} />
              <Bar dataKey="thisWeek" fill="var(--color-thisWeek)" radius={[4, 4, 0, 0]} name="Minggu Ini" />
              <Bar dataKey="lastWeek" fill="var(--color-lastWeek)" radius={[4, 4, 0, 0]} name="Minggu Lalu" />
            </BarChart>
          </ChartContainer>
          <Legend />
        </Card>

        {/* Service Pie */}
        <Card>
          <p className="text-xs text-gray-400 font-medium">Distribusi Layanan</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5 mb-4">Jenis Layanan</p>
          <ChartContainer config={pieChartConfig} className="h-[160px] w-full">
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {serviceData.map((s, i) => <Cell key={i} fill={pieChartConfig[s.name]?.color || PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
            </PieChart>
          </ChartContainer>
          <div className="space-y-2 mt-2">
            {serviceData.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieChartConfig[s.name]?.color || PIE_COLORS[i % PIE_COLORS.length] }}></span>
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
          <ChartContainer config={chartConfig} className="h-[160px] w-full">
            <LineChart data={orderTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="thisWeek" stroke="var(--color-thisWeek)" strokeWidth={2.5} dot={false} name="Minggu Ini" />
              <Line type="monotone" dataKey="lastWeek" stroke="var(--color-lastWeek)" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Minggu Lalu" />
            </LineChart>
          </ChartContainer>
          <Legend />
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
      <Dialog open={showTambah} onOpenChange={(openState) => { if (!openState) { setShowTambah(false); setLocalForm({}); setSelectedCustomerId(""); } }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-lagusans p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left">
            <DialogTitle className="text-base font-bold text-gray-800">Tambah Cucian Baru</DialogTitle>
            <DialogDescription className="text-xs text-gray-400 mt-0.5">Isi data pelanggan dan detail cucian</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-700">
            {saved ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Check size={26} className="text-green-500" /></div>
                <p className="font-bold text-gray-800 mb-1">Cucian Berhasil Ditambahkan!</p>
                <p className="text-sm text-gray-500">Mengarahkan ke halaman tracking...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Pilih Pelanggan</label>
                    <Combobox
                      options={customerOptions}
                      value={selectedCustomerId}
                      onChange={handleCustomerSelect}
                      placeholder="Pilih pelanggan atau tambah baru..."
                      emptyMessage="Pelanggan tidak ditemukan."
                    />
                  </div>

                  {/* Show text inputs if new_customer or custom customer is being filled */}
                  {(selectedCustomerId === "new_customer" || !selectedCustomerId) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1">
                      <Input
                        label="Nama Pelanggan"
                        name="customerName"
                        value={localForm.customerName || ""}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        placeholder="Nama lengkap"
                        required
                      />
                      <Input
                        label="No. Telepon"
                        name="phone"
                        type="tel"
                        value={localForm.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                  )}

                  {/* Show read-only details if existing customer selected */}
                  {selectedCustomerId && selectedCustomerId !== "new_customer" && (
                    <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 flex justify-between items-center text-xs text-left">
                      <div>
                        <p className="font-bold text-gray-700">{localForm.customerName}</p>
                        <p className="text-gray-400 mt-0.5">{localForm.phone}</p>
                      </div>
                      <Badge variant="blue">Pelanggan Terdaftar</Badge>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Berat (kg)"
                      name="weight"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={localForm.weight || ""}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="Contoh: 3.5"
                      required
                    />
                    <Select
                      label="Metode Pembayaran"
                      name="paymentMethod"
                      value={localForm.paymentMethod || PAYMENT_METHODS[0]}
                      onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                      options={PAYMENT_METHODS}
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jenis Layanan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SERVICES.map((s) => {
                        const isActive = (localForm.service || SERVICES[0]) === s;
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

                  <TextArea
                    label="Catatan (opsional)"
                    name="notes"
                    value={localForm.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Contoh: ada noda membandel..."
                    rows={2}
                  />
                </div>

                {total > 0 && (
                  <div className="flex items-center justify-between bg-[#2940D3]/5 border border-[#2940D3]/20 rounded-xl px-4 py-3 text-left">
                    <span className="text-sm text-gray-600">Estimasi Total</span>
                    <span className="text-base font-bold text-[#2940D3]">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowTambah(false); setLocalForm({}); setSelectedCustomerId(""); }}>Batal</Button>
                  <Button type="submit" variant="primary" icon={<Plus size={15} />} className="flex-1">Tambah Cucian</Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}