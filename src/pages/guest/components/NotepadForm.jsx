import { Star, MessageSquare } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import Button from "../../../components/Button";

export default function NotepadForm({
  formName,
  setFormName,
  formFeedback,
  setFormFeedback,
  formRating,
  setFormRating,
  onSubmit,
}) {
  return (
    <ScrollReveal variant="slide-left" delay={250} className="w-full lg:w-[350px] flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-md relative overflow-hidden flex flex-col justify-between h-full text-left">
        
        {/* Lined paper lines decoration */}
        <div className="absolute top-0 bottom-0 left-6 w-[1px] bg-red-200/40 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-7 w-[1px] bg-red-200/40 pointer-events-none" />
        
        <div className="relative pl-5 space-y-3.5">
          <div className="flex items-center gap-1.5 pb-2 border-b border-gray-150">
            <MessageSquare size={13} className="text-[#3957ED]" />
            <h4 className="text-[10px] font-extrabold text-gray-800 uppercase tracking-wider">
              Tulis Ulasan Anda
            </h4>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            
            {/* Horizontal side-by-side grid layout for Name & Rating */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8.5px] font-extrabold text-gray-500 uppercase tracking-wider block">Nama</label>
                <input 
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-[11px] font-bold border border-gray-200 focus:border-[#3957ED] focus:outline-none bg-white text-gray-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] font-extrabold text-gray-500 uppercase tracking-wider block">Rating</label>
                <div className="flex gap-0.5 pt-1.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button 
                      key={val}
                      type="button"
                      onClick={() => setFormRating(val)}
                      className="text-amber-400 focus:outline-none cursor-pointer"
                    >
                      <Star size={13} fill={val <= formRating ? "currentColor" : "none"} className="stroke-amber-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8.5px] font-extrabold text-gray-500 uppercase tracking-wider block">Komentar Ulasan</label>
              <textarea 
                required
                rows={2.5}
                value={formFeedback}
                onChange={(e) => setFormFeedback(e.target.value)}
                placeholder="Tulis kesan Anda tentang pelayanan kami di sini..."
                className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-[11px] font-bold border border-gray-200 focus:border-[#3957ED] focus:outline-none resize-none bg-white text-gray-700"
              />
            </div>

            <Button 
              type="submit"
              className="w-full !py-1.5 sm:!py-2.5 text-[10px] sm:text-xs font-black text-white bg-gradient-to-r from-[#80C8F6] to-[#3957ED] rounded-xl hover:shadow-lg transition-all uppercase tracking-wider cursor-pointer"
            >
              Tempel Ulasan 📌
            </Button>
          </form>
        </div>
      </div>
    </ScrollReveal>
  );
}
