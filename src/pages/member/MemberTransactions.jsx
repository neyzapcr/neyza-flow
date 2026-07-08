import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getTransactionByCustomer } from "../../services/TransactionApi";
import { Receipt, Calendar, CreditCard } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";


export default function MemberTransactions() {
  const { customerProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);


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
        <Table headers={["ID Transaksi", "Tanggal Diterima", "Layanan", "Berat Cucian", "Total Biaya", "Pembayaran", "Status"]}>
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

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
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


    </div>
  );
}
