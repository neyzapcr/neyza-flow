import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useSettings } from "../../hooks/useSettings";
import { getTransactionByCustomer } from "../../services/TransactionApi";
import { getTrackingHistory } from "../../services/TrackingApi";
import { getPointHistory } from "../../services/LoyaltyApi";
import {
  Gift, Receipt, ClipboardList, CheckCircle, Clock,
  Ticket, Wallet, ChevronRight, ArrowRight, User,
} from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import ProgressBar from "../../components/ProgressBar";

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

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, iconColor, label, value, sub, subColor = "text-gray-400", to }) {
  const inner = (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className={`text-xs mt-0.5 font-medium ${subColor}`}>{sub}</p>}
      </div>
      {to && <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />}
    </div>
  );
  return to
    ? <Link to={to} className="hover:opacity-90 transition-opacity">{inner}</Link>
    : inner;
}

// ── Status mapping ────────────────────────────────────────────────────────
const TRACK_STEPS = ["Diterima", "Dicuci", "Dikeringkan", "Disetrika", "Selesai"];
const STATUS_IDX  = { menunggu: 0, diproses: 2, selesai: 4 };
const STATUS_BADGE = {
  selesai:  "bg-green-100 text-green-700",
  diproses: "bg-blue-100 text-blue-700",
  menunggu: "bg-yellow-100 text-yellow-700",
};

