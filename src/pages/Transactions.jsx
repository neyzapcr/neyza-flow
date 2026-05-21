import { useState } from "react";
import { Eye, Download, Receipt, DollarSign, Weight, CheckCircle } from "lucide-react";
import PageHeader from "../components/PageHeader";
import transactionsData from "../data/transactions.json";
import Button from "../components/Button";
import SearchInput from "../components/SearchInput";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import Card from "../components/Card";

const statusVariant = {
  selesai: "green",
  diproses: "blue",
  menunggu: "yellow",
};

export default function Transactions() {
  const [transactions, setTransactions] = useState(transactionsData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [viewTrx, setViewTrx] = useState(null);

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Semua" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = filtered.reduce((s, t) => s + t.total, 0);
  const totalWeight = filtered.reduce((s, t) => s + t.weight, 0);

  return (
    <div>
      <PageHeader title="Riwayat Transaksi" subtitle="Kelola dan pantau semua transaksi pelanggan">
        <Button icon={<Download size={15} />}>Export</Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Transaksi", value: transactions.length, Icon: Receipt, color: "bg-blue-50", iconColor: "text-[#2940D3]" },
          { label: "Total Pendapatan", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, Icon: DollarSign, color: "bg-green-50", iconColor: "text-green-500" },
          { label: "Total Berat", value: `${totalWeight} kg`, Icon: Weight, color: "bg-yellow-50", iconColor: "text-yellow-500" },
          { label: "Selesai", value: transactions.filter((t) => t.status === "selesai").length, Icon: CheckCircle, color: "bg-emerald-50", iconColor: "text-emerald-500" },
        ].map((s) => (
          <Card key={s.label} padding={true} className={`${s.color} border-white`}>
            <s.Icon size={20} className={`${s.iconColor} mb-2`} />
            <p className="text-xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            className="flex-1"
            value={search}
            onChange={setSearch}
            placeholder="Cari ID transaksi atau nama pelanggan..."
          />
          <div className="flex gap-2">
            {["Semua", "menunggu", "diproses", "selesai"].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filterStatus === s ? "primary" : "ghost"}
                onClick={() => setFilterStatus(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false} className="overflow-hidden">
        <Table headers={["ID Transaksi", "Pelanggan", "Tanggal", "Layanan", "Berat", "Total", "Pembayaran", "Status", "Aksi"]}>
          {filtered.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4 font-mono text-xs text-gray-500">{t.id}</td>
              <td className="px-5 py-4 font-semibold text-gray-800">{t.customerName}</td>
              <td className="px-5 py-4 text-gray-500 text-xs">{t.date}</td>
              <td className="px-5 py-4 text-gray-600 text-xs">{t.service}</td>
              <td className="px-5 py-4 text-gray-700">{t.weight} kg</td>
              <td className="px-5 py-4 font-bold text-gray-800">Rp {t.total.toLocaleString("id-ID")}</td>
              <td className="px-5 py-4">
                <Badge variant="gray">{t.paymentMethod}</Badge>
              </td>
              <td className="px-5 py-4">
                <Badge variant={statusVariant[t.status] || "gray"} className="capitalize">{t.status}</Badge>
              </td>
              <td className="px-5 py-4">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-[#2940D3] bg-blue-50 hover:bg-blue-100" onClick={() => setViewTrx(t)}>
                  <Eye size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <EmptyState icon={<Receipt size={32} />} message="Tidak ada transaksi ditemukan" />}
      </Card>

      {/* Detail Modal */}
      <Modal
        open={!!viewTrx}
        onClose={() => setViewTrx(null)}
        title="Detail Transaksi"
        footer={<Button variant="primary" className="w-full" onClick={() => setViewTrx(null)}>Tutup</Button>}
      >
        {viewTrx && (
          <div className="space-y-3">
            {[
              { label: "ID Transaksi", value: viewTrx.id },
              { label: "Pelanggan", value: viewTrx.customerName },
              { label: "Tanggal", value: viewTrx.date },
              { label: "Layanan", value: viewTrx.service },
              { label: "Berat", value: `${viewTrx.weight} kg` },
              { label: "Harga/kg", value: `Rp ${viewTrx.pricePerKg.toLocaleString("id-ID")}` },
              { label: "Metode Bayar", value: viewTrx.paymentMethod },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 bg-[#2940D3]/5 rounded-xl px-3 mt-2">
              <span className="text-sm font-bold text-gray-700">Total Biaya</span>
              <span className="text-base font-bold text-[#2940D3]">Rp {viewTrx.total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <Badge variant={statusVariant[viewTrx.status] || "gray"} className="capitalize">{viewTrx.status}</Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}