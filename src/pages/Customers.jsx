import { useState } from "react";
import {
  Eye, Pencil, Trash2, Plus, Search,
  Users, CheckCircle, Crown, AlertCircle, X, Zap, Clock,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";
import { useToast } from "../context/ToastContext";

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
  regular: { label: "Regular", Icon: Clock, bg: "bg-gray-100",      text: "text-gray-600" },
  express: { label: "Express", Icon: Zap,   bg: "bg-[#1A667A]/10",  text: "text-[#1A667A]" },
};

// ── Modal Tambah / Edit ───────────────────────────────────────────────────
function CustomerModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState(
    customer || {
      name: "", phone: "", email: "", address: "",
      segment: "New", status: "active", serviceType: "regular",
    }
  );
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {customer ? "Edit Pelanggan" : "Tambah Pelanggan"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Field teks */}
          {[
            { label: "Nama Lengkap", name: "name",    type: "text",  placeholder: "Masukkan nama" },
            { label: "No. Telepon",  name: "phone",   type: "tel",   placeholder: "08xxxxxxxxxx" },
            { label: "Email",        name: "email",   type: "email", placeholder: "email@contoh.com" },
            { label: "Alamat",       name: "address", type: "text",  placeholder: "Alamat lengkap" },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
              <input
                type={f.type} name={f.name} value={form[f.name] || ""}
                onChange={handleChange} placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all"
              />
            </div>
          ))}

          {/* Segmen + Status */}
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

          {/* Tipe Layanan */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Tipe Layanan Pilihan</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "regular", label: "Regular", desc: "Pengerjaan 2–3 hari", Icon: Clock, activeClass: "border-[#3ABDE8] bg-[#3ABDE8]/5" },
                { value: "express", label: "Express", desc: "Same day / next day",  Icon: Zap,   activeClass: "border-[#1A667A] bg-[#1A667A]/5" },
              ].map((opt) => {
                const isActive = form.serviceType === opt.value;
                return (
                  <label key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isActive ? opt.activeClass : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="serviceType" value={opt.value}
                      checked={isActive} onChange={handleChange} className="sr-only" />
                    <opt.Icon size={16} className={`mt-0.5 flex-shrink-0 ${isActive ? (opt.value === "express" ? "text-[#1A667A]" : "text-[#3ABDE8]") : "text-gray-400"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? (opt.value === "express" ? "text-[#1A667A]" : "text-[#3ABDE8]") : "text-gray-700"}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-[#3ABDE8] text-white text-sm font-semibold hover:bg-[#2AADD8] transition-colors shadow-sm">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Detail ──────────────────────────────────────────────────────────
function CustomerDetail({ customer, onClose }) {
  const svcCfg = serviceTypeConfig[customer.serviceType] || serviceTypeConfig.regular;
  const SvcIcon = svcCfg.Icon;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Profil Pelanggan</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500">
            <X size={14} />
          </button>
        </div>

        {/* Avatar + info */}
        <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#3ABDE8] flex items-center justify-center text-white font-bold text-xl shadow">
            {customer.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-base">{customer.name}</p>
            <p className="text-sm text-gray-500">{customer.phone}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${segmentColors[customer.segment]}`}>
                {customer.segment}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                {customer.status === "active" ? "Aktif" : "Tidak Aktif"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${svcCfg.bg} ${svcCfg.text}`}>
                <SvcIcon size={10} /> {svcCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Total Transaksi",  value: customer.totalTransactions + "x" },
            { label: "Total Pengeluaran", value: `Rp ${customer.totalSpent.toLocaleString("id-ID")}` },
            { label: "Poin Loyalitas",   value: `${customer.points} poin` },
            { label: "Bergabung",        value: customer.joinDate },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="font-bold text-gray-800 text-sm mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-xs text-gray-400 mb-1">Alamat</p>
          <p className="text-sm text-gray-700">{customer.address}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Email</p>
          <p className="text-sm text-gray-700">{customer.email}</p>
        </div>

        <button onClick={onClose} className="w-full mt-5 py-2.5 rounded-xl bg-[#3ABDE8] text-white text-sm font-semibold hover:bg-[#2AADD8] transition-colors">
          Tutup
        </button>
      </div>
    </div>
  );
}

// ── Halaman utama ─────────────────────────────────────────────────────────
export default function Customers() {
  const [customers,     setCustomers]     = useState(
    customersData.map((c) => ({ ...c, serviceType: c.serviceType || "regular" }))
  );
  const [search,        setSearch]        = useState("");
  const [filterSegment, setFilterSegment] = useState("Semua");
  const [filterService, setFilterService] = useState("Semua");
  const [showModal,     setShowModal]     = useState(false);
  const [editCustomer,  setEditCustomer]  = useState(null);
  const [viewCustomer,  setViewCustomer]  = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { addToast } = useToast();

  const filtered = customers.filter((c) => {
    const matchSearch  = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchSegment = filterSegment === "Semua" || c.segment === filterSegment;
    const matchService = filterService === "Semua" || c.serviceType === filterService;
    return matchSearch && matchSegment && matchService;
  });

  const handleSave = (form) => {
    if (editCustomer) {
      setCustomers(customers.map((c) => c.id === editCustomer.id ? { ...c, ...form } : c));
      addToast({ type: "success", title: "Pelanggan Diperbarui", desc: `Data ${form.name} berhasil disimpan.` });
    } else {
      setCustomers([...customers, {
        ...form, id: Date.now(),
        totalTransactions: 0, totalSpent: 0, points: 0,
        joinDate: new Date().toISOString().split("T")[0], lastTransaction: "-",
      }]);
      addToast({ type: "success", title: "Pelanggan Ditambahkan", desc: `${form.name} berhasil didaftarkan.` });
    }
    setShowModal(false);
    setEditCustomer(null);
  };

  const handleDelete = (id) => {
    const c = customers.find((x) => x.id === id);
    setCustomers(customers.filter((c) => c.id !== id));
    setDeleteConfirm(null);
    addToast({ type: "warning", title: "Pelanggan Dihapus", desc: `${c?.name} telah dihapus dari sistem.` });
  };

  const stats = [
    { label: "Total Pelanggan",  value: customers.length,                                          Icon: Users,        color: "bg-blue-50",   iconColor: "text-[#3ABDE8]" },
    { label: "Pelanggan Aktif",  value: customers.filter((c) => c.status === "active").length,     Icon: CheckCircle,  color: "bg-green-50",  iconColor: "text-green-500" },
    { label: "Pelanggan VIP",    value: customers.filter((c) => c.segment === "VIP").length,       Icon: Crown,        color: "bg-purple-50", iconColor: "text-purple-500" },
    { label: "Layanan Express",  value: customers.filter((c) => c.serviceType === "express").length, Icon: Zap,        color: "bg-teal-50",   iconColor: "text-[#1A667A]" },
  ];

  return (
    <div>
      <PageHeader title="Manajemen Pelanggan" subtitle="Kelola data dan informasi pelanggan">
        <button
          onClick={() => { setEditCustomer(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3ABDE8] text-white rounded-xl text-sm font-semibold hover:bg-[#2AADD8] transition-colors shadow-sm"
        >
          <Plus size={15} /> Tambah Pelanggan
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-white`}>
            <s.Icon size={20} className={`${s.iconColor} mb-2`} />
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Cari nama atau nomor telepon..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full text-gray-600 placeholder-gray-400" />
          </div>

          {/* Filter segmen */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-400 font-medium">Segmen:</span>
            {["Semua", "VIP", "Loyal", "Regular", "New"].map((s) => (
              <button key={s} onClick={() => setFilterSegment(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filterSegment === s ? "bg-[#3ABDE8] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Filter tipe layanan */}
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-400 font-medium">Layanan:</span>
            {[
              { key: "Semua",   label: "Semua" },
              { key: "regular", label: "Regular" },
              { key: "express", label: "Express" },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilterService(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filterService === f.key
                    ? f.key === "express" ? "bg-[#1A667A] text-white shadow-sm" : "bg-[#3ABDE8] text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}>
                {f.key === "express" && <Zap size={11} />}
                {f.key === "regular" && <Clock size={11} />}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-5 py-3.5 font-semibold">Pelanggan</th>
                <th className="px-5 py-3.5 font-semibold">Kontak</th>
                <th className="px-5 py-3.5 font-semibold">Segmen</th>
                <th className="px-5 py-3.5 font-semibold">Layanan</th>
                <th className="px-5 py-3.5 font-semibold">Transaksi</th>
                <th className="px-5 py-3.5 font-semibold">Total Belanja</th>
                <th className="px-5 py-3.5 font-semibold">Poin</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => {
                const svcCfg = serviceTypeConfig[c.serviceType] || serviceTypeConfig.regular;
                const SvcIcon = svcCfg.Icon;
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#3ABDE8]/10 flex items-center justify-center text-[#3ABDE8] font-bold text-sm flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{c.name}</p>
                          <p className="text-xs text-gray-400">Bergabung {c.joinDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-700">{c.phone}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${segmentColors[c.segment]}`}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${svcCfg.bg} ${svcCfg.text}`}>
                        <SvcIcon size={11} /> {svcCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-700">{c.totalTransactions}x</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">Rp {c.totalSpent.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-4">
                      <span className="text-[#3ABDE8] font-semibold">{c.points}</span>
                      <span className="text-xs text-gray-400 ml-1">poin</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                        {c.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => setViewCustomer(c)} className="w-8 h-8 rounded-lg bg-blue-50 text-[#3ABDE8] flex items-center justify-center hover:bg-blue-100 transition-colors" title="Lihat Detail">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => { setEditCustomer(c); setShowModal(true); }} className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-100 transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(c.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Tidak ada pelanggan ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <CustomerModal
          customer={editCustomer}
          onClose={() => { setShowModal(false); setEditCustomer(null); }}
          onSave={handleSave}
        />
      )}
      {viewCustomer && <CustomerDetail customer={viewCustomer} onClose={() => setViewCustomer(null)} />}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Hapus Pelanggan?</h3>
            <p className="text-sm text-gray-500 mb-5">Data pelanggan akan dihapus permanen dan tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