// ─────────────────────────────────────────────────────────────────────────
export default function MemberDashboard() {
  const { profile, customerProfile } = useAuth();
  const { settings } = useSettings();

  const [loading, setLoading]           = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [latestTracking, setLatestTracking] = useState(null);

  useEffect(() => {
    if (!customerProfile) { setLoading(false); return; }
    setLoading(true);

    Promise.all([
      getTransactionByCustomer(customerProfile.id).catch(() => []),
      getPointHistory(customerProfile.id).catch(() => []),
    ]).then(async ([trxList]) => {
      setTransactions(trxList || []);
      const activeTrx = (trxList || []).find((t) => t.status !== "selesai");
      if (activeTrx) {
        const hist = await getTrackingHistory(activeTrx.id).catch(() => []);
        setLatestTracking({ transaction: activeTrx, history: hist || [] });
      }
    }).finally(() => setLoading(false));
  }, [customerProfile]);

  const pts = customerProfile?.points || 0;
  const { tier, nextTier, progress } = getTierInfo(pts);
  const promoActive = settings.promoStatus === true;
  const pendingTrx  = transactions.filter((t) => t.status !== "selesai").length;

  // ── Skeleton ──
  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-56 bg-gray-200 rounded-2xl" />
          <div className="h-56 bg-gray-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-48 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── Hero welcome card ── */}
      <div className="bg-gradient-to-r from-[#2940D3] to-[#5A6FE4] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
        {/* decorative circle */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-2 -bottom-10 w-28 h-28 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-white/70 text-xs font-medium mb-1">Selamat datang kembali</p>
            <h1 className="text-2xl font-black tracking-tight">
              {profile?.fullName?.split(" ")[0] || "Member"} 👋
            </h1>
            <p className="text-white/70 text-xs mt-1">
              ID: <span className="text-white font-semibold">{customerProfile?.customerId || "-"}</span>
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                {tier.emoji} {tier.name}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                Segment: {customerProfile?.segment || "New"}
              </span>
            </div>
          </div>
          <Link
            to="/member/profile"
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <User size={18} />
          </Link>
        </div>

        {/* Poin progress bar di hero */}
        {nextTier && (
          <div className="relative z-10 mt-4 pt-4 border-t border-white/20">
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span>{pts} poin</span>
              <span>{nextTier.min - pts} pts lagi ke {nextTier.emoji} {nextTier.name}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-white transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Promo Banner — hanya muncul kalau promoStatus aktif di Settings ── */}
      {promoActive && settings.promoTitle && (
        <Link to="/member/promos">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-5 py-4 flex items-center justify-between text-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0">
                <Ticket size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Promo Aktif Untukmu!</p>
                <p className="text-sm font-extrabold leading-tight">{settings.promoTitle}</p>
                {settings.promoDescription && (
                  <p className="text-xs opacity-80 mt-0.5 line-clamp-1">{settings.promoDescription}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              {settings.promoDiscount > 0 && (
                <div className="text-right">
                  <p className="text-3xl font-black leading-none">{settings.promoDiscount}%</p>
                  <p className="text-[10px] opacity-70 font-bold">DISKON</p>
                </div>
              )}
              <ArrowRight size={18} className="opacity-70" />
            </div>
          </div>
        </Link>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Gift}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          label="Loyalty Poin"
          value={`${pts} pts`}
          sub={nextTier ? `${nextTier.min - pts} pts ke ${nextTier.name}` : "Level Tertinggi! 🎉"}
          subColor={nextTier ? "text-gray-400" : "text-purple-500"}
          to="/member/loyalty"
        />
        <StatCard
          icon={Receipt}
          iconBg="bg-[#2940D3]/10"
          iconColor="text-[#2940D3]"
          label="Total Transaksi"
          value={transactions.length}
          sub={`Rp ${(customerProfile?.totalSpent || 0).toLocaleString("id-ID")}`}
          to="/member/transactions"
        />
        <StatCard
          icon={ClipboardList}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
          label="Sedang Diproses"
          value={pendingTrx}
          sub={pendingTrx > 0 ? "Cucian aktif" : "Semua selesai ✓"}
          subColor={pendingTrx > 0 ? "text-orange-500" : "text-green-500"}
          to="/member/tracking"
        />
        <StatCard
          icon={Ticket}
          iconBg={promoActive ? "bg-amber-50" : "bg-gray-50"}
          iconColor={promoActive ? "text-amber-500" : "text-gray-400"}
          label="Promo"
          value={promoActive ? "Ada Promo!" : "Tidak Ada"}
          sub={promoActive ? (settings.promoDiscount > 0 ? `Diskon ${settings.promoDiscount}%` : "Cek sekarang") : "Pantau terus ya"}
          subColor={promoActive ? "text-amber-500" : "text-gray-400"}
          to="/member/promos"
        />
      </div>

      {/* ── Row 1: Tracking + Tier ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Tracking aktif */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-gray-400 font-medium">Tracking</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">Status Cucian Aktif</p>
            </div>
            <Link to="/member/tracking" className="text-xs text-[#2940D3] font-semibold hover:underline flex items-center gap-1">
              Detail <ChevronRight size={12} />
            </Link>
          </div>

          {latestTracking ? (
            <>
              <div className="flex items-center justify-between mb-5 bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-gray-800">{latestTracking.transaction.transactionId}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {latestTracking.transaction.service} · {latestTracking.transaction.weight} kg
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[latestTracking.transaction.status] || "bg-gray-100 text-gray-600"}`}>
                  {latestTracking.transaction.status}
                </span>
              </div>

              <div className="flex justify-between items-start relative">
                <div className="absolute left-4 right-4 h-0.5 bg-gray-100 top-4 z-0" />
                {TRACK_STEPS.map((step, idx) => {
                  const currentIdx = STATUS_IDX[latestTracking.transaction.status?.toLowerCase()] ?? 0;
                  const isDone = idx <= currentIdx;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 relative z-10">
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
            </>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Clock size={28} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-500">Tidak ada cucian aktif</p>
              <p className="text-xs text-gray-400 mt-0.5">Semua pesanan sudah selesai dikerjakan.</p>
            </div>
          )}
        </div>

        {/* Poin & Tier */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Loyalitas</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">Level Kamu</p>
            </div>
            <Link to="/member/loyalty" className="text-xs text-[#2940D3] font-semibold hover:underline flex items-center gap-1">
              Riwayat <ChevronRight size={12} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl mb-4"
               style={{ backgroundColor: `${tier.color}12` }}>
            <p className="text-5xl mb-2">{tier.emoji}</p>
            <p className="text-lg font-black" style={{ color: tier.color }}>{tier.name}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {pts} <span className="text-sm font-normal text-gray-400">poin</span>
            </p>
          </div>

          {nextTier ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Menuju {nextTier.emoji} {nextTier.name}</span>
                <span className="font-bold">{nextTier.min - pts} pts</span>
              </div>
              <ProgressBar value={progress} color={tier.color} height="sm" />
            </div>
          ) : (
            <p className="text-xs text-center text-purple-500 font-semibold">🎉 Level tertinggi!</p>
          )}
        </div>
      </div>

      {/* ── Row 2: Transaksi Terbaru + Info Layanan ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Transaksi terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Transaksi Terbaru</p>
            <Link to="/member/transactions" className="text-xs text-[#2940D3] font-semibold hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight size={12} />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium pr-3">ID</th>
                <th className="pb-3 font-medium pr-3">Layanan</th>
                <th className="pb-3 font-medium pr-3">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-3 text-xs text-gray-400 font-mono">{t.transactionId || t.id}</td>
                    <td className="py-3 pr-3 text-xs text-gray-600 max-w-[100px] truncate">{t.service}</td>
                    <td className="py-3 pr-3 text-xs font-semibold text-gray-800 whitespace-nowrap">
                      Rp {(t.total || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[t.status] || "bg-gray-100 text-gray-600"}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Info harga + jam operasional dari Settings */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium">Info Laundry</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5 mb-4">Harga & Jam Buka</p>

          <div className="space-y-2.5">
            {[
              { label: "Cuci",           price: settings.washOnlyPrice  || 7000 },
              { label: "Cuci + Setrika", price: settings.washIronPrice  || 8000 },
              { label: "Setrika",        price: settings.ironOnlyPrice  || 5000 },
              { label: "Express",        price: settings.expressPrice   || 12000 },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <Wallet size={12} className="text-[#2940D3] flex-shrink-0" />
                  <span className="text-xs text-gray-600">{s.label}</span>
                </div>
                <span className="text-xs font-bold text-gray-800">
                  Rp {Number(s.price).toLocaleString("id-ID")}
                  <span className="text-gray-400 font-normal">/kg</span>
                </span>
              </div>
            ))}
          </div>

          {settings.openTime && settings.closeTime && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
                Jam Operasional
              </p>
              <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <p className="text-xs font-bold text-green-700">
                  {settings.openTime.slice(0,5)} – {settings.closeTime.slice(0,5)} WIB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
