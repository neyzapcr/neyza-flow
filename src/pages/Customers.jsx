import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, Plus, Users, CheckCircle, Crown, Search } from "lucide-react";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";
import Button from "../components/Button";
import SearchInput from "../components/SearchInput";
import Modal from "../components/Modal";
import DynamicForm from "../components/DynamicForm"; // Panggil form langsung di sini
import ConfirmModal from "../components/ConfirmModal";
import Badge from "../components/Badge";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import Card from "../components/Card";
import Avatar from "../components/Avatar";

const toast = (type, title, desc) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));

const segmentVariant = { VIP: "purple", Loyal: "blue", Regular: "green", New: "yellow" };
const statusVariant = { active: "green", inactive: "red" };

export default function Customers() {
  const [customers, setCustomers] = useState(customersData.map((c) => ({ ...c, serviceType: c.serviceType || "regular" })));
  const [search, setSearch] = useState("");
  const [filterSegment, setFilterSegment] = useState("Semua");
  const [filterService, setFilterService] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [localForm, setLocalForm] = useState({}); // State penampung data form dinamis

  // 1. Definisikan struktur kolom untuk input data pelanggan
  const customerFields = [
    { name: "name", label: "Nama Lengkap", type: "text", placeholder: "Masukkan nama", required: true },
    { name: "phone", label: "No. Telepon", type: "tel", placeholder: "08xxxxxxxxxx", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "email@contoh.com" },
    { name: "address", label: "Alamat", type: "textarea", placeholder: "Alamat lengkap", rows: 3 },
    { name: "segment", label: "Segmen", type: "select", options: ["New", "Regular", "Loyal", "VIP"], defaultValue: "New" },
    { name: "status", label: "Status", type: "select", options: [{ value: "active", label: "Aktif" }, { value: "inactive", label: "Tidak Aktif" }], defaultValue: "active" }
  ];

  const filtered = customers.filter((c) => {
    const matchSearch  = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchSegment = filterSegment === "Semua" || c.segment === filterSegment;
    const matchService = filterService === "Semua" || c.serviceType === filterService;
    return matchSearch && matchSegment && matchService;
  });

  const handleSave = () => {
    if (editCustomer) {
      setCustomers(customers.map((c) => c.id === editCustomer.id ? { ...c, ...localForm } : c));
      toast("success", "Pelanggan Diperbarui", `Data ${localForm.name} berhasil disimpan.`);
    } else {
      setCustomers([...customers, { ...localForm, id: Date.now(), totalTransactions: 0, totalSpent: 0, points: 0, joinDate: new Date().toISOString().split("T")[0], lastTransaction: "-" }]);
      toast("success", "Pelanggan Ditambahkan", `${localForm.name} berhasil didaftarkan.`);
    }
    setShowModal(false);
    setEditCustomer(null);
  };

  const stats = [
    { label: "Total Pelanggan", value: customers.length, Icon: Users, color: "bg-blue-50", iconColor: "text-[#2940D3]" },
    { label: "Pelanggan Aktif", value: customers.filter((c) => c.status === "active").length, Icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-500" },
    { label: "Pelanggan VIP", value: customers.filter((c) => c.segment === "VIP").length, Icon: Crown, color: "bg-purple-50", iconColor: "text-purple-500" },
  ];

  return (
    <div>
      <PageHeader title="Manajemen Pelanggan" subtitle="Kelola data dan informasi pelanggan">
        <Button icon={<Plus size={15} />} onClick={() => { setEditCustomer(null); setLocalForm({}); setShowModal(true); }}>Tambah Pelanggan</Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-white`}>
            <s.Icon size={20} className={`${s.iconColor} mb-2`} />
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput className="flex-1" value={search} onChange={setSearch} placeholder="Cari nama atau nomor telepon..." />
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-400 font-medium">Segmen:</span>
            {["Semua", "VIP", "Loyal", "Regular", "New"].map((s) => (
              <button key={s} onClick={() => setFilterSegment(s)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filterSegment === s ? "bg-[#2940D3] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-400 font-medium">Layanan:</span>
            {[{ key: "Semua", label: "Semua" }, { key: "regular", label: "Regular" }, { key: "express", label: "Express" }].map((f) => (
              <button key={f.key} onClick={() => setFilterService(f.key)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filterService === f.key ? "bg-[#2940D3] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{f.label}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table headers={["Pelanggan", "Kontak", "Segmen", "Layanan", "Transaksi", "Total Belanja", "Poin", "Status", "Aksi"]}>
          {filtered.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} size="md" shape="rounded" color="bg-[#2940D3]/10" className="text-[#2940D3]" />
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
              <td className="px-5 py-4"><Badge variant={segmentVariant[c.segment] || "gray"}>{c.segment}</Badge></td>
              <td className="px-5 py-4"><Badge variant={c.serviceType === "express" ? "teal" : "gray"}>{c.serviceType}</Badge></td>
              <td className="px-5 py-4 font-semibold text-gray-700">{c.totalTransactions}x</td>
              <td className="px-5 py-4 font-semibold text-gray-800">Rp {c.totalSpent.toLocaleString("id-ID")}</td>
              <td className="px-5 py-4"><span className="text-[#2940D3] font-semibold">{c.points}</span><span className="text-xs text-gray-400 ml-1">poin</span></td>
              <td className="px-5 py-4"><Badge variant={statusVariant[c.status] || "gray"}>{c.status === "active" ? "Aktif" : "Tidak Aktif"}</Badge></td>
              <td className="px-5 py-4">
                <div className="flex gap-1">
                  <Link to={`/customers/${c.id}`} className="w-8 h-8 rounded-lg bg-blue-50 text-[#2940D3] flex items-center justify-center hover:bg-blue-100 transition-colors"><Eye size={14} /></Link>
                  <button onClick={() => { setEditCustomer(c); setLocalForm(c); setShowModal(true); }} className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-100 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteConfirm(c.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <EmptyState icon={<Search size={32} />} message="Tidak ada pelanggan ditemukan" />}
      </div>

      {/* Modal Tengah dengan Form Dinamis Langsung */}
      {showModal && (
        <Modal
          open
          onClose={() => { setShowModal(false); setEditCustomer(null); }}
          title={editCustomer ? "Edit Pelanggan" : "Tambah Pelanggan"}
          footer={
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={() => { setShowModal(false); setEditCustomer(null); }}>Batal</Button>
              <Button variant="primary" className="flex-1" onClick={handleSave}>Simpan</Button>
            </div>
          }
        >
          <DynamicForm
            fields={customerFields}
            initialData={editCustomer || { name: "", phone: "", email: "", address: "", segment: "New", status: "active", serviceType: "regular" }}
            onChange={setLocalForm}
          />
        </Modal>
      )}

      <ConfirmModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={() => { setCustomers(customers.filter(c => c.id !== deleteConfirm)); setDeleteConfirm(null); toast("warning", "Pelanggan Dihapus", "Data berhasil dihapus."); }} title="Hapus Pelanggan?" message="Data pelanggan akan dihapus permanen." confirmLabel="Hapus" variant="danger" />
    </div>
  );
}