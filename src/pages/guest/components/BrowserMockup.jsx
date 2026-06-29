import { Droplets, Clock, ShieldCheck, Heart } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function BrowserMockup() {
  return (
    <ScrollReveal variant="slide-left" delay={200} className="lg:col-span-6 relative w-full max-w-[350px] xs:max-w-[400px] sm:max-w-[460px] h-[340px] sm:h-[400px] mx-auto flex items-center justify-start py-4">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. THE LARGE WASHING MACHINE (Base layer, slightly to the left) */}
      <div className="relative left-1 xs:left-3 sm:left-6 w-36 h-52 xs:w-40 xs:h-56 sm:w-48 sm:h-64 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-[28px] sm:rounded-[32px] border border-white/30 shadow-2xl flex flex-col items-center justify-between z-10 group">
        
        {/* Detergent drawer line decoration at the top */}
        <div className="absolute top-2 left-4 w-12 h-1 bg-slate-200 rounded" />
        
        {/* Washing Machine Body */}
        <div className="w-full h-[78%] bg-slate-100 border-2 border-slate-300 rounded-2xl relative shadow-lg flex flex-col justify-between p-1.5 transition-all duration-300 group-hover:scale-102">
          
          {/* Top panel */}
          <div className="h-4 sm:h-6 w-full bg-slate-200 border-b border-slate-300 flex justify-between items-center px-1.5 rounded-t-xl">
            {/* Detergent drawer handle */}
            <div className="w-6 h-2 bg-slate-300 rounded border border-slate-400" />
            {/* Time display */}
            <div className="w-8 sm:w-10 h-3 bg-black rounded flex items-center justify-center text-[7px] sm:text-[9px] text-blue-400 font-mono font-bold tracking-widest shadow-inner">
              00:42
            </div>
            {/* Dial knob */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-500 shadow-sm" />
          </div>

          {/* Main glass door */}
          <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-400 bg-slate-300 flex items-center justify-center relative overflow-hidden shadow-2xl self-center my-1.5">
            {/* Water / bubble spin */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-blue-200/50 to-blue-500/70 absolute inset-0 flex items-center justify-center animate-spin-slow">
              <div className="w-12 h-12 sm:w-16 h-16 rounded-full border border-dashed border-white/40 flex items-center justify-center">
                <Droplets className="w-5 h-5 sm:w-7 sm:h-7 text-white/80" />
              </div>
            </div>
            {/* Foam bubbles inside window */}
            <span className="absolute bottom-6 left-4 w-1.5 h-1.5 rounded-full bg-white/70 bubble-1" />
            <span className="absolute bottom-4 right-4 w-1 h-1 rounded-full bg-white/60 bubble-2" />
            <span className="absolute bottom-5 left-8 w-2 h-2 rounded-full bg-white/80 bubble-3" />
            
            {/* Outer door ring shine */}
            <div className="absolute inset-0 rounded-full border-t border-l border-white/40 pointer-events-none" />
          </div>

          {/* Bottom kickplate */}
          <div className="h-2 w-full bg-slate-200 flex justify-between items-center px-2 rounded-b-xl border-t border-slate-300">
            <div className="w-2 h-1 bg-slate-400 rounded-sm" />
          </div>
        </div>

        {/* Machine Label and Live Status */}
        <div className="w-full text-center space-y-0.5">
          <p className="text-[9px] sm:text-[10px] font-black text-gray-800 leading-none">Mesin Cuci #04</p>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[6.5px] sm:text-[8px] font-black justify-center w-full animate-pulse">
            <span className="w-1 h-1 rounded-full bg-blue-500 inline-block animate-ping" />
            <span>Sedang Dicuci</span>
          </div>
        </div>

      </div>

      {/* 2. FLOATING TRACKING CARD (Top layer, overlapping on the right) */}
      <div className="absolute right-2 sm:-right-4 top-[22%] sm:top-[18%] w-[190px] sm:w-[240px] bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl p-3.5 sm:p-4.5 shadow-2xl space-y-3 sm:space-y-4 z-20 transition-all duration-300 hover:scale-[1.03]">
        
        {/* Customer Header info */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-150 flex justify-between items-start text-[8.5px] sm:text-[10px]">
          <div className="space-y-0.5 text-left">
            <p className="text-[6.5px] sm:text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider">Pelanggan</p>
            <p className="font-black text-slate-800 text-[10.5px] sm:text-[11.5px] leading-tight">Putri Saputra</p>
            <p className="text-[7.5px] sm:text-[8.5px] text-slate-500 font-mono">Resi: TRX-007</p>
          </div>
          <span className="px-1.5 py-0.5 rounded-md text-[7.5px] sm:text-[8.5px] bg-amber-50 text-amber-600 font-bold border border-amber-100/50">
            Diproses
          </span>
        </div>

        {/* Progress Stepper Timeline */}
        <div className="space-y-2.5 pl-0.5 text-left">
          {[
            { label: "Diterima", desc: "Pesanan terverifikasi", time: "08:30", done: true },
            { label: "Dicuci & Bersih", desc: "Mesin Cuci #04", time: "Sedang...", done: false, active: true },
            { label: "Selesai & Rapi", desc: "Siap diambil di outlet", time: "Estimasi sore", done: false },
          ].map((step, idx) => (
            <div key={idx} className="flex gap-2 relative pl-3.5">
              {/* Stepper line */}
              {idx < 2 && (
                <div className={`absolute left-[3.5px] top-3 w-[1px] h-5 sm:h-6 ${step.done ? "bg-[#3957ED]" : "bg-slate-200"}`} />
              )}
              
              {/* Stepper marker */}
              <div className={`absolute left-0 top-0.5 w-2 h-2 rounded-full border border-white z-10 flex items-center justify-center ${
                step.done 
                  ? "bg-green-500" 
                  : step.active 
                    ? "bg-[#3957ED] ring-4 ring-[#3957ED]/25 animate-pulse" 
                    : "bg-slate-200"
              }`} />

              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[8.5px] sm:text-[9.5px] font-black ${
                    step.done ? "text-slate-600" : step.active ? "text-[#3957ED]" : "text-slate-400"
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-[6px] sm:text-[6.5px] text-slate-400 font-mono">{step.time}</span>
                </div>
                <p className="text-[7px] sm:text-[7.5px] text-slate-400 font-medium mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Estimasi selesai box */}
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-between text-[8px] sm:text-[9px]">
          <div className="flex items-center gap-1">
            <Clock size={11} className="text-slate-400" />
            <span className="text-slate-500 font-bold">Est. Selesai:</span>
          </div>
          <span className="font-extrabold text-slate-800">Hari ini (17:00 WIB)</span>
        </div>

      </div>

      {/* 3. FLOATING BADGE: DURASI CEPAT */}
      <div className="absolute -top-1 right-2 sm:right-6 z-30 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-white/50 flex items-center gap-2 animate-float-1">
        <div className="w-6.5 h-6.5 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
          <Clock size={13} />
        </div>
        <div className="leading-tight text-left">
          <p className="text-[6px] font-extrabold text-gray-400 uppercase tracking-wider">Durasi Cepat</p>
          <p className="text-[9px] font-black text-gray-800">Express 6 Jam</p>
        </div>
      </div>

      {/* 4. FLOATING BADGE: HIGIENIS */}
      <div className="absolute -bottom-2 left-6 sm:left-14 z-30 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-white/50 flex items-center gap-2 animate-float-2">
        <div className="w-6.5 h-6.5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={13} />
        </div>
        <div className="leading-tight text-left">
          <p className="text-[6px] font-extrabold text-gray-400 uppercase tracking-wider">Higienis</p>
          <p className="text-[9px] font-black text-gray-800">1 Mesin 1 Client</p>
        </div>
      </div>

      {/* 5. FLOATING LOVE BADGE */}
      <div className="absolute top-[45%] right-0 sm:-right-4 z-30 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/50 text-[#3957ED] animate-pulse">
        <Heart size={11} fill="currentColor" />
      </div>

    </ScrollReveal>
  );
}
