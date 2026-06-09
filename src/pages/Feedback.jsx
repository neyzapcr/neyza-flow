import { useState } from "react";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";
import PageHeader from "../components/PageHeader";
import feedbackData from "../data/feedback.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import Button from "../components/Button";
import DynamicForm from "../components/DynamicForm";
import Badge from "../components/Badge";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Avatar from "../components/Avatar";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState(feedbackData);
  const [filterRating, setFilterRating] = useState(0);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [replyModal, setReplyModal] = useState(null);

  const filtered = feedbacks.filter(f => (filterRating === 0 || f.rating === filterRating) && (filterStatus === "Semua" || f.status === filterStatus));
  const avgRating = (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1);

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "#FBBF24" : "#E5E7EB"} xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
      ))}
    </div>
  );

  return (
    <div>
      <PageHeader title="Feedback & Rating" subtitle="Pantau kepuasan dan ulasan pelanggan" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-5xl font-bold text-[#2940D3]">{avgRating}</p>
            {renderStars(Math.round(avgRating))}
            <p className="text-xs text-gray-400 mt-1">{feedbacks.length} ulasan</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map(r => {
              const count = feedbacks.filter(f => f.rating === r).length;
              return (
                <div key={r} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{r}</span>
                  <ProgressBar value={Math.round((count / feedbacks.length) * 100)} color="#FBBF24" height="sm" className="flex-1" />
                  <span className="text-xs text-gray-400 w-6">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-3 gap-3">
          {[
            { label: "Total Feedback", value: feedbacks.length, Icon: MessageSquare, color: "bg-blue-50 text-[#2940D3]" },
            { label: "Sudah Dibalas", value: feedbacks.filter(f => f.status === "dibalas").length, Icon: CheckCircle, color: "bg-green-50 text-green-500" },
            { label: "Menunggu Balasan", value: feedbacks.filter(f => f.status === "menunggu").length, Icon: Clock, color: "bg-yellow-50 text-yellow-500" }
          ].map(s => (
            <div key={s.label} className={`${s.color.split(" ")[0]} rounded-2xl p-4 border border-white`}>
              <s.Icon size={20} className={`${s.color.split(" ")[1]} mb-2`} />
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Rating:</span>
            {[0, 5, 4, 3, 2, 1].map(r => (
              <button key={r} onClick={() => setFilterRating(r)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filterRating === r ? "bg-[#2940D3] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{r === 0 ? "Semua" : `${r} bintang`}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Status:</span>
            {["Semua", "menunggu", "dibalas"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${filterStatus === s ? "bg-[#2940D3] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{s}</button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((f) => (
          <Card key={f.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar name={f.customerName} size="md" shape="rounded" color="bg-[#2940D3]/10" className="text-[#2940D3]" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{f.customerName}</p>
                  <p className="text-xs text-gray-400">{f.date} · {f.transactionId}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {renderStars(f.rating)}
                <Badge variant={f.status === "dibalas" ? "green" : "yellow"}>{f.status === "dibalas" ? "Dibalas" : "Menunggu"}</Badge>
              </div>
            </div>
            <Badge variant={f.category === "Kebersihan" ? "blue" : f.category === "Kecepatan" ? "purple" : "green"} className="mb-2">{f.category}</Badge>
            <p className="text-sm text-gray-600 leading-relaxed">{f.comment}</p>
            {f.status === "menunggu" && (
              <button onClick={() => setReplyModal(f)} className="mt-3 w-full py-2 rounded-xl bg-[#2940D3]/10 text-[#2940D3] text-xs font-semibold hover:bg-[#2940D3]/20 transition-colors flex items-center justify-center gap-1.5"><MessageSquare size={13} /> Balas Feedback</button>
            )}
          </Card>
        ))}
        {filtered.length === 0 && <div className="lg:col-span-2"><Card><div className="py-8 text-center text-gray-400"><MessageSquare size={32} className="mx-auto mb-2 opacity-30" /><p className="text-sm">Tidak ada feedback ditemukan</p></div></Card></div>}
      </div>

      <Dialog open={!!replyModal} onOpenChange={(openState) => { if (!openState) setReplyModal(null); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-lagusans p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left">
            <DialogTitle className="text-base font-bold text-gray-800">Balas Feedback</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-700">
            {replyModal && (
              <>
                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-left">
                  <div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-500">{replyModal.customerName}</span>{renderStars(replyModal.rating)}</div>
                  <p className="text-sm text-gray-700">{replyModal.comment}</p>
                </div>
                <DynamicForm fields={[{ name: "replyText", label: "Tulis Balasan Anda", type: "textarea", placeholder: "Tulis balasan Anda...", rows: 4 }]} />
              </>
            )}
          </div>

          <div className="px-6 pb-6 flex-shrink-0">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setReplyModal(null)}>Batal</Button>
              <Button variant="primary" className="flex-1" onClick={() => { setFeedbacks(feedbacks.map(f => f.id === replyModal.id ? { ...f, status: "dibalas" } : f)); setReplyModal(null); }}>Kirim Balasan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}