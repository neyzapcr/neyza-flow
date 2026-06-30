import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { getTrackingHistory } from "../services/TrackingApi";
import { useAuth } from "../hooks/useAuth";
import { ClipboardList, CheckCircle2, Clock, ArrowLeft, WashingMachine } from "lucide-react";
import Card from "../components/Card";
import Badge from "../components/Badge";

export default function PublicTracking() {
  const { transactionId } = useParams(); // This is the transactionCode (e.g. TRX-XXXX)
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trx, setTrx] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);

  useEffect(() => {
    async function loadTrackingData() {
      if (!transactionId) return;
      setLoading(true);
      try {
        // Query transaction by transactionCode
        const { data, error } = await supabase
          .from("transactions")
          .select("*, customers(customerCode, customerName)")
          .eq("transactionCode", transactionId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Map to match UI conventions (transactionId = transactionCode)
          const mappedTrx = {
            ...data,
            transactionId: data.transactionCode,
            customerName: data.customers?.customerName || data.customerName || "Pelanggan Netto"
          };
          setTrx(mappedTrx);

          // Fetch tracking history using the transaction's UUID id
          const hist = await getTrackingHistory(data.id);
          setTrackingHistory(hist || []);
        } else {
          setTrx(null);
          setTrackingHistory([]);
        }
      } catch (err) {
        console.error("Error loading public tracking:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTrackingData();
  }, [transactionId]);

  const timelineSteps = [
    "Pesanan Diterima",
    "Sedang Dicuci",
    "Sedang Dikeringkan",
    "Sedang Disetrika",
    "Quality Check",
    "Siap Diambil",
    "Selesai"
  ];

  // Helper to determine status color and icon for each timeline stage
  const getStageStatus = (stage) => {
    if (!trx || !trackingHistory) return { done: false, time: null };

    // Standardize stage names for comparison
    const match = trackingHistory.find(
      (h) => h.step.toLowerCase().replace(/\s/g, "") === stage.toLowerCase().replace(/\s/g, "")
    );
    
    // Fallback simple indexes
    if (!match) {
      const dbStatus = (trx.status || "").toLowerCase();
      const statusIndex = timelineSteps.map(s => s.toLowerCase().replace(/\s/g, "")).indexOf(dbStatus);
      const stageIndex = timelineSteps.indexOf(stage);

      if (statusIndex !== -1 && stageIndex <= statusIndex) {
        return { done: true, time: trx.receivedDate };
      }
      return { done: false, time: null };
    }

    return { done: match.status !== false, time: match.time };
  };

  const statusVariant = {
    selesai: "green",
    diproses: "blue",
    menunggu: "yellow",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center p-6 text-left">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-xl w-full space-y-6 animate-pulse">
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-48 bg-gray-200 rounded mx-auto"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD] py-12 px-4 flex flex-col justify-center items-center font-Montserrat text-left">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Back Link or Brand */}
        <div className="flex items-center justify-between px-2">
          <Link to="/" className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <ArrowLeft size={14} /> Beranda Netto Express
          </Link>
          <span className="text-xs font-bold text-[#2940D3]">Netto Tracking System</span>
        </div>

        {trx ? (
          <>
            {/* Status Header Card */}
            <div className="bg-gradient-to-r from-[#2940D3] to-[#5A6FE4] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                <WashingMachine size={180} />
              </div>
              <div className="relative z-10 flex justify-between items-start gap-2 bg-transparent">
                <div>
                  <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">Status Cucian Anda</p>
                  <h1 className="text-2xl font-black mt-1">{trx.transactionId}</h1>
                  <p className="text-xs text-white/80 mt-1">Layanan: <span className="font-bold text-white">{trx.service}</span></p>
                </div>
                <Badge variant={statusVariant[trx.status.toLowerCase()] || "gray"} className="px-3 py-1 font-bold text-xs shadow border border-white/20 capitalize">
                  {trx.status}
                </Badge>
              </div>
            </div>

            {/* General Info Details */}
            <Card>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-400 font-medium">Nama Pelanggan</p>
                  <p className="font-bold text-gray-800 mt-1">{trx.customerName || "Pelanggan Netto"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Berat Cucian</p>
                  <p className="font-bold text-gray-800 mt-1">{trx.weight} kg</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Metode Pembayaran</p>
                  <p className="font-bold text-gray-800 mt-1">{trx.paymentMethod || "Cash"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Estimasi Selesai</p>
                  <p className="font-bold text-gray-800 mt-1 flex items-center gap-1 bg-white">
                    <Clock size={12} className="text-[#2940D3]" /> {trx.estimatedDate || "-"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Vertical Timeline Card */}
            <Card>
              <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-6 text-sm flex items-center gap-2">
                <ClipboardList size={16} className="text-[#2940D3]" /> Timeline Proses Laundry
              </h3>
              
              <div className="relative pl-8 space-y-8">
                {/* Line path */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                {timelineSteps.map((step) => {
                  const { done, time } = getStageStatus(step);
                  
                  return (
                    <div key={step} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Dot / Indicator */}
                      <div className={`absolute -left-[33px] w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        done 
                          ? "bg-green-500 border-green-500 text-white shadow-sm ring-4 ring-green-100" 
                          : "bg-white border-gray-200 text-gray-400"
                      }`}>
                        {done ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                      </div>

                      {/* Content info */}
                      <div>
                        <p className={`text-sm font-bold ${done ? "text-gray-800" : "text-gray-400"}`}>{step}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {done ? "Tahapan selesai dikerjakan." : "Tahapan pengerjaan berikutnya."}
                        </p>
                      </div>

                      {/* Date info */}
                      <div className="sm:text-right shrink-0">
                        {time ? (
                          <Badge variant="gray" className="text-[9px] font-semibold">
                            {new Date(time).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-300">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Account registration callout for guests */}
            {!isAuthenticated && (
              <div className="bg-blue-50/50 border border-[#2940D3]/15 rounded-3xl p-6 text-center space-y-4 shadow-sm">
                <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-sm mx-auto">
                  Belum memiliki akun? Daftar sekarang agar seluruh riwayat laundry tersimpan dan Anda dapat menikmati poin loyalitas serta promo member.
                </p>
                <div className="flex gap-2 justify-center">
                  <Link to="/register" className="py-2.5 px-5 bg-[#2940D3] hover:bg-[#142297] text-white rounded-xl font-semibold text-xs transition-all shadow-sm">
                    Daftar Akun
                  </Link>
                  <Link to="/login" className="py-2.5 px-5 bg-white border border-gray-200 text-gray-600 rounded-xl font-semibold text-xs hover:bg-gray-50 transition-all shadow-sm">
                    Login
                  </Link>
                </div>
              </div>
            )}

            <div className="text-center text-xs text-gray-400 pt-4">
              Terima kasih telah memercayakan cucian Anda kepada <span className="font-semibold text-gray-600">Netto Express Laundry</span>.
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 text-center space-y-4 bg-white">
            <h2 className="text-xl font-bold text-gray-800 bg-white">Transaksi Tidak Ditemukan</h2>
            <p className="text-sm text-gray-400 max-w-sm mx-auto bg-white">
              Maaf, nomor transaksi laundry <span className="font-semibold text-gray-700">{transactionId}</span> tidak dapat ditemukan dalam database kami. Pastikan nomor transaksi Anda benar.
            </p>
            <Link to="/" className="inline-block py-3 px-6 bg-[#2940D3] hover:bg-[#142297] text-white rounded-xl font-semibold text-sm transition-all shadow">
              Kembali ke Beranda
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
