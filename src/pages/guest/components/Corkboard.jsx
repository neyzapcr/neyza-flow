import { Star } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function Corkboard({ testimonialList, onCardClick }) {
  return (
    <ScrollReveal variant="slide-right" delay={150} className="flex-1">
      <div className="bg-[#E6F0FA] border-[10px] border-[#3957ED]/20 rounded-3xl p-5 shadow-2xl relative max-h-[390px] overflow-y-auto board-scrollbar flex flex-col justify-between shadow-inner h-full">
        
        {/* Corkboard texture pattern */}
        <div 
          className="absolute inset-0 opacity-[0.16] pointer-events-none rounded-xl" 
          style={{ 
            backgroundImage: "radial-gradient(#3957ED 1px, transparent 0), radial-gradient(#3957ED 1px, transparent 0)",
            backgroundSize: "6px 6px",
            backgroundPosition: "0 0, 3px 3px"
          }} 
        />
        
        {/* Testimonial Cards Layout Flex inside board */}
        <div className="flex flex-wrap gap-4 relative z-10 flex-1 justify-center sm:justify-start items-start content-start pb-4">
          {testimonialList.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => onCardClick(item)}
              className={`relative p-3 shadow-md border border-slate-100 flex flex-col justify-between w-[150px] sm:w-[185px] aspect-[1.4/1] min-h-[107px] sm:min-h-[132px] select-none transition-all duration-300 hover:scale-[1.04] hover:z-20 hover:shadow-xl cursor-pointer active:scale-95 ${item.bgColor} ${item.textColor} ${
                item.isNew ? "animate-pin-drop" : item.tilt
              }`}
              style={{ 
                "--original-rotate": item.tilt,
              }}
            >
              {/* Paper sticky tape at top of card */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-3 bg-white/40 border-t border-white/50 rotate-[3deg] shadow-sm flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-slate-500/20" />
              </div>

              {/* Header: Customer Name (Left) & Rating (Right) */}
              <div className="border-b border-current/15 pb-1.5 flex justify-between items-center w-full">
                <h4 className="text-[7.5px] sm:text-[9px] font-black tracking-wide uppercase text-left truncate max-w-[65%]">{item.name}</h4>
                <div className="flex gap-0.5 text-amber-400 flex-shrink-0">
                  {Array.from({ length: item.rating }).map((_, starIdx) => (
                    <Star key={starIdx} fill="currentColor" className="stroke-none w-1.5 h-1.5 sm:w-2 sm:h-2" />
                  ))}
                </div>
              </div>

              {/* Testimonial Message inside card */}
              <div className="my-2 flex-1 flex items-center justify-center overflow-hidden">
                <p className="text-[8.5px] sm:text-[9.5px] font-bold leading-snug italic text-center w-full line-clamp-3">
                  "{item.feedback}"
                </p>
              </div>

              {/* Minimal Footer decoration */}
              <div className="pt-1 border-t border-current/10 flex justify-between items-center text-[5.5px] sm:text-[6px] font-black uppercase tracking-widest opacity-50">
                <span>Ulasan</span>
                <span>Netto Laundry</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom control bar inside board */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/50 relative z-10">
          <p className="text-[8.5px] font-black text-slate-500 uppercase font-mono tracking-widest text-left">
            Papan Pengumuman Netto
          </p>
          <span className="text-[8.5px] font-bold text-slate-500">
            Total: {testimonialList.length} Ulasan
          </span>
        </div>

      </div>
    </ScrollReveal>
  );
}
