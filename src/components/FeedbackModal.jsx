import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Star } from "lucide-react";
import Button from "./Button";
import TextArea from "./TextArea";
import { createFeedback } from "../services/FeedbackApi";

const toast = (type, title, desc) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));

export default function FeedbackModal({
  open,
  onClose,
  transactionId,
  transactionCode,
  customerId,
  onSubmitSuccess
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingClick = (val) => {
    setRating(val);
  };

  const handleKirim = async (e) => {
    e.preventDefault();
    if (!transactionId || !customerId) return;
    setSubmitting(true);
    try {
      await createFeedback({
        customerId,
        transactionId,
        rating,
        category: "Layanan",
        comment: comment.trim() || "Pelayanan sangat baik!",
        status: "baru"
      });
      
      toast("success", "Terima Kasih!", "Feedback Anda berhasil disimpan.");
      if (onSubmitSuccess) onSubmitSuccess(transactionId);
      onClose();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      toast("error", "Gagal", "Gagal menyimpan feedback. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLewati = () => {
    const skipped = JSON.parse(localStorage.getItem("netto_skipped_feedbacks") || "[]");
    if (!skipped.includes(transactionId)) {
      skipped.push(transactionId);
      localStorage.setItem("netto_skipped_feedbacks", JSON.stringify(skipped));
    }
    toast("info", "Feedback Dilewati", "Anda dapat memberikan feedback nanti.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleLewati(); }}>
      <DialogContent className="sm:max-w-md p-6 bg-white rounded-2xl border-none shadow-2xl font-Montserrat">
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="text-lg font-bold text-gray-800">Beri Penilaian</DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            Bagaimana pengalaman Anda dengan pesanan <span className="font-mono font-bold text-gray-600">{transactionCode}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex flex-col items-center justify-center space-y-4">
          {/* Star selector */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hoverRating || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    size={36}
                    className={`transition-colors duration-150 ${
                      active ? "fill-amber-400 text-amber-400" : "text-gray-200"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            {rating === 5 ? "Sangat Memuaskan ⭐⭐⭐⭐⭐" :
             rating === 4 ? "Memuaskan ⭐⭐⭐⭐" :
             rating === 3 ? "Cukup Baik ⭐⭐⭐" :
             rating === 2 ? "Kurang Memuaskan ⭐⭐" :
             "Sangat Buruk ⭐"}
          </div>

          <div className="w-full text-left">
            <TextArea
              label="Ulasan Anda (opsional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tuliskan pengalaman Anda menggunakan layanan Netto Express Laundry..."
              rows={3}
              className="text-xs focus:ring-1 focus:ring-[#2940D3]"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1 text-xs font-bold"
            onClick={handleLewati}
            disabled={submitting}
          >
            Lewati
          </Button>
          <Button
            variant="primary"
            className="flex-1 text-xs font-bold bg-[#2940D3] hover:bg-[#142297]"
            onClick={handleKirim}
            loading={submitting}
          >
            Kirim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
