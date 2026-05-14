import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Pencil, Trash2, Zap, Clock,
  CheckCircle, AlertCircle, X, Phone, MapPin, Calendar, Receipt,
  Mail, TrendingUp, Star, Gift,
} from "lucide-react";
import customersData from "../data/customers.json";
import transactionsData from "../data/transactions.json";
import PageHeader from "../components/PageHeader";

const toast = (type, title, desc) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));

const segmentColors = {
  VIP:     "bg-purple-100 text-purple-700",
  Loyal:   "bg-blue-100 text-[#3ABDE8]",
  Regular: "bg-green-100 text-green-700",
  New:     "bg-yellow-100 text-yellow-700",
};

const statusColors = {
  active:   "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-600",
};

const serviceTypeConfig = {
  regular: { label: "Regular", Icon: Clock, bg: "bg-gray-100",     text: "text-gray-600" },
  express: { label: "Express", Icon: Zap,   bg: "bg-[#1A667A]/10", text: "text-[#1A667A]" },
};

const trxStatusColors = {
  selesai:  "bg-green-100 text-green-700",
  diproses: "bg-blue-100 text-[#3ABDE8]",
  menunggu: "bg-yellow-100 text-yellow-700",
};

// ── Modal Edit ────────────────────────────────────────────────────────────
function EditModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState({ ...customer });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Edit Pelanggan</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500">
            <X size={14} />
          </button>
        </div>
        <div className="space-y-4">
          {[
            { label: "Nama Lengkap", name: "name",    type: "text",  placeholder: "Masukkan nama" },
            { label: "No. Telepon",  name: "phone",   type: "tel",   placeholder: "08xxxxxxxxxx" },
            { label: "Email",        name: "email",   type: "email", placeholder: "email@contoh.com" },
            { label: "Alamat",       name: "address", type: "text",  placeholder: "Alamat lengkap" },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name] || ""} onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Segmen</label>
              <select name="segment" value={form.segment} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3ABDE8] transition-all">
                {["New", "Regular", "Loyal", "VIP"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3ABDE8] transition-all">
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Tipe Layanan</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "regular", label: "Regular", desc: "2–3 hari", Icon: Clock, activeClass: "border-[#3ABDE8] bg-[#3ABDE8]/5" },
                { value: "express", label: "Express", desc: "Same day",  Icon: Zap,   activeClass: "border-[#1A667A] bg-[#1A667A]/5" },
              ].map((opt) => {
                const isActive = form.serviceType === opt.value;
                return (
                  <label key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isActive ? opt.activeClass : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="serviceType" value={opt.value} checked={isActive} onChange={handleChange} className="sr-only" />
                    <opt.Icon size={15} className={`mt-0.5 flex-shrink-0 ${isActive ? (opt.value === "express" ? "text-[#1A667A]" : "text-[#3ABDE8]") : "text-gray-400"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? (opt.value === "express" ? "text-[#1A667A]" : "text-[#3ABDE8]") : "text-gray-700"}`}>{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-[#3ABDE8] text-white text-sm font-semibold hover:bg-[#2AADD8] shadow-sm">Simpan</button>
        </div>
      </div>
    </div>
  );
}

// ── Halaman Detail ────────────────────────────────────────────────────────
export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer,      setCustomer]      = useState(null);
  const [error,         setError]         = useState(null);
  const [editOpen,      setEditOpen]      = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const found = customersData.find((c) => String(c.id) === String(id));
    if (!found) setError("Pelanggan tidak ditemukan.");
    else setCustomer({ ...found, serviceType: found.serviceType || "regular" });
  }, [id]);

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={40} className="text-red-400 mb-3" />
      <p className="text-gray-600 font-semibold mb-1">{error}</p>
      <Link to="/customers" className="text-sm text-[#3ABDE8] hover:underline mt-2">Kembali ke daftar pelanggan</Link>
    </div>
  );

  if (!customer) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#3ABDE8] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const svcCfg      = serviceTypeConfig[customer.serviceType] || serviceTypeConfig.regular;
  const SvcIcon     = svcCfg.Icon;
  const customerTrx = transactionsData.filter((t) => t.customerId === customer.id);
  const totalBelanja = customerTrx.reduce((s, t) => s + t.total, 0);

  const handleSave = (form) => {
    setCustomer({ ...customer, ...form });
    setEditOpen(false);
    toast("success", "Pelanggan Diperbarui", `Data ${form.name} berhasil disimpan.`);
  };

  const handleDelete = () => {
    toast("warning", "Pelanggan Dihapus", `${customer.name} telah dihapus dari sistem.`);
    navigate("/customers");
  };

  return (
    <div>
      <PageHeader title="Detail Pelanggan" subtitle={`customers / ${customer.name}`}>
        <div className="flex gap-2">
          <Link to="/customers"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <ArrowLeft size={15} /> Kembali
          </Link>
          <button onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-yellow-50 text-yellow-600 rounded-xl text-sm font-semibold hover:bg-yellow-100 transition-colors">
            <Pencil size={15} /> Edit
          </button>
          <button onClick={() => setDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
            <Trash2 size={15} /> Hapus
          </button>
        </div>
      </PageHeader>

      {/* ── Hero Card: avatar lingkaran + info di samping ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar lingkaran dengan ring */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3ABDE8] to-[#1A667A] flex items-center justify-center text-white font-extrabold text-4xl shadow-lg ring-4 ring-[#3ABDE8]/20">
              {customer.name.charAt(0)}
            </div>
          </div>

          {/* Nama + badge + info kontak dalam grid */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            {/* Nama & badge */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">{customer.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${segmentColors[customer.segment]}`}>
                {customer.segment}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                {customer.status === "active" ? "Aktif" : "Tidak Aktif"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${svcCfg.bg} ${svcCfg.text}`}>
                <SvcIcon size={10} /> {svcCfg.label}
              </span>
            </div>

            {/* Email */}
            <p className="text-sm text-gray-400 mb-4 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail size={13} className="text-gray-300" /> {customer.email}
            </p>

            {/* Info kontak dalam grid 2x2 — di samping avatar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { Icon: Phone,    label: "No. Telepon",        value: customer.phone },
                { Icon: MapPin,   label: "Alamat",             value: customer.address },
                { Icon: Calendar, label: "Bergabung",          value: customer.joinDate },
                { Icon: Receipt,  label: "Transaksi Terakhir", value: customer.lastTransaction },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.Icon size={12} className="text-gray-400 flex-shrink-0" />
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{item.label}</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 leading-snug">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Statistik row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { Icon: TrendingUp, label: "Total Transaksi",  value: customer.totalTransactions + "x",                                              iconBg: "bg-[#3ABDE8]/10", iconColor: "text-[#3ABDE8]" },
          { Icon: Receipt,    label: "Total Belanja",    value: `Rp ${customer.totalSpent.toLocaleString("id-ID")}`,                           iconBg: "bg-green-50",     iconColor: "text-green-500" },
          { Icon: Star,       label: "Poin Loyalitas",   value: `${customer.points} poin`,                                                     iconBg: "bg-yellow-50",    iconColor: "text-yellow-500" },
          { Icon: Gift,       label: "Nilai Poin",       value: `Rp ${(Math.floor(customer.points / 100) * 5000).toLocaleString("id-ID")}`,    iconBg: "bg-purple-50",    iconColor: "text-purple-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
              <s.Icon size={18} className={s.iconColor} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Riwayat Transaksi ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-800">Riwayat Transaksi</p>
            <p className="text-xs text-gray-400 mt-0.5">{customerTrx.length} transaksi ditemukan</p>
          </div>
          <div className="flex items-center gap-4">
            {customerTrx.length > 0 && (
              <div className="hidden sm:flex gap-3 text-xs">
                <span className="text-gray-400">Total: <span className="font-bold text-[#3ABDE8]">Rp {totalBelanja.toLocaleString("id-ID")}</span></span>
                <span className="text-gray-400">Selesai: <span className="font-bold text-green-600">{customerTrx.filter((t) => t.status === "selesai").length}x</span></span>
              </div>
            )}
            <Link to="/transactions" className="text-xs text-[#3ABDE8] font-semibold hover:underline">
              Lihat Semua
            </Link>
          </div>
        </div>

        {customerTrx.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400">
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-5 py-3 font-semibold">Tanggal</th>
                  <th className="px-5 py-3 font-semibold">Layanan</th>
                  <th className="px-5 py-3 font-semibold">Berat</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Pembayaran</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customerTrx.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{t.id}</td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs">{t.date}</td>
                    <td className="px-5 py-3.5 text-gray-700 text-xs">{t.service}</td>
                    <td className="px-5 py-3.5 text-gray-600">{t.weight} kg</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800">Rp {t.total.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{t.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${trxStatusColors[t.status] || "bg-gray-100 text-gray-600"}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-14 text-gray-400">
            <Receipt size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">Belum ada transaksi untuk pelanggan ini</p>
          </div>
        )}
      </div>

      {/* Modal Edit */}
      {editOpen && (
        <EditModal customer={customer} onClose={() => setEditOpen(false)} onSave={handleSave} />
      )}

      {/* Konfirmasi Hapus */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Hapus Pelanggan?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Data <span className="font-semibold text-gray-700">{customer.name}</span> akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
