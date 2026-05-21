import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2, Zap, Clock, Phone, MapPin, Calendar, Receipt, Mail, TrendingUp, Star, Gift } from "lucide-react";
import customersData from "../data/customers.json";
import transactionsData from "../data/transactions.json";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import Button from "../components/Button";
import DynamicForm from "../components/DynamicForm";
import ConfirmModal from "../components/ConfirmModal";
import Badge from "../components/Badge";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/Avatar";

const toast = (type, title, desc) => window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));
const segmentVariant = { VIP: "purple", Loyal: "blue", Regular: "green", New: "yellow" };
const serviceTypeConfig = { regular: { label: "Regular", Icon: Clock, variant: "gray" }, express: { label: "Express", Icon: Zap, variant: "teal" } };

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [localForm, setLocalForm] = useState({});

  useEffect(() => {
    const found = customersData.find((c) => String(c.id) === String(id));
    if (!found) setError("Pelanggan tidak ditemukan.");
    else { setCustomer({ ...found, serviceType: found.serviceType || "regular" }); setLocalForm(found); }
  }, [id]);

  if (error) return <div className="text-center py-20 font-semibold">{error} <Link to="/customers" className="text-[#2940D3] block mt-2 hover:underline">Kembali</Link></div>;
  if (!customer) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#2940D3] border-t-transparent rounded-full animate-spin" /></div>;

  const svcCfg = serviceTypeConfig[customer.serviceType] || serviceTypeConfig.regular;
  const customerTrx = transactionsData.filter((t) => t.customerId === customer.id);
  const totalBelanja = customerTrx.reduce((s, t) => s + t.total, 0);

  return (
    <div>
      <PageHeader title="Detail Pelanggan" subtitle={`customers / ${customer.name}`}>
        <div className="flex gap-2">
          <Link to="/customers"><Button variant="outline" icon={<ArrowLeft size={15} />}>Kembali</Button></Link>
          <Button variant="warning" icon={<Pencil size={15} />} onClick={() => { setLocalForm(customer); setEditOpen(true); }}>Edit</Button>
          <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setDeleteConfirm(true)}>Hapus</Button>
        </div>
      </PageHeader>

      <Card className="p-6 mb-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar name={customer.name} size="xl" shape="circle" color="bg-gradient-to-br from-[#2940D3] to-[#142297]" className="shadow-lg ring-4 ring-[#2940D3]/20" />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">{customer.name}</h2>
              <Badge variant={segmentVariant[customer.segment] || "gray"}>{customer.segment}</Badge>
              <Badge variant={customer.status === "active" ? "green" : "red"}>{customer.status === "active" ? "Aktif" : "Tidak Aktif"}</Badge>
              <Badge variant={svcCfg.variant} icon={<svcCfg.Icon size={10} />}>{svcCfg.label}</Badge>
            </div>
            <p className="text-sm text-gray-400 mb-4 flex items-center justify-center sm:justify-start gap-1.5"><Mail size={13} /> {customer.email}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{ Icon: Phone, label: "No. Telepon", value: customer.phone }, { Icon: MapPin, label: "Alamat", value: customer.address }, { Icon: Calendar, label: "Bergabung", value: customer.joinDate }, { Icon: Receipt, label: "Transaksi Terakhir", value: customer.lastTransaction }].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1"><item.Icon size={12} className="text-gray-400" /><p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{item.label}</p></div>
                  <p className="text-xs font-semibold text-gray-700 leading-snug">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard Icon={TrendingUp} label="Total Transaksi" value={customer.totalTransactions + "x"} />
        <StatCard Icon={Receipt} iconBg="bg-green-50" iconColor="text-green-500" label="Total Belanja" value={`Rp ${customer.totalSpent.toLocaleString("id-ID")}`} />
        <StatCard Icon={Star} iconBg="bg-yellow-50" iconColor="text-yellow-500" label="Poin Loyalitas" value={`${customer.points} poin`} />
        <StatCard Icon={Gift} iconBg="bg-purple-50" iconColor="text-purple-500" label="Nilai Poin" value={`Rp ${(Math.floor(customer.points / 100) * 5000).toLocaleString("id-ID")}`} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div><p className="font-bold text-gray-800">Riwayat Transaksi</p><p className="text-xs text-gray-400 mt-0.5">{customerTrx.length} ditemukan</p></div>
          <Link to="/transactions" className="text-xs text-[#2940D3] font-semibold hover:underline">Lihat Semua</Link>
        </div>
        {customerTrx.length > 0 ? (
          <Table headers={["ID", "Tanggal", "Layanan", "Berat", "Total", "Pembayaran", "Status"]}>
            {customerTrx.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{t.id}</td>
                <td className="px-5 py-3.5 text-gray-600 text-xs">{t.date}</td>
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

      {editOpen && (
        <Modal open onClose={() => setEditOpen(false)} title="Edit Pelanggan" footer={<div className="flex gap-3 w-full"><Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>Batal</Button><Button variant="primary" className="flex-1" onClick={() => { setCustomer(localForm); setEditOpen(false); toast("success", "Pelanggan Diperbarui", "Data disimpan."); }}>Simpan</Button></div>}>
          <DynamicForm
            initialData={customer}
            onChange={setLocalForm}
            fields={[{ name: "name", label: "Nama Lengkap" }, { name: "phone", label: "No. Telepon", type: "tel" }, { name: "email", label: "Email", type: "email" }, { name: "address", label: "Alamat", type: "textarea" }, { name: "segment", label: "Segmen", type: "select", options: ["New", "Regular", "Loyal", "VIP"] }, { name: "status", label: "Status", type: "select", options: [{ value: "active", label: "Aktif" }, { value: "inactive", label: "Tidak Aktif" }] }]}
            customRender={(formState, handleInputChange) => (
              <div className="text-left mt-4">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Tipe Layanan</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: "regular", label: "Regular", desc: "2–3 hari", Icon: Clock, activeClass: "border-[#2940D3] bg-[#2940D3]/5" }, { value: "express", label: "Express", desc: "Same day", Icon: Zap, activeClass: "border-[#142297] bg-[#142297]/5" }].map((opt) => {
                    const isActive = (formState.serviceType || "regular") === opt.value;
                    return (
                      <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isActive ? opt.activeClass : "border-gray-200 hover:border-gray-300"}`}>
                        <input type="radio" name="serviceType" checked={isActive} onChange={() => handleInputChange("serviceType", opt.value)} className="sr-only" />
                        <opt.Icon size={15} className={`mt-0.5 ${isActive ? "text-[#2940D3]" : "text-gray-400"}`} />
                        <div><p className="text-sm font-semibold text-gray-700">{opt.label}</p><p className="text-xs text-gray-400">{opt.desc}</p></div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          />
        </Modal>
      )}

      <ConfirmModal open={deleteConfirm} onClose={() => setDeleteConfirm(false)} onConfirm={() => { toast("warning", "Pelanggan Dihapus", "Data dihapus."); navigate("/customers"); }} title="Hapus Pelanggan?" message={`Data ${customer.name} akan dihapus permanen.`} variant="danger" />
    </div>
  );
}