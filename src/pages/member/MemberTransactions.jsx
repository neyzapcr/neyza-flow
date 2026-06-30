import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getTransactionByCustomer } from "../../services/TransactionApi";
import { Receipt, Eye, Calendar, Printer, CreditCard } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

export default function MemberTransactions() {
  const { customerProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [viewTrx, setViewTrx] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      if (!customerProfile) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const list = await getTransactionByCustomer(customerProfile.id);
        setTransactions(list || []);
      } catch (err) {
        console.error("Error loading transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, [customerProfile]);

  const filtered = transactions.filter((t) => {
    return (
      (t.transactionId || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.service || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusVariant = {
    selesai: "green",
    diproses: "blue",
    menunggu: "yellow",
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
        <p className="text-sm text-gray-500">Lihat semua riwayat transaksi laundry Anda di Netto Express</p>
      </div>

      {/* Filters & Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            className="flex-1"
            value={search}
            onChange={(v) => { setSearch(v); setCurrentPage(1); }}
            placeholder="Cari ID transaksi atau jenis layanan..."
          />
        </div>
      </Card>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table headers={["ID Transaksi", "Tanggal Diterima", "Layanan", "Berat Cucian", "Total Biaya", "Pembayaran", "Status", "Aksi"]}>
          {paginated.length > 0 ? (
            paginated.map((t) => (
              <tr key={t.transactionId} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-gray-500">{t.transactionId}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{t.receivedDate}</td>
                <td className="px-5 py-4 font-semibold text-gray-800 text-xs">{t.service}</td>
                <td className="px-5 py-4 text-gray-700 text-xs">{t.weight} kg</td>
                <td className="px-5 py-4 font-bold text-gray-800 text-xs">Rp {t.total.toLocaleString("id-ID")}</td>
                <td className="px-5 py-4">
                  <Badge variant="gray">{t.paymentMethod}</Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={statusVariant[t.status.toLowerCase()] || "gray"} className="capitalize">{t.status}</Badge>
                </td>
                <td className="px-5 py-4">
                  <Button variant="outline" className="h-8 text-xs font-semibold" icon={<Eye size={12} />} onClick={() => setViewTrx(t)}>
                    Detail
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-5 py-8 text-center text-gray-400">
                <Receipt size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">Tidak ada transaksi ditemukan.</p>
              </td>
            </tr>
          )}
        </Table>

        {filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemName="transaksi"
          />
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewTrx} onOpenChange={(open) => { if (!open) setViewTrx(null); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-Montserrat p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left bg-white">
            <DialogTitle className="text-base font-bold text-gray-800 bg-white">Detail Transaksi</DialogTitle>
          </DialogHeader>

          {viewTrx && (
            <div className="px-6 py-5 overflow-y-auto flex-1 text-xs text-gray-700 bg-white text-left space-y-4">
              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div>
                  <p className="font-bold text-gray-800 text-sm font-mono">{viewTrx.transactionId}</p>
                  <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{viewTrx.service}</p>
                </div>
                <Badge variant={statusVariant[viewTrx.status.toLowerCase()] || "gray"} className="capitalize">{viewTrx.status}</Badge>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
                {[
                  { label: "Tanggal Masuk", value: viewTrx.receivedDate, icon: Calendar },
                  { label: "Metode Pembayaran", value: viewTrx.paymentMethod, icon: CreditCard },
                  { label: "Estimasi Selesai", value: viewTrx.estimatedDate, icon: Clock }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium flex items-center gap-1.5"><item.icon size={13} className="text-[#2940D3]" /> {item.label}</span>
                    <span className="font-semibold text-gray-850">{item.value || "-"}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs">
                <p className="font-bold text-gray-800 mb-2">Rincian Cucian</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Berat Cucian</span>
                    <span className="font-bold text-gray-800">{viewTrx.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tarif per Kg</span>
                    <span className="font-bold text-gray-850">Rp {viewTrx.pricePerKg?.toLocaleString("id-ID")}/kg</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-dashed border-gray-250">
                    <span className="text-gray-600 font-semibold">Total Tagihan</span>
                    <span className="font-black text-gray-850 text-sm">Rp {viewTrx.total?.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              {viewTrx.notes && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
                  <p className="font-bold">Catatan Pengerjaan:</p>
                  <p className="mt-1 leading-relaxed text-amber-600">{viewTrx.notes}</p>
                </div>
              )}
            </div>
          )}

          <div className="px-6 pb-6 flex-shrink-0 bg-white flex gap-2">
            <Button variant="outline" className="flex-1 text-xs font-bold" icon={<Printer size={13} />} onClick={() => window.print()}>Cetak Nota</Button>
            <Button variant="primary" className="flex-1 text-xs font-bold" onClick={() => setViewTrx(null)}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
