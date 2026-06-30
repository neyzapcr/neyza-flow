import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, Plus, Users, CheckCircle, Crown, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../services/CustomerApi";
import Button from "../components/Button";
import SearchInput from "../components/SearchInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import DynamicForm from "../components/DynamicForm";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import Badge from "../components/Badge";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import Card from "../components/Card";
import Avatar from "../components/Avatar";

const toast = (type, title, desc) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));

const segmentVariant = { VIP: "purple", Loyal: "blue", Regular: "green", New: "yellow" };
const statusVariant = { active: "green", inactive: "red" };
const customerTypeVariant = { Pelajar: "yellow", Pekerja: "blue", "Ibu Rumah Tangga": "purple", Umum: "gray" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSegment, setFilterSegment] = useState("Semua");
  const [filterType, setFilterType] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [localForm, setLocalForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const customerFields = [
    { name: "customerName", label: "Nama Lengkap", type: "text", placeholder: "Masukkan nama lengkap", required: true },
    { name: "phone", label: "Nomor HP / WhatsApp", type: "tel", placeholder: "08xxxxxxxxxx", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "email@contoh.com" },
    { name: "address", label: "Alamat", type: "textarea", placeholder: "Alamat lengkap", rows: 3 },
    { name: "customerType", label: "Jenis Pelanggan", type: "select", options: ["Pelajar", "Pekerja", "Ibu Rumah Tangga", "Umum"], defaultValue: "Umum" },
    { name: "segment", label: "Segmen", type: "select", options: ["New", "Regular", "Loyal", "VIP"], defaultValue: "New" },
    { name: "status", label: "Status", type: "select", options: [{ value: "active", label: "Aktif" }, { value: "inactive", label: "Tidak Aktif" }], defaultValue: "active" }
  ];

  const filtered = customers.filter((c) => {
    const matchSearch  = (c.customerName || "").toLowerCase().includes(search.toLowerCase()) || (c.phone || "").includes(search);
    const matchSegment = filterSegment === "Semua" || c.segment === filterSegment;
    const matchType = filterType === "Semua" || c.customerType === filterType;
    return matchSearch && matchSegment && matchType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const paginatedCustomers = filtered.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pageNumbers.push("...");
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const handleSave = async () => {
    if (editCustomer) {
      try {
        const updated = await updateCustomer(editCustomer.id, localForm);
        setCustomers(customers.map((c) => c.id === editCustomer.id ? { ...c, ...updated } : c));
        toast("success", "Pelanggan Diperbarui", `Data ${localForm.customerName} berhasil disimpan.`);
      } catch (err) {
        console.error("Error updating customer:", err);
      }
    } else {
      try {
        const newCustId = `CUST-${String(Math.floor(1000 + Math.random() * 9000))}`;
        const newCust = {
          ...localForm,
          customerId: newCustId,
          userId: null,
          totalTransactions: 0,
          totalSpent: 0,
          points: 0,
          joinDate: new Date().toISOString().split("T")[0],
          lastTransaction: "-",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const created = await createCustomer(newCust);
        setCustomers([...customers, created]);
        toast("success", "Pelanggan Ditambahkan", `${localForm.customerName} berhasil didaftarkan.`);
      } catch (err) {
        console.error("Error creating customer:", err);
      }
    }
    setShowModal(false);
    setEditCustomer(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteCustomer(deleteConfirm);
      setCustomers(customers.filter(c => c.id !== deleteConfirm));
      toast("warning", "Pelanggan Dihapus", "Data berhasil dihapus.");
    } catch (err) {
      console.error("Error deleting customer:", err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const stats = [
    { label: "Total Pelanggan", value: customers.length, Icon: Users, color: "bg-blue-50", iconColor: "text-[#2940D3]" },
    { label: "Pelanggan Murni Aktif", value: customers.filter((c) => c.status === "active").length, Icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-500" },
    { label: "Pelanggan VIP", value: customers.filter((c) => c.segment === "VIP").length, Icon: Crown, color: "bg-purple-50", iconColor: "text-purple-500" },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Manajemen Pelanggan" subtitle="Kelola data dan informasi pelanggan">
        <Button icon={<Plus size={15} />} onClick={() => { setEditCustomer(null); setLocalForm({}); setShowModal(true); }}>Tambah Pelanggan</Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-white text-left`}>
            <s.Icon size={20} className={`${s.iconColor} mb-2`} />
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput className="flex-1" value={search} onChange={(v) => { setSearch(v); setCurrentPage(1); }} placeholder="Cari nama atau nomor telepon..." />
          <div className="flex gap-2 flex-wrap items-center text-left">
            <span className="text-xs text-gray-400 font-medium">Segmen:</span>
            {["Semua", "VIP", "Loyal", "Regular", "New"].map((s) => (
              <button key={s} onClick={() => { setFilterSegment(s); setCurrentPage(1); }} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filterSegment === s ? "bg-[#2940D3] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-2 items-center flex-wrap text-left">
            <span className="text-xs text-gray-400 font-medium">Jenis Pelanggan:</span>
            {["Semua", "Pelajar", "Pekerja", "Ibu Rumah Tangga", "Umum"].map((t) => (
              <button key={t} onClick={() => { setFilterType(t); setCurrentPage(1); }} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filterType === t ? "bg-[#2940D3] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{t}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table & Pagination Wrapper */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table headers={["Pelanggan", "Kontak", "Segmen", "Jenis Pelanggan", "Transaksi", "Total Belanja", "Poin", "Status", "Aksi"]}>
          {paginatedCustomers.map((c) => (
            <tr key={c.customerId} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4 text-left">
                <div className="flex items-center gap-3">
                  <Avatar name={c.customerName} size="md" shape="rounded" color="bg-[#2940D3]/10" className="text-[#2940D3]" />
                  <div>
                    <p className="font-semibold text-gray-800">{c.customerName}</p>
                    <p className="text-xs text-gray-400">Bergabung {c.joinDate}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-left">
                <p className="text-gray-700">{c.phone}</p>
                <p className="text-xs text-gray-400">{c.email}</p>
              </td>
              <td className="px-5 py-4 text-left"><Badge variant={segmentVariant[c.segment] || "gray"}>{c.segment}</Badge></td>
              <td className="px-5 py-4 text-left"><Badge variant={customerTypeVariant[c.customerType] || "gray"}>{c.customerType}</Badge></td>
              <td className="px-5 py-4 text-left font-semibold text-gray-700">{c.totalTransactions}x</td>
              <td className="px-5 py-4 text-left font-semibold text-gray-800">Rp {(c.totalSpent || 0).toLocaleString("id-ID")}</td>
              <td className="px-5 py-4 text-left"><span className="text-[#2940D3] font-semibold">{c.points}</span><span className="text-xs text-gray-400 ml-1">poin</span></td>
              <td className="px-5 py-4 text-left"><Badge variant={statusVariant[c.status] || "gray"}>{c.status === "active" ? "Aktif" : "Tidak Aktif"}</Badge></td>
              <td className="px-5 py-4 text-left">
                <div className="flex gap-1">
                  <Link to={`/customers/${c.customerId}`} className="w-8 h-8 rounded-lg bg-blue-50 text-[#2940D3] flex items-center justify-center hover:bg-blue-100 transition-colors"><Eye size={14} /></Link>
                  <button onClick={() => { setEditCustomer(c); setLocalForm(c); setShowModal(true); }} className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-100 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteConfirm(c.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <EmptyState icon={<Search size={32} />} message="Tidak ada pelanggan ditemukan" />}

        {/* Pagination Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <p className="text-xs text-gray-500 text-left font-medium">
              Menampilkan <span className="font-semibold text-gray-850">{filtered.length === 0 ? 0 : startIndex + 1}</span>–
              <span className="font-semibold text-gray-850">{endIndex}</span> dari{" "}
              <span className="font-semibold text-gray-850">{filtered.length}</span> pelanggan
            </p>
            <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
              {/* Items per Page Selector */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Baris per halaman:</span>
                <div className="relative flex items-center">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-8 py-1.5 outline-none text-gray-700 font-semibold cursor-pointer hover:border-gray-300 transition-all text-xs"
                  >
                    {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <div className="absolute right-2.5 pointer-events-none text-gray-400">
                    <ChevronDown size={12} />
                  </div>
                </div>
              </div>
              {/* Page Buttons */}
              <div className="flex gap-1 items-center">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                  title="Sebelumnya"
                >
                  <ChevronLeft size={15} />
                </button>
                <div className="flex gap-0.5 items-center">
                  {getPageNumbers().map((p, index) => {
                    if (p === "...") {
                      return (
                        <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-xs text-gray-400 font-medium select-none">
                          ...
                        </span>
                      );
                    }
                    const isActive = currentPage === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-[#2940D3] text-white shadow-md shadow-[#2940D3]/20 scale-105"
                            : "text-gray-500 hover:bg-blue-50 hover:text-[#2940D3]"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                  title="Selanjutnya"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={(openState) => { if (!openState) { setShowModal(false); setEditCustomer(null); } }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-lagusans p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left">
            <DialogTitle className="text-base font-bold text-gray-800">
              {editCustomer ? "Edit Pelanggan" : "Tambah Pelanggan"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-700">
            <DynamicForm
              fields={customerFields}
              initialData={editCustomer || { customerName: "", phone: "", email: "", address: "", customerType: "Umum", segment: "New", status: "active" }}
              onChange={setLocalForm}
            />
          </div>

          <div className="px-6 pb-6 flex-shrink-0">
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={() => { setShowModal(false); setEditCustomer(null); }}>Batal</Button>
              <Button variant="primary" className="flex-1" onClick={handleSave}>Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(openState) => { if (!openState) setDeleteConfirm(null); }}>
        <AlertDialogContent className="font-lagusans max-w-sm rounded-2xl bg-white border-none shadow-2xl p-6">
          <AlertDialogHeader className="flex flex-col items-center text-center gap-0">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-3">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <AlertDialogTitle className="font-bold text-gray-800 mb-2 text-center w-full">Hapus Pelanggan?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 text-center w-full">
              Data pelanggan akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 mt-4 w-full">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                Batal
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="danger" className="flex-1" onClick={handleDelete}>
                Hapus
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}