import { useState } from "react";
import { Eye, Download, Search, Receipt, DollarSign, Weight, CheckCircle, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import transactionsData from "../data/transactions.json";

const statusColors = {
  selesai: "bg-[2CC5BD] text-green-700",
  diproses: "bg-blue-100 text-[#2940D3]",
  menunggu: "bg-yellow-100 text-yellow-700",
};

export default function Transactions() {
  const [transactions, setTransactions] = useState(transactionsData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [viewTrx, setViewTrx] = useState(null);
  const [period, setPeriod] = useState("bulan");

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
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#2940D3] text-white rounded-xl text-sm font-semibold hover:bg-[#5A6FE4] transition-colors shadow-sm">
          <Download size={15} /> Export
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Transaksi", value: transactions.length, Icon: Receipt, color: "bg-blue-50", iconColor: "text-[#2940D3]" },
          { label: "Total Pendapatan", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, Icon: DollarSign, color: "bg-[2CC5BD]", iconColor: "text-green-500" },
          { label: "Total Berat", value: `${totalWeight} kg`, Icon: Weight, color: "bg-yellow-50", iconColor: "text-yellow-500" },
          { label: "Selesai", value: transactions.filter((t) => t.status === "selesai").length, Icon: CheckCircle, color: "bg-emerald-50", iconColor: "text-emerald-500" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-white`}>
            <s.Icon size={20} className={`${s.iconColor} mb-2`} />
            <p className="text-xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari ID transaksi atau nama pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full text-gray-600 placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            {["Semua", "menunggu", "diproses", "selesai"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                  filterStatus === s ? "bg-[#2940D3] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-5 py-3.5 font-semibold">ID Transaksi</th>
                <th className="px-5 py-3.5 font-semibold">Pelanggan</th>
                <th className="px-5 py-3.5 font-semibold">Tanggal</th>
                <th className="px-5 py-3.5 font-semibold">Layanan</th>
                <th className="px-5 py-3.5 font-semibold">Berat</th>
                <th className="px-5 py-3.5 font-semibold">Total</th>
                <th className="px-5 py-3.5 font-semibold">Pembayaran</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{t.id}</td>
                  <td className="px-5 py-4 font-semibold text-gray-800">{t.customerName}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{t.date}</td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{t.service}</td>
                  <td className="px-5 py-4 text-gray-700">{t.weight} kg</td>
                  <td className="px-5 py-4 font-bold text-gray-800">Rp {t.total.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{t.paymentMethod}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setViewTrx(t)}
                      className="w-8 h-8 rounded-lg bg-blue-50 text-[#2940D3] flex items-center justify-center hover:bg-blue-100 transition-colors"
                      title="Lihat Detail"
                    ><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Receipt size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Tidak ada transaksi ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {viewTrx && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Detail Transaksi</h2>
              <button onClick={() => setViewTrx(null)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500"><X size={14} /></button>
            </div>
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[viewTrx.status]}`}>{viewTrx.status}</span>
              </div>
            </div>
            <button onClick={() => setViewTrx(null)} className="w-full mt-5 py-2.5 rounded-xl bg-[#2940D3] text-white text-sm font-semibold hover:bg-[#5A6FE4] transition-colors">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
