import { Droplets, Clock, ShieldCheck, Heart } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function BrowserMockup() {
  return (
    <ScrollReveal variant="slide-left" delay={200} className="lg:col-span-6 relative flex justify-center py-4 w-full max-w-[440px] lg:max-w-none">
      
      {/* Background elements */}
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* 1. MAIN BROWSER MOCKUP CONTAINER */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative z-10">
        
        {/* macOS style title bar */}
        <div className="bg-gray-50 px-4 py-3 flex items-center border-b border-gray-100">
          <div className="flex gap-1.5 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
          </div>
          <div className="flex-1 max-w-[220px] mx-auto bg-gray-100 rounded-lg text-[9px] text-gray-400 text-center py-0.5 font-mono tracking-wide truncate">
            nettolaundry.id/lacak/TRX-007
          </div>
        </div>

        {/* Browser Content */}
        <div className="p-5 bg-[#FAFBFD] space-y-5 text-gray-800 text-left">
          
          {/* Tracker Status Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-150">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#80C8F6] to-[#3957ED] flex items-center justify-center text-white shadow-sm">
                <Droplets size={16} />
              </div>
              <div>
                <h4 className="text-[11px] font-extrabold text-gray-800">Pelacakan Cucian</h4>
                <p className="text-[8px] text-gray-400">Update 2 menit yang lalu</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#3957ED] text-[9px] font-bold border border-blue-100/50 animate-pulse">
              Live Status
            </span>
          </div>

          {/* Inner Grid - side-by-side on mobile */}
          <div className="grid grid-cols-12 gap-2.5 sm:gap-4 items-center">
            
            {/* Rotating Washer widget */}
            <div className="col-span-5 flex flex-col items-center justify-center p-1.5 sm:p-3 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
              
              <span className="absolute bottom-10 left-6 w-3 h-3 rounded-full bg-[#80C8F6]/40 blur-[1px] bubble-1 pointer-events-none" />
              <span className="absolute bottom-8 right-6 w-2 h-2 rounded-full bg-[#80C8F6]/30 blur-[1px] bubble-2 pointer-events-none" />
              <span className="absolute bottom-12 left-12 w-4 h-4 rounded-full bg-blue-100/50 blur-[1px] bubble-3 pointer-events-none" />

              <div className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 border-gray-200 flex items-center justify-center relative p-1 sm:p-1.5">
                <div className="w-full h-full rounded-full border border-dashed border-[#3957ED]/40 bg-[#3957ED]/5 flex items-center justify-center animate-spin-slow">
                  <Droplets className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#3957ED]/65" />
                </div>
                <span className="absolute right-0.5 top-1/2 -translate-y-1/2 w-1 h-2 sm:w-1.5 sm:h-3 bg-gray-300 rounded-l-md" />
              </div>

              <p className="text-[7px] sm:text-[9px] font-bold text-gray-800 mt-1.5 sm:mt-2.5 text-center truncate w-full">Mesin Cuci #04</p>
              <p className="text-[6px] sm:text-[8px] text-blue-500 font-semibold mt-0.5 text-center">Tahap: Washing</p>
            </div>

            {/* Stepper info */}
            <div className="col-span-7 space-y-1.5 sm:space-y-2.5">
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 border border-gray-150 flex justify-between items-center text-[7px] sm:text-[9px]">
                <div>
                  <p className="font-bold text-gray-700 leading-tight">Putri Saputra</p>
                  <p className="text-[5.5px] sm:text-[7px] text-gray-400 font-mono">Resi: TRX-007</p>
                </div>
                <span className="px-1 py-0.5 rounded text-[6.5px] sm:text-[8px] bg-amber-50 text-amber-600 font-bold border border-amber-100">
                  Diproses
                </span>
              </div>

              <div className="space-y-1 sm:space-y-1.5 pl-1 sm:pl-2">
                {[
                  { label: "Diterima", time: "08:30", done: true },
                  { label: "Dicuci & Bersih", time: "Sedang...", done: false, active: true },
                  { label: "Siap Diantar", time: "Estimasi sore", done: false },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-1.5 sm:gap-2 relative pl-2.5 sm:pl-3.5">
                    {idx < 2 && (
                      <div className={`absolute left-[3px] sm:left-[4px] top-2 sm:top-3 w-[1px] h-2.5 sm:h-3.5 ${step.done ? "bg-[#3957ED]" : "bg-gray-200"}`} />
                    )}
                    
                    <div className={`absolute left-0 top-0.5 sm:top-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white z-10 ${
                      step.done 
                        ? "bg-green-500" 
                        : step.active 
                          ? "bg-[#3957ED] ring-2 ring-[#3957ED]/20 animate-pulse" 
                          : "bg-gray-200"
                    }`} />

                    <div className="text-[7.5px] sm:text-[9px] leading-tight">
                      <span className={`font-semibold ${step.done ? "text-gray-700" : step.active ? "text-[#3957ED] font-bold" : "text-gray-400"}`}>
                        {step.label}
                      </span>
                      <span className="text-[5.5px] sm:text-[7px] text-gray-400 ml-1 sm:ml-1.5 font-mono">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Browser Footer */}
          <div className="bg-white rounded-2xl p-2.5 border border-gray-100 flex items-center justify-between text-[9px]">
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-gray-400" />
              <span className="text-gray-500">Estimasi Selesai:</span>
            </div>
            <span className="font-bold text-gray-800">Hari ini (17:00 WIB)</span>
          </div>

        </div>

      </div>

      {/* 2. FLOATING WIDGET 1 */}
      <div className="absolute -top-4 -right-4 z-20 bg-white/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-white/50 flex items-center gap-2.5 animate-float-1 group">
        <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
          <Clock size={14} />
        </div>
        <div className="leading-tight">
          <p className="text-[7px] font-semibold text-gray-400 uppercase tracking-wider">Durasi Cepat</p>
          <p className="text-[10px] font-bold text-gray-800">Express 6 Jam</p>
        </div>
      </div>

      {/* 3. FLOATING WIDGET 2 */}
      <div className="absolute -bottom-4 -left-4 z-20 bg-white/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-white/50 flex items-center gap-2.5 animate-float-2 group">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={14} />
        </div>
        <div className="leading-tight">
          <p className="text-[7px] font-semibold text-gray-400 uppercase tracking-wider">Higienis</p>
          <p className="text-[10px] font-bold text-gray-800">1 Mesin 1 Client</p>
        </div>
      </div>

      {/* 4. HEART TAG */}
      <div className="absolute top-[60%] -right-6 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/50 text-[#3957ED] animate-pulse">
        <Heart size={12} fill="currentColor" />
      </div>

    </ScrollReveal>
  );
}
