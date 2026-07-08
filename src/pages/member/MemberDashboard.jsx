import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getTransactionByCustomer } from "../../services/TransactionApi";
import { getTrackingHistory } from "../../services/TrackingApi";
import { getFeedbackByCustomer } from "../../services/FeedbackApi";
import { supabase } from "../../services/supabaseClient";
import FeedbackModal from "../../components/FeedbackModal";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import {
  Gift, Receipt, ClipboardList, Wallet, Crown,
  Ticket, Calendar, Check, Copy, Clock, CheckCircle, ChevronRight
} from "lucide-react";

const toast = (type, title, desc) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));

// ── Tier config ───────────────────────────────────────────────────────────
const TIERS = [
  { name: "Bronze",   min: 0,   max: 99,      color: "#F97316", emoji: "🥉" },
  { name: "Silver",   min: 100, max: 299,      color: "#6B7280", emoji: "🥈" },
  { name: "Gold",     min: 300, max: 499,      color: "#EAB308", emoji: "🥇" },
  { name: "Platinum", min: 500, max: Infinity, color: "#8B5CF6", emoji: "💎" },
];

function getTierInfo(pts) {
  const pt = pts || 0;
  const tier = TIERS.find((t) => pt >= t.min && pt <= t.max) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(tier) + 1] || null;
  const progress = nextTier
    ? Math.min(100, Math.round(((pt - tier.min) / (nextTier.min - tier.min)) * 100))
    : 100;
  return { tier, nextTier, progress };
}

// ── Status mapping for active tracking stepper ─────────────────────────────
const TRACK_STEPS = ["Diterima", "Dicuci", "Dikeringkan", "Disetrika", "Selesai"];
const STATUS_IDX  = { menunggu: 0, diproses: 2, selesai: 4 };
const STATUS_BADGE = {
  selesai:  "bg-green-100 text-green-700",
  diproses: "bg-blue-100 text-blue-700",
  menunggu: "bg-yellow-100 text-yellow-700",
};

