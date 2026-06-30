import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2, Phone, MapPin, Calendar, Receipt, Mail, TrendingUp, Star, Gift } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { supabase } from "../services/supabaseClient";
import { updateCustomer, deleteCustomer } from "../services/CustomerApi";
import { getTransactionByCustomer } from "../services/TransactionApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import Button from "../components/Button";
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
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/Avatar";

const toast = (type, title, desc) => window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));
const segmentVariant = { VIP: "purple", Loyal: "blue", Regular: "green", New: "yellow" };
const customerTypeVariant = { Pelajar: "yellow", Pekerja: "blue", "Ibu Rumah Tangga": "purple", Umum: "gray" };

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [customerTrx, setCustomerTrx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [localForm, setLocalForm] = useState({});

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      // Resolve customer record by customerCode (which matches URL param 'id')
      const { data: cust, error: custErr } = await supabase
        .from("customers")
        .select("*")
        .eq("customerCode", id)
        .maybeSingle();

      if (custErr) throw custErr;
      if (!cust) {
        setError("Pelanggan tidak ditemukan.");
        return;
      }

      const mappedCust = {
        ...cust,
        customerId: cust.customerCode,
        status: cust.status === "Active" ? "active" : "inactive"
      };

      setCustomer(mappedCust);
      setLocalForm(mappedCust);

      // Fetch transaction list for customer using customer UUID id
      const trxs = await getTransactionByCustomer(cust.id);
      setCustomerTrx(trxs);
    } catch (err) {
      console.error("Failed to load customer details:", err);
      setError("Gagal memuat detail pelanggan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, [id]);

  const handleUpdate = async () => {
    if (!customer) return;
    try {
      setLoading(true);
      const updated = await updateCustomer(customer.id, localForm);
      setCustomer(updated);
      setLocalForm(updated);
      toast("success", "Pelanggan Diperbarui", "Data berhasil disimpan.");
      setEditOpen(false);
      await loadCustomerData();
    } catch (err) {
      console.error("Failed to update customer:", err);
      toast("error", "Gagal Memperbarui", "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer) return;
    try {
      setLoading(true);
      await deleteCustomer(customer.id);
      toast("warning", "Pelanggan Dihapus", "Data berhasil dihapus.");
      setDeleteConfirm(false);
      navigate("/customers");
    } catch (err) {
      console.error("Failed to delete customer:", err);
      toast("error", "Gagal Menghapus", "Terjadi kesalahan saat menghapus data.");
      setLoading(false);
    }
  };

  if (error) return <div className="text-center py-20 font-semibold">{error} <Link to="/customers" className="text-[#2940D3] block mt-2 hover:underline">Kembali</Link></div>;
  if (loading && !customer) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#2940D3] border-t-transparent rounded-full animate-spin" /></div>;
  if (!customer) return null;

  return (
    <div>
      <PageHeader title="Detail Pelanggan" subtitle={`customers / ${customer.customerName}`}>
        <div className="flex gap-2">
          <Link to="/customers"><Button variant="outline" icon={<ArrowLeft size={15} />}>Kembali</Button></Link>
          <Button variant="warning" icon={<Pencil size={15} />} onClick={() => { setLocalForm(customer); setEditOpen(true); }}>Edit</Button>
          <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setDeleteConfirm(true)}>Hapus</Button>
        </div>
      </PageHeader>

      <Card className="p-6 mb-5 text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar name={customer.customerName} size="xl" shape="circle" color="bg-gradient-to-br from-[#2940D3] to-[#142297]" className="shadow-lg ring-4 ring-[#2940D3]/20" />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">{customer.customerName}</h2>
              <Badge variant={segmentVariant[customer.segment] || "gray"}>{customer.segment}</Badge>
              <Badge variant={customer.status === "active" ? "green" : "red"}>{customer.status === "active" ? "Aktif" : "Tidak Aktif"}</Badge>
              <Badge variant={customerTypeVariant[customer.customerType] || "gray"}>{customer.customerType}</Badge>
            </div>
            <p className="text-sm text-gray-400 mb-4 flex items-center justify-center sm:justify-start gap-1.5"><Mail size={13} /> {customer.email}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{ Icon: Phone, label: "No. Telepon", value: customer.phone }, { Icon: MapPin, label: "Alamat", value: customer.address }, { Icon: Calendar, label: "Bergabung", value: customer.joinDate }, { Icon: Receipt, label: "Transaksi Terakhir", value: customer.lastTransaction }].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5 text-left">
                  <div className="flex items-center gap-1.5 mb-1"><item.Icon size={12} className="text-gray-400" /><p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{item.label}</p></div>
                  <p className="text-xs font-semibold text-gray-700 leading-snug">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5 text-left">
        <StatCard Icon={TrendingUp} label="Total Transaksi" value={customer.totalTransactions + "x"} />
        <StatCard Icon={Receipt} iconBg="bg-green-50" iconColor="text-green-500" label="Total Belanja" value={`Rp ${(customer.totalSpent || 0).toLocaleString("id-ID")}`} />
        <StatCard Icon={Star} iconBg="bg-yellow-50" iconColor="text-yellow-500" label="Poin Loyalitas" value={`${customer.points || 0} poin`} />
        <StatCard Icon={Gift} iconBg="bg-purple-50" iconColor="text-purple-500" label="Nilai Poin" value={`Rp ${(Math.floor((customer.points || 0) / 100) * 5000).toLocaleString("id-ID")}`} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="text-left"><p className="font-bold text-gray-800">Riwayat Transaksi</p><p className="text-xs text-gray-400 mt-0.5">{customerTrx.length} ditemukan</p></div>
          <Link to="/transactions" className="text-xs text-[#2940D3] font-semibold hover:underline">Lihat Semua</Link>
        </div>
        {customerTrx.length > 0 ? (
          <Table headers={["ID", "Tanggal", "Layanan", "Berat", "Total", "Pembayaran", "Status"]}>
            {customerTrx.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{t.transactionId}</td>
                <td className="px-5 py-3.5 text-gray-600 text-xs">{t.receivedDate}</td>
                <td className="px-5 py-3.5 text-gray-700 text-xs">{t.service}</td>
                <td className="px-5 py-3.5 text-gray-600">{t.weight} kg</td>
                <td className="px-5 py-3.5 font-semibold text-gray-800">Rp {t.total.toLocaleString("id-ID")}</td>
                <td className="px-5 py-3.5"><Badge variant="gray">{t.paymentMethod}</Badge></td>
                <td className="px-5 py-3.5"><Badge variant={t.status === "selesai" ? "green" : t.status === "diproses" ? "blue" : "yellow"} className="capitalize">{t.status}</Badge></td>
              </tr>
            ))}
          </Table>
        ) : <EmptyState icon={<Receipt size={32} />} message="Belum ada transaksi untuk pelanggan ini" />}
      </div>

      <Dialog open={editOpen} onOpenChange={(openState) => { if (!openState) setEditOpen(false); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-lagusans p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left bg-white">
            <DialogTitle className="text-base font-bold text-gray-800">Edit Pelanggan</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-700 text-left bg-white">
            <DynamicForm
              initialData={customer}
              onChange={setLocalForm}
              fields={[
                { name: "customerName", label: "Nama Lengkap" }, 
                { name: "phone", label: "No. Telepon", type: "tel" }, 
                { name: "email", label: "Email", type: "email" }, 
                { name: "address", label: "Alamat", type: "textarea" }, 
                { name: "customerType", label: "Jenis Pelanggan", type: "select", options: ["Pelajar", "Pekerja", "Ibu Rumah Tangga", "Umum"] }, 
                { name: "segment", label: "Segmen", type: "select", options: ["New", "Regular", "Loyal", "VIP"] }, 
                { name: "status", label: "Status", type: "select", options: [{ value: "active", label: "Aktif" }, { value: "inactive", label: "Tidak Aktif" }] }
              ]}
            />
          </div>

          <div className="px-6 pb-6 flex-shrink-0 bg-white">
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>Batal</Button>
              <Button variant="primary" className="flex-1" onClick={handleUpdate}>Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirm} onOpenChange={(openState) => { if (!openState) setDeleteConfirm(false); }}>
        <AlertDialogContent className="font-lagusans max-w-sm rounded-2xl bg-white border-none shadow-2xl p-6">
          <AlertDialogHeader className="flex flex-col items-center text-center gap-0">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-3">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <AlertDialogTitle className="font-bold text-gray-800 mb-2 text-center w-full">Hapus Pelanggan?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 text-center w-full">
              Data {customer.customerName} akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 mt-4 w-full">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(false)}>
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