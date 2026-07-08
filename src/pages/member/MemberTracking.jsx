import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getTransactionByCustomer } from "../../services/TransactionApi";
import { getTrackingHistory } from "../../services/TrackingApi";
import { supabase } from "../../services/supabaseClient";
import FeedbackModal from "../../components/FeedbackModal";
import { ClipboardList, CheckCircle2, Clock, Calendar, Box } from "lucide-react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";

export default function MemberTracking() {
  const { customerProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTransactions, setActiveTransactions] = useState([]);
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);

  useEffect(() => {
    async function loadTrackingData() {
      if (!customerProfile) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const list = await getTransactionByCustomer(customerProfile.id);
        // We track both active and completed, but default to active first
        const active = (list || []).filter((t) => t.status !== "selesai" || new Date(t.completedDate) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
        setActiveTransactions(active.length > 0 ? active : (list || []));
        if (active.length > 0) {
          setSelectedTrx(active[0]);
        } else if (list && list.length > 0) {
          setSelectedTrx(list[0]);
        }
      } catch (err) {
        console.error("Error loading tracking data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTrackingData();
  }, [customerProfile]);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);

  useEffect(() => {
    async function checkFeedbackNeeded() {
      if (!selectedTrx || !customerProfile) return;
      if (selectedTrx.status?.toLowerCase() === "selesai") {
        const skippedIds = JSON.parse(localStorage.getItem("netto_skipped_feedbacks") || "[]");
        if (skippedIds.includes(selectedTrx.id)) return;

        try {
          const { data } = await supabase
            .from("feedback")
            .select("id")
            .eq("transactionId", selectedTrx.id)
            .maybeSingle();

          if (!data) {
            setFeedbackTarget({
              transactionId: selectedTrx.id,
              transactionCode: selectedTrx.transactionId || selectedTrx.transactionCode || selectedTrx.id,
              customerId: customerProfile.id
            });
            setShowFeedbackModal(true);
          }
        } catch (err) {
          console.error("Error checking feedback in MemberTracking:", err);
        }
      }
    }
    checkFeedbackNeeded();
  }, [selectedTrx, customerProfile]);

  useEffect(() => {
    async function loadHistory() {
      if (!selectedTrx) return;
      try {
        const hist = await getTrackingHistory(selectedTrx.id);
        setTrackingHistory(hist || []);
      } catch (err) {
        console.error("Error loading tracking history:", err);
      }
    }
    loadHistory();
  }, [selectedTrx]);

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
    if (!selectedTrx || !trackingHistory) return { done: false, time: null };

    // Standardize stage names for comparison
    const match = trackingHistory.find(
      (h) => h.step.toLowerCase().replace(/\s/g, "") === stage.toLowerCase().replace(/\s/g, "")
    );
    
    // Fallback simple indexes
    if (!match) {
      const dbStatus = selectedTrx.status.toLowerCase();
      const statusIndex = timelineSteps.map(s => s.toLowerCase().replace(/\s/g, "")).indexOf(dbStatus);
      const stageIndex = timelineSteps.indexOf(stage);

      // Handle simple index fallback
      if (statusIndex !== -1 && stageIndex <= statusIndex) {
        return { done: true, time: selectedTrx.receivedDate };
      }
      return { done: false, time: null };
    }

    return { done: match.status !== false, time: match.time };
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tracking Laundry</h1>
        <p className="text-sm text-gray-500">Pantau proses pengerjaan laundry Anda secara real-time</p>
      </div>

      {activeTransactions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start bg-white rounded-2xl p-6 border border-gray-150">
          {/* Order Selector Sidebar */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400">Pilih Cucian</h3>
            <div className="space-y-3">
              {activeTransactions.map((t) => (
                <button
                   key={t.transactionId}
                   onClick={() => setSelectedTrx(t)}
                   className={`w-full text-left p-4 rounded-2xl border transition-all ${
                     selectedTrx?.transactionId === t.transactionId
                       ? "bg-white border-[#2940D3] shadow-md ring-2 ring-[#2940D3]/10"
                       : "bg-white border-gray-105 hover:bg-gray-50 shadow-sm"
                   }`}
                >
                  <div className="flex items-center justify-between mb-2 bg-white">
                    <span className="font-bold text-xs text-gray-800">{t.transactionId}</span>
                    <Badge variant={t.status === "selesai" ? "green" : t.status === "diproses" ? "blue" : "yellow"} className="capitalize">
                      {t.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 bg-white">{t.service}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 bg-white">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {t.receivedDate}</span>
                    <span className="font-medium text-gray-700">{t.weight} kg</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline & Details */}
          <div className="lg:col-span-2 space-y-4 bg-white">
            {selectedTrx && (
              <>
                {/* General Summary Card */}
                <Card>
                  <div className="flex justify-between items-start flex-wrap gap-4 border-b border-gray-105 pb-4 bg-white">
                    <div className="bg-white">
                      <p className="text-xs text-gray-400 font-medium">Transaksi ID</p>
                      <h2 className="text-lg font-bold text-gray-800 font-mono">{selectedTrx.transactionId}</h2>
                    </div>
                    <div className="text-right bg-white">
                      <p className="text-xs text-gray-400 font-medium">Estimasi Selesai</p>
                      <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 justify-end">
                        <Clock size={14} className="text-[#2940D3]" />
                        {selectedTrx.estimatedDate || "-"}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs bg-white">
                    <div>
                      <p className="text-gray-400">Layanan</p>
                      <p className="font-bold text-gray-800 mt-0.5">{selectedTrx.service}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Berat Cucian</p>
                      <p className="font-bold text-gray-800 mt-0.5">{selectedTrx.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Biaya</p>
                      <p className="font-bold text-[#2940D3] mt-0.5">Rp {selectedTrx.total.toLocaleString("id-ID")}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Metode Pembayaran</p>
                      <p className="font-bold text-gray-800 mt-0.5">{selectedTrx.paymentMethod}</p>
                    </div>
                  </div>
                </Card>

                {/* Vertical Timeline Card */}
                <Card>
                  <h3 className="font-bold text-gray-800 border-b border-gray-105 pb-3 mb-6 text-sm bg-white font-Montserrat">Timeline Proses Laundry</h3>
                  
                  <div className="relative pl-8 space-y-8 bg-white">
                    {/* Line path */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-105"></div>

                    {timelineSteps.map((step) => {
                      const { done, time } = getStageStatus(step);
                      
                      return (
                        <div key={step} className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                          {/* Dot / Indicator */}
                          <div className={`absolute -left-[33px] w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            done 
                              ? "bg-green-500 border-green-500 text-white shadow-sm ring-4 ring-green-100" 
                              : "bg-white border-gray-200 text-gray-400"
                          }`}>
                            {done ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                          </div>

                          {/* Content info */}
                          <div>
                            <p className={`text-sm font-bold ${done ? "text-gray-800" : "text-gray-400"}`}>{step}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {done ? "Tahapan selesai dikerjakan." : "Tahapan pengerjaan berikutnya."}
                            </p>
                          </div>

                          {/* Date info */}
                          <div className="md:text-right shrink-0">
                            {time ? (
                              <Badge variant="gray" className="text-[10px] font-semibold">
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
              </>
            )}
          </div>
        </div>
      ) : (
        <Card className="text-center py-16 text-gray-400 border-dashed border-2 border-gray-200">
          <Box size={50} className="mx-auto mb-4 text-gray-300 animate-pulse" />
          <h3 className="text-lg font-bold text-gray-700">Belum Ada Tracking Laundry</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 bg-white">
            Anda belum memiliki riwayat transaksi laundry pada sistem kami. Segera lakukan pemesanan laundry Anda pertama kali!
          </p>
        </Card>
      )}

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
          onSubmitSuccess={() => {
            // refresh page state or do nothing since modal handles DB update
          }}
        />
      )}
    </div>
  );
}
