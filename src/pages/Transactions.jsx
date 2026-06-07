import { useState } from "react";
import { Eye, Download, Receipt, DollarSign, Weight, CheckCircle, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import SearchInput from "../components/SearchInput";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Table from "../components/Table";
import EmptyState from "../components/EmptyState";
import Card from "../components/Card";
import transactionsData from "../data/transactions.json";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Semua" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = filtered.reduce((s, t) => s + t.total, 0);
  const totalWeight = filtered.reduce((s, t) => s + t.weight, 0);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const paginatedTransactions = filtered.slice(startIndex, endIndex);

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
          { label: "Total Berat", value: `${totalWeight.toFixed(1)} kg`, Icon: Weight, color: "bg-yellow-50", iconColor: "text-yellow-500" },
          { label: "Selesai", value: transactions.filter((t) => t.status === "selesai").length, Icon: CheckCircle, color: "bg-emerald-50", iconColor: "text-emerald-500" },
        ].map((s) => (
          <Card key={s.label} padding={true} className={`${s.color} border-white text-left`}>
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
            onChange={(v) => { setSearch(v); setCurrentPage(1); }}
            placeholder="Cari ID transaksi atau nama pelanggan..."
          />
          <div className="flex gap-2 items-center flex-wrap">
            {["Semua", "menunggu", "diproses", "selesai"].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filterStatus === s ? "primary" : "ghost"}
                onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table & Pagination Wrapper */}
      <Card padding={false} className="overflow-hidden">
        <Table headers={["ID Transaksi", "Pelanggan", "Tanggal", "Layanan", "Berat", "Total", "Pembayaran", "Status", "Aksi"]}>
          {paginatedTransactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4 font-mono text-xs text-gray-500 text-left">{t.id}</td>
              <td className="px-5 py-4 font-semibold text-gray-800 text-left">{t.customerName}</td>
              <td className="px-5 py-4 text-gray-500 text-xs text-left">{t.date}</td>
              <td className="px-5 py-4 text-gray-600 text-xs text-left">{t.service}</td>
              <td className="px-5 py-4 text-gray-700 text-left">{t.weight} kg</td>
              <td className="px-5 py-4 font-bold text-gray-800 text-left">Rp {t.total.toLocaleString("id-ID")}</td>
              <td className="px-5 py-4 text-left">
                <Badge variant="gray">{t.paymentMethod}</Badge>
              </td>
              <td className="px-5 py-4 text-left">
                <Badge variant={statusVariant[t.status] || "gray"} className="capitalize">{t.status}</Badge>
              </td>
              <td className="px-5 py-4 text-left">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-[#2940D3] bg-blue-50 hover:bg-blue-100" onClick={() => setViewTrx(t)}>
                  <Eye size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <EmptyState icon={<Receipt size={32} />} message="Tidak ada transaksi ditemukan" />}

        {/* Pagination Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <p className="text-xs text-gray-500 text-left font-medium">
              Menampilkan <span className="font-semibold text-gray-850">{filtered.length === 0 ? 0 : startIndex + 1}</span>–
              <span className="font-semibold text-gray-850">{endIndex}</span> dari{" "}
              <span className="font-semibold text-gray-850">{filtered.length}</span> transaksi
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
              <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 text-left">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 bg-[#2940D3]/5 rounded-xl px-3 mt-2 text-left">
              <span className="text-sm font-bold text-gray-700">Total Biaya</span>
              <span className="text-base font-bold text-[#2940D3]">Rp {viewTrx.total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-left">
              <span className="text-sm text-gray-500">Status</span>
              <Badge variant={statusVariant[viewTrx.status] || "gray"} className="capitalize">{viewTrx.status}</Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}