import { useState } from "react";
import { MessageSquare, CheckCircle, Clock, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import feedbackData from "../data/feedback.json";

const categoryColors = {
  Kebersihan: "bg-blue-100 text-blue-700",
  Kecepatan: "bg-purple-100 text-purple-700",
  Pelayanan: "bg-green-100 text-green-700",
};

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "#FBBF24" : "#E5E7EB"} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState(feedbackData);
  const [filterRating, setFilterRating] = useState(0);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState("");

  const filtered = feedbacks.filter((f) => {
    const matchRating = filterRating === 0 || f.rating === filterRating;
    const matchStatus = filterStatus === "Semua" || f.status === filterStatus;
    return matchRating && matchStatus;
  });

  const avgRating = (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1);
  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    star: r,
    count: feedbacks.filter((f) => f.rating === r).length,
    pct: Math.round((feedbacks.filter((f) => f.rating === r).length / feedbacks.length) * 100),
  }));

  const handleReply = () => {
    setFeedbacks(feedbacks.map((f) => (f.id === replyModal.id ? { ...f, status: "dibalas" } : f)));
    setReplyModal(null);
    setReplyText("");
  };

  const stats = [
    { label: "Total Feedback", value: feedbacks.length, Icon: MessageSquare, color: "bg-blue-50", iconColor: "text-[#3ABDE8]" },
    { label: "Sudah Dibalas", value: feedbacks.filter((f) => f.status === "dibalas").length, Icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-500" },
    { label: "Menunggu Balasan", value: feedbacks.filter((f) => f.status === "menunggu").length, Icon: Clock, color: "bg-yellow-50", iconColor: "text-yellow-500" },
  ];

  return (
    <div>
      <PageHeader title="Feedback & Rating" subtitle="Pantau kepuasan dan ulasan pelanggan" />

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Avg Rating */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="text-center">
            <p className="text-5xl font-bold text-[#3ABDE8]">{avgRating}</p>
            <StarRating rating={Math.round(avgRating)} />
            <p className="text-xs text-gray-400 mt-1">{feedbacks.length} ulasan</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingDist.map((r) => (
              <div key={r.star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">{r.star}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-yellow-400 transition-all" style={{ width: `${r.pct}%` }}></div>
                </div>
                <span className="text-xs text-gray-400 w-6">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-white`}>
              <s.Icon size={20} className={`${s.iconColor} mb-2`} />
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Rating:</span>
            {[0, 5, 4, 3, 2, 1].map((r) => (
              <button key={r} onClick={() => setFilterRating(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filterRating === r ? "bg-[#3ABDE8] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {r === 0 ? "Semua" : `${r} bintang`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Status:</span>
            {["Semua", "menunggu", "dibalas"].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${filterStatus === s ? "bg-[#3ABDE8] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((f) => (
          <div key={f.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3ABDE8]/10 flex items-center justify-center text-[#3ABDE8] font-bold">
                  {f.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{f.customerName}</p>
                  <p className="text-xs text-gray-400">{f.date} · {f.transactionId}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StarRating rating={f.rating} />
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${f.status === "dibalas" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {f.status === "dibalas" ? "Dibalas" : "Menunggu"}
                </span>
              </div>
            </div>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${categoryColors[f.category] || "bg-gray-100 text-gray-600"}`}>
              {f.category}
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">{f.comment}</p>
            {f.status === "menunggu" && (
              <button onClick={() => setReplyModal(f)}
                className="mt-3 w-full py-2 rounded-xl bg-[#3ABDE8]/10 text-[#3ABDE8] text-xs font-semibold hover:bg-[#3ABDE8]/20 transition-colors flex items-center justify-center gap-1.5">
                <MessageSquare size={13} /> Balas Feedback
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="lg:col-span-2 bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Tidak ada feedback ditemukan</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Balas Feedback</h2>
              <button onClick={() => setReplyModal(null)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500">
                <X size={14} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500">{replyModal.customerName}</span>
                <StarRating rating={replyModal.rating} />
              </div>
              <p className="text-sm text-gray-700">{replyModal.comment}</p>
            </div>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Tulis balasan Anda..." rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 resize-none transition-all" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setReplyModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleReply} className="flex-1 py-2.5 rounded-xl bg-[#3ABDE8] text-white text-sm font-semibold hover:bg-[#2AADD8] transition-colors">Kirim Balasan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