export default function MemberDashboard() {
  const { profile, customerProfile } = useAuth();

  const [loading, setLoading]           = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [latestTracking, setLatestTracking] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  
  // Feedback states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);

  const parseRedeemedPromo = (desc, dbRecord) => {
    if (!desc || !desc.startsWith("Klaim Reward:")) return null;
    try {
      const parts = desc.split(" | ");
      const name = parts[0].replace("Klaim Reward: ", "");
      const discount = parseInt(parts[1].replace("Discount: ", "").replace("%", ""), 10);
      const code = parts[2].replace("Code: ", "");
      const expiry = parts[3].replace("Expiry: ", "");
      const status = parts[4].replace("Status: ", "");
      return { id: dbRecord.id, name, discount, code, expiry, status, raw: desc };
    } catch (err) {
      console.error("Failed to parse voucher description:", err);
      return null;
    }
  };

  useEffect(() => {
    if (!customerProfile) { setLoading(false); return; }
    setLoading(true);

    async function fetchVouchers() {
      try {
        const { data, error } = await supabase
          .from("loyalty_transactions")
          .select("*")
          .eq("customerId", customerProfile.id)
          .eq("type", "Tukar")
          .like("description", "Klaim Reward:%Status: Ready to Use")
          .order("createdAt", { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Failed to load active vouchers:", err);
        return [];
      }
    }

    Promise.all([
      getTransactionByCustomer(customerProfile.id).catch(() => []),
      getFeedbackByCustomer(customerProfile.id).catch(() => []),
      fetchVouchers()
    ]).then(async ([trxList, feedbackList, vouchers]) => {
      setTransactions(trxList || []);
      
      // Parse active voucher if available
      if (vouchers.length > 0) {
        const parsed = parseRedeemedPromo(vouchers[0].description, vouchers[0]);
        setActiveVoucher(parsed);
      } else {
        setActiveVoucher(null);
      }

      // Deteksi transaksi selesai yang belum di-feedback & belum di-skip
      const completedTrxs = (trxList || []).filter(t => t.status?.toLowerCase() === "selesai");
      const feedbackTrxIds = new Set((feedbackList || []).map(f => f.transactionId));
      const skippedIds = JSON.parse(localStorage.getItem("netto_skipped_feedbacks") || "[]");

      const needFeedback = completedTrxs.find(t => !feedbackTrxIds.has(t.id) && !skippedIds.includes(t.id));
      if (needFeedback) {
        setFeedbackTarget({
          transactionId: needFeedback.id,
          transactionCode: needFeedback.transactionId || needFeedback.transactionCode || needFeedback.id,
          customerId: customerProfile.id
        });
        setShowFeedbackModal(true);
      }

      const activeTrx = (trxList || []).find((t) => t.status !== "selesai");
      if (activeTrx) {
        const hist = await getTrackingHistory(activeTrx.id).catch(() => []);
        setLatestTracking({ transaction: activeTrx, history: hist || [] });
      } else {
        setLatestTracking(null);
      }
    }).finally(() => setLoading(false));
  }, [customerProfile]);

  const pts = customerProfile?.points || 0;
  const { tier, nextTier, progress } = getTierInfo(pts);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast("success", "Kode Disalin", `Kode voucher ${code} berhasil disalin ke clipboard.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-28 bg-gray-200 rounded-2xl"></div>
          <div className="h-28 bg-gray-200 rounded-2xl"></div>
          <div className="h-28 bg-gray-200 rounded-2xl"></div>
          <div className="h-28 bg-gray-200 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[300px] bg-gray-200 rounded-2xl"></div>
          <div className="h-[300px] bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle={`Halo, ${profile?.fullName || "Member"} · Selamat datang kembali`} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          Icon={Gift}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          label="Loyalty Poin"
          value={`${pts} pts`}
          sub={nextTier ? `${nextTier.min - pts} pts ke ${nextTier.name}` : "Level tertinggi! 🎉"}
          subColor={nextTier ? "text-gray-400" : "text-purple-500"}
        />
        <StatCard
          Icon={Crown}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
          label="Segmen Member"
          value={customerProfile?.segment || "New"}
          sub={`${tier.emoji} ${tier.name} Member`}
          subColor="text-purple-500"
        />
        <StatCard
          Icon={Receipt}
          iconBg="bg-[#2940D3]/10"
          iconColor="text-[#2940D3]"
          label="Total Transaksi"
          value={`${customerProfile?.totalTransactions || 0}x`}
          sub="Riwayat cucian"
          subColor="text-gray-400"
        />
        <StatCard
          Icon={Wallet}
          iconBg="bg-green-50"
          iconColor="text-green-500"
          label="Total Belanja"
          value={`Rp ${(customerProfile?.totalSpent || 0).toLocaleString("id-ID")}`}
          sub="Akumulasi belanja"
          subColor="text-green-500"
        />
      </div>

      {/* Stepper Tracking Aktif (jika ada cucian diproses) */}
      {latestTracking && (
        <Card className="p-5 text-left border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-gray-400 font-medium">Tracking Cucian</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">Status Cucian Aktif</p>
            </div>
            <Link to="/member/tracking" className="text-xs text-[#2940D3] font-semibold hover:underline flex items-center gap-1">
              Detail <ChevronRight size={12} />
            </Link>
          </div>

          <div className="flex items-center justify-between mb-5 bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-xs font-bold text-gray-800 font-mono">{latestTracking.transaction.transactionId}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {latestTracking.transaction.service} · {latestTracking.transaction.weight} kg
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[latestTracking.transaction.status] || "bg-gray-100 text-gray-600"}`}>
              {latestTracking.transaction.status}
            </span>
          </div>

          <div className="flex justify-between items-start relative bg-white">
            <div className="absolute left-4 right-4 h-0.5 bg-gray-100 top-4 z-0" />
            {TRACK_STEPS.map((step, idx) => {
              const currentIdx = STATUS_IDX[latestTracking.transaction.status?.toLowerCase()] ?? 0;
              const isDone = idx <= currentIdx;
              return (
                <div key={step} className="flex flex-col items-center gap-2 relative z-10 bg-transparent">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? "bg-[#2940D3] text-white shadow-sm"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}>
                    {isDone ? <CheckCircle size={14} /> : idx + 1}
                  </div>
                  <span className={`text-[9px] font-semibold text-center leading-tight max-w-[40px] ${isDone ? "text-gray-700" : "text-gray-400"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Left Column: Recent Transactions (2 cols) */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 bg-white">
            <h3 className="font-bold text-gray-800 text-sm bg-white">Transaksi Terbaru</h3>
            <Link to="/member/transactions" className="text-xs text-[#2940D3] font-semibold hover:underline bg-white">
              Lihat Semua
            </Link>
          </div>
          
          <Table headers={["ID Transaksi", "Tanggal", "Layanan", "Berat", "Total", "Status"]}>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-gray-400">
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-gray-450 font-mono">{t.transactionId || t.id}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">{t.receivedDate}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-700 font-medium">{t.service}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">{t.weight} kg</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-gray-800">
                    Rp {(t.total || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={t.status === "selesai" ? "green" : t.status === "diproses" ? "blue" : "yellow"}>
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </Card>

        {/* Right Column: Active Promo (1 col) */}
        <Card>
          <h3 className="font-bold text-gray-800 text-sm mb-4 bg-white">Voucher Aktif</h3>
          
          {activeVoucher ? (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between h-[230px] relative overflow-hidden group">
              {/* Ticket cuts on sides */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-white border border-indigo-100/50 z-10 -translate-y-1/2"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-white border border-indigo-100/50 z-10 -translate-y-1/2"></div>
              
              <div className="bg-transparent text-left">
                <div className="flex justify-between items-start bg-transparent">
                  <span className="px-2 py-0.5 rounded-full bg-white/60 text-[9px] font-extrabold uppercase tracking-wide text-indigo-700">
                    Diskon {activeVoucher.discount}%
                  </span>
                  <Badge variant="green" className="uppercase font-bold text-[9px]">
                    Ready to Use
                  </Badge>
                </div>
                
                <h4 className="text-sm font-black text-gray-800 mt-3 bg-transparent">{activeVoucher.name}</h4>
                <p className="text-[10px] text-gray-400 mt-1 bg-transparent flex items-center gap-1">
                  <Calendar size={10} /> Valid s/d: {activeVoucher.expiry}
                </p>
              </div>

              {/* Code display with copy button */}
              <div className="pt-4 border-t border-dashed border-indigo-200/50 flex items-center justify-between bg-transparent">
                <div className="bg-transparent text-left">
                  <p className="text-[9px] text-gray-400 uppercase bg-transparent">Kode Verifikasi</p>
                  <p className="text-sm font-mono font-black text-[#2940D3] bg-transparent">{activeVoucher.code}</p>
                </div>
                
                <button
                  onClick={() => handleCopy(activeVoucher.code)}
                  className={`h-8 w-8 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                    copiedCode === activeVoucher.code
                      ? "bg-green-50 border-green-200 text-green-600"
                      : "bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {copiedCode === activeVoucher.code ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col justify-center items-center h-[230px]">
              <Ticket size={32} className="text-gray-300 mb-2 opacity-60 bg-transparent" />
              <p className="text-sm font-bold text-gray-500 bg-transparent">Tidak ada voucher aktif</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-[180px] bg-transparent">
                Kumpulkan poin dan tukarkan dengan voucher di halaman Loyalty.
              </p>
              <Link to="/member/loyalty" className="mt-4 bg-transparent">
                <Button variant="outline" className="h-8 text-xs font-bold px-4 cursor-pointer">Tukar Poin</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {feedbackTarget && (
        <FeedbackModal
          open={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setFeedbackTarget(null);
          }}
          transactionId={feedbackTarget.transactionId}
          transactionCode={feedbackTarget.transactionCode}
          customerId={feedbackTarget.customerId}
          onSubmitSuccess={(trxId) => {
            setTransactions(prev => prev.filter(t => t.id !== trxId));
          }}
        />
      )}
    </div>
  );
}
