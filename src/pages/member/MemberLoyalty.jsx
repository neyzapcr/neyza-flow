import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getPointHistory } from "../../services/LoyaltyApi";
import { Gift, Medal, ArrowUpRight, ArrowDownRight, Award } from "lucide-react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import ProgressBar from "../../components/ProgressBar";
import Table from "../../components/Table";

export default function MemberLoyalty() {
  const { customerProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loyaltyHistory, setLoyaltyHistory] = useState([]);

  useEffect(() => {
    async function loadLoyaltyData() {
      if (!customerProfile) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const hist = await getPointHistory(customerProfile.id);
        setLoyaltyHistory(hist || []);
      } catch (err) {
        console.error("Error loading loyalty transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLoyaltyData();
  }, [customerProfile]);

  const tiers = [
    { name: "Bronze", min: 0, max: 99, barColor: "#F97316" },
    { name: "Silver", min: 100, max: 299, barColor: "#6B7280" },
    { name: "Gold", min: 300, max: 499, barColor: "#EAB308" },
    { name: "Platinum", min: 500, max: Infinity, barColor: "#8B5CF6" },
  ];

  const currentPoints = customerProfile?.points || 0;
  const currentTier = tiers.find((t) => currentPoints >= t.min && currentPoints <= t.max) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1] || null;
  const progress = nextTier ? Math.round(((currentPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loyalty Program</h1>
        <p className="text-sm text-gray-500">Kumpulkan poin laundry Anda dan tukarkan dengan promo menarik</p>
      </div>

      {/* Tier Overview & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-2xl p-6 border border-gray-150">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 text-sm bg-white font-Montserrat">Status Keanggotaan</h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white">
            {/* Big Badge Icon */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg border relative" style={{ borderColor: `${currentTier.barColor}30`, backgroundColor: `${currentTier.barColor}10` }}>
              <Medal size={48} style={{ color: currentTier.barColor }} />
              <span className="absolute -bottom-1 bg-gray-800 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shadow">
                {currentTier.name}
              </span>
            </div>

            {/* Progress Info */}
            <div className="flex-1 space-y-4 w-full bg-white">
              <div className="flex justify-between items-end bg-white">
                <div className="bg-white">
                  <p className="text-[11px] text-gray-400 font-medium">Total Poin Anda</p>
                  <h2 className="text-3xl font-extrabold text-[#2940D3]">{currentPoints} <span className="text-xs text-gray-400 font-normal">poin</span></h2>
                </div>
                {nextTier && (
                  <p className="text-xs text-gray-400 text-right bg-white">
                    <span className="font-bold text-gray-800">{nextTier.min - currentPoints}</span> poin lagi menuju <span className="font-bold text-gray-700">{nextTier.name}</span>
                  </p>
                )}
              </div>

              {nextTier && (
                <div className="space-y-1.5 bg-white">
                  <ProgressBar value={progress} color={currentTier.barColor} height="md" />
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium bg-white">
                    <span>{currentTier.min} pts</span>
                    <span>{progress}% Tercapai</span>
                    <span>{nextTier.min} pts</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Reward Rules */}
        <Card className="bg-gradient-to-br from-[#FAFBFD] to-[#F1F3FF] border-[#2940D3]/10">
          <h3 className="font-bold text-gray-800 pb-3 text-sm flex items-center gap-2 bg-transparent">
            <Gift size={16} className="text-[#2940D3]" /> Aturan Rewards
          </h3>
          <div className="space-y-3 mt-2 text-xs bg-transparent">
            <div className="flex justify-between border-b border-gray-100 pb-2 bg-transparent">
              <span className="text-gray-500 bg-transparent">Poin Per Transaksi</span>
              <span className="font-bold text-gray-800 bg-transparent">1 poin / Rp 2.000</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2 bg-transparent">
              <span className="text-gray-500 bg-transparent">Tukar Voucher</span>
              <span className="font-bold text-gray-800 bg-transparent">100 poin = Rp 5.000</span>
            </div>
            <div className="flex justify-between bg-transparent">
              <span className="text-gray-500 bg-transparent">Bonus Tier Platinum</span>
              <span className="font-bold text-[#2940D3] bg-transparent">Double (2x) Poin</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Point History Log */}
      <Card>
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 text-sm flex items-center gap-2 bg-white font-Montserrat">
          <Award size={16} className="text-[#2940D3]" /> Riwayat Aktivitas Poin
        </h3>

        <Table headers={["ID Aktivitas", "Tanggal", "Aktivitas", "Tipe", "Poin"]}>
          {loyaltyHistory.length > 0 ? (
            loyaltyHistory.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-500">{l.id ? l.id.substring(0, 8).toUpperCase() : "-"}</td>
                <td className="px-5 py-3 text-xs text-gray-400">
                  {new Date(l.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </td>
                <td className="px-5 py-3 text-xs text-gray-700 font-medium">{l.description}</td>
                <td className="px-5 py-3">
                  <Badge variant={l.type === "Tambah" ? "green" : "red"}>{l.type}</Badge>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${l.type === "Tambah" ? "text-green-600" : "text-red-600"}`}>
                    {l.type === "Tambah" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {l.type === "Tambah" ? "+" : "-"}{l.points} pts
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">
                Belum ada transaksi poin laundry.
              </td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}
