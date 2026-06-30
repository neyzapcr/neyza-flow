import { useState, useEffect } from "react";
import { Medal } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Table from "../components/Table";
import Avatar from "../components/Avatar";
import { getCustomers } from "../services/CustomerApi";
import { getPointHistory } from "../services/LoyaltyApi";

const tiers = [
  { name: "Bronze",   min: 0,   max: 99,       barColor: "#F97316" },
  { name: "Silver",   min: 100, max: 299,       barColor: "#6B7280" },
  { name: "Gold",     min: 300, max: 499,       barColor: "#EAB308" },
  { name: "Platinum", min: 500, max: Infinity,  barColor: "#8B5CF6" },
];

const getTier = (pts) => tiers.find((t) => pts >= t.min && pts <= t.max) || tiers[0];

export default function Loyalty() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pointHistory, setPointHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const loadLoyaltyData = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error("Failed to load loyalty customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const handleSelectCustomer = async (c) => {
    setSelected(c);
    setPointHistory([]);
    try {
      const history = await getPointHistory(c.id);
      setPointHistory(history || []);
    } catch (err) {
      console.error("Failed to load point history:", err);
    }
  };

  const totalPoints = customers.reduce((s, c) => s + (c.points || 0), 0);

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-24 bg-gray-200 rounded-2xl"></div>)}
        </div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Program Loyalitas" subtitle="Kelola poin dan reward pelanggan setia" />

      {/* Tier Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {tiers.map((t) => (
          <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-start text-left">
            <div className="flex items-center justify-between w-full mb-3 bg-white">
              <Badge variant={t.name} icon={<Medal size={12} style={{ color: t.barColor }} />}>{t.name}</Badge>
              <span className="text-xs text-gray-400 font-medium">{t.min}–{t.max === Infinity ? "∞" : t.max} pts</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-800 leading-none">{customers.filter(c => getTier(c.points || 0).name === t.name).length}</p>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">Pelanggan terdaftar</p>
          </div>
        ))}
      </div>

      {/* Rules Card */}
      <Card className="mb-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm text-left">Aturan Program</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[{ label: "Poin per Transaksi", value: "1 poin / Rp 2.000" }, { label: "Penukaran Poin", value: "100 poin = Rp 5.000 diskon" }, { label: "Bonus Tier Platinum", value: "2x poin setiap transaksi" }].map((r) => (
            <div key={r.label} className="bg-gray-50 rounded-xl p-3 text-left">
              <p className="text-xs text-gray-500">{r.label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{r.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Customer Points Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <p className="font-bold text-gray-800">Daftar Poin Pelanggan</p>
          <p className="text-sm text-gray-500 bg-white">Total: <span className="font-bold text-[#2940D3]">{totalPoints.toLocaleString("id-ID")} poin</span></p>
        </div>
        <Table headers={["Pelanggan", "Tier", "Poin", "Progress ke Tier Berikutnya", "Total Transaksi"]}>
          {(() => {
            const sortedCustomers = [...customers].sort((a, b) => (b.points || 0) - (a.points || 0));
            const paginatedCustomers = sortedCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            return paginatedCustomers.map((c) => {
              const tier = getTier(c.points || 0);
              const nextTier = tiers[tiers.indexOf(tier) + 1];
              const progress = nextTier ? Math.round((((c.points || 0) - tier.min) / (nextTier.min - tier.min)) * 100) : 100;
              return (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleSelectCustomer(c)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.customerName} size="md" shape="rounded" color="bg-[#2940D3]/10" className="text-[#2940D3]" />
                      <p className="font-semibold text-gray-800">{c.customerName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4"><Badge variant={tier.name} icon={<Medal size={11} style={{ color: tier.barColor }} />}>{tier.name}</Badge></td>
                  <td className="px-5 py-4 font-bold text-[#2940D3]">{c.points || 0}</td>
                  <td className="px-5 py-4 w-48 text-left">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={progress} color={tier.barColor} height="md" className="flex-1" />
                      <span className="text-xs text-gray-400">{progress}%</span>
                    </div>
                    {nextTier && <p className="text-[11px] text-gray-400 mt-0.5">{nextTier.min - (c.points || 0)} poin lagi ke {nextTier.name}</p>}
                  </td>
                  <td className="px-5 py-4 text-gray-700">{c.totalTransactions || 0}x</td>
                </tr>
              );
            });
          })()}
        </Table>
        <Pagination
          currentPage={currentPage}
          totalItems={customers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          itemName="pelanggan"
        />
      </div>

      <Dialog open={!!selected} onOpenChange={(openState) => { if (!openState) setSelected(null); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-lagusans p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left bg-white">
            <DialogTitle className="text-base font-bold text-gray-800">Detail Poin</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-700 text-left bg-white">
            {selected && (
              <>
                <div className="text-center mb-4 bg-white">
                  <Avatar name={selected.customerName} size="xl" shape="rounded" color="bg-[#2940D3] mx-auto mb-2 shadow" />
                  <p className="font-bold text-gray-800">{selected.customerName}</p>
                  <p className="text-3xl font-bold text-[#2940D3] mt-2">{selected.points || 0} <span className="text-sm text-gray-400 font-normal">poin</span></p>
                  <Badge variant={getTier(selected.points || 0).name} icon={<Medal size={11} style={{ color: getTier(selected.points || 0).barColor }} />} className="mt-1">{getTier(selected.points || 0).name}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Total Transaksi", value: `${selected.totalTransactions || 0}x` },
                    { label: "Total Belanja", value: `Rp ${(selected.totalSpent || 0).toLocaleString("id-ID")}` },
                    { label: "Nilai Poin", value: `Rp ${(Math.floor((selected.points || 0) / 100) * 5000).toLocaleString("id-ID")}`, color: "text-green-600" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 text-left">
                      <span className="text-gray-500">{item.label}</span>
                      <span className={`font-semibold ${item.color || "text-gray-800"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                
                {/* Point history logs */}
                <div className="mt-5 text-left bg-white">
                  <p className="font-bold text-gray-800 text-xs uppercase mb-2">Riwayat Transaksi Poin</p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {pointHistory.map((h, i) => (
                      <div key={i} className="flex justify-between text-xs py-2 border-b border-gray-100">
                        <div>
                          <span className="text-gray-700 font-medium block">{h.activityType}</span>
                          <span className="text-[10px] text-gray-400">{new Date(h.transactionDate).toLocaleDateString("id-ID")}</span>
                        </div>
                        <span className={`font-bold self-center ${h.pointsEarned > 0 ? "text-green-600" : h.pointsRedeemed > 0 ? "text-red-500" : "text-gray-500"}`}>
                          {h.pointsEarned > 0 ? `+${h.pointsEarned}` : h.pointsRedeemed > 0 ? `-${h.pointsRedeemed}` : "0"} pts
                        </span>
                      </div>
                    ))}
                    {pointHistory.length === 0 && <p className="text-xs text-gray-400">Tidak ada riwayat transaksi poin.</p>}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="px-6 pb-6 flex-shrink-0 bg-white">
            <Button variant="primary" className="w-full" onClick={() => setSelected(null)}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}