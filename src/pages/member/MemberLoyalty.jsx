import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getPointHistory } from "../../services/LoyaltyApi";
import { supabase } from "../../services/supabaseClient";
import { syncCustomerStats } from "../../services/TransactionApi";
import { Gift, Medal, ArrowUpRight, ArrowDownRight, Award } from "lucide-react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import ProgressBar from "../../components/ProgressBar";
import Table from "../../components/Table";

const toast = (type, title, desc) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));

export default function MemberLoyalty() {
  const { customerProfile, refreshProfile } = useAuth();
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

  const handleRedeem = async (reward) => {
    if (currentPoints < reward.points) {
      toast("error", "Poin Tidak Cukup", `Anda membutuhkan ${reward.points} poin untuk menukarkan reward ini.`);
      return;
    }

    const confirmRedeem = window.confirm(`Apakah Anda yakin ingin menukarkan ${reward.points} poin untuk ${reward.name}?`);
    if (!confirmRedeem) return;

    try {
      setLoading(true);
      // Generate a voucher code: LY-[Points]-[4 random chars]
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `LY-${reward.points}-${randomPart}`;
      const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const description = `Klaim Reward: ${reward.name} | Discount: ${reward.pct}% | Code: ${code} | Expiry: ${expiry} | Status: Ready to Use`;

      // Insert record to loyalty_transactions
      const { error: insErr } = await supabase
        .from("loyalty_transactions")
        .insert([{
          customerId: customerProfile.id,
          points: reward.points,
          type: "Tukar",
          description
        }]);

      if (insErr) throw insErr;

      // Sync customer stats and refresh profile
      await syncCustomerStats(customerProfile.id);
      await refreshProfile();

      toast("success", "Reward Berhasil Ditukar!", `Kode voucher Anda: ${code}. Cek di halaman Dashboard.`);
      
      // Reload loyalty history list
      const hist = await getPointHistory(customerProfile.id);
      setLoyaltyHistory(hist || []);
    } catch (err) {
      console.error("Failed to redeem points:", err);
      toast("error", "Gagal Menukar Poin", "Terjadi kesalahan saat memproses penukaran.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && loyaltyHistory.length === 0) {
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
              <span className="font-bold text-gray-800 bg-transparent">1 poin / Rp 10.000</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2 bg-transparent">
              <span className="text-gray-500 bg-transparent">Promo Poin (Loyalty)</span>
              <span className="font-bold text-gray-800 bg-transparent">100 (5%), 200 (10%), 300 (15%)</span>
            </div>
            <div className="flex justify-between bg-transparent">
              <span className="text-gray-500 bg-transparent">Promo Nominal Transaksi</span>
              <span className="font-bold text-[#2940D3] bg-transparent">≥250rb (10%), ≥500rb (15%)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tukar Poin Keanggotaan Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 font-Montserrat">
          <Gift size={16} className="text-[#2940D3]" /> Tukar Poin Keanggotaan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Diskon Loyalty 5%", points: 100, pct: 5, bg: "from-blue-50 to-indigo-50", textColor: "text-blue-700" },
            { name: "Diskon Loyalty 10%", points: 200, pct: 10, bg: "from-purple-50 to-pink-50", textColor: "text-purple-700" },
            { name: "Diskon Loyalty 15%", points: 300, pct: 15, bg: "from-amber-50 to-orange-50", textColor: "text-amber-700" },
          ].map((reward) => {
            const canRedeem = currentPoints >= reward.points;
            return (
              <Card key={reward.name} className={`bg-gradient-to-br ${reward.bg} border-none relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow`}>
                <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/20" />
                
                <div className="relative z-10 pb-4 bg-transparent">
                  <span className="px-2 py-0.5 rounded-full bg-white/50 text-[10px] font-extrabold uppercase tracking-wide text-gray-600">
                    Voucher Diskon
                  </span>
                  <h4 className="text-base font-extrabold text-gray-800 mt-2 bg-transparent">{reward.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 bg-transparent">Potongan harga untuk cucian Anda berikutnya.</p>
                </div>
                
                <div className="relative z-10 pt-4 border-t border-gray-200/20 flex items-center justify-between bg-transparent">
                  <div className="bg-transparent">
                    <p className="text-[10px] text-gray-400 font-bold uppercase bg-transparent">Biaya</p>
                    <p className="text-lg font-black text-[#2940D3] bg-transparent">{reward.points} <span className="text-xs font-normal text-gray-400 bg-transparent">pts</span></p>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canRedeem}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      canRedeem
                        ? "bg-[#2940D3] text-white hover:bg-[#142297] shadow-sm cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Tukar
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
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
