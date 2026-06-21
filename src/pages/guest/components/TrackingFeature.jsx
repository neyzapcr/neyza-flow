import { Droplets, Shirt, ShieldCheck, Check, Search, Calendar, Weight, CreditCard } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";

export default function TrackingFeature() {
  const features = [
    {
      title: "Detergen Premium & Hipoalergenik",
      description: "Kami menggunakan formula pembersih ramah lingkungan yang aman untuk kulit sensitif dan menjaga kelembutan serat kain pakaian Anda.",
      icon: Droplets,
    },
    {
      title: "Setrika Uap Presisi Tinggi",
      description: "Menghilangkan kerutan membandel dengan cepat tanpa merusak kain sensitif seperti sutra, rajut, atau sablonan pakaian.",
      icon: Shirt,
    },
    {
      title: "Garansi Kepuasan 100%",
      description: "Kurang bersih atau kurang rapi? Hubungi kami dalam waktu 24 jam dan kami akan mencuci ulang pakaian Anda secara gratis.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-18 bg-gradient-to-br from-[#142297] to-[#2940D3] text-white relative overflow-hidden">
      <BackgroundBubbles count={12} theme="light" />
      
      {/* Decorative Wave Top (matches Services section white background) */}
      <div className="absolute top-[-1.5px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual macOS Browser Mockup on Left */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
            
            {/* Main browser container (White content card popup) */}
            <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:scale-[1.01] transition-transform duration-300">
              
              {/* macOS style header */}
              <div className="bg-gray-50 px-4 py-3 flex items-center border-b border-gray-100">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                </div>
                <div className="flex-1 max-w-[260px] mx-auto bg-gray-100 rounded-lg text-[10px] text-gray-400 text-center py-1 font-mono tracking-wide truncate">
                  nettolaundry.id/lacak/TRX-003
                </div>
              </div>

              {/* Mockup Dashboard Content */}
              <div className="p-6 bg-[#FAFBFD] space-y-6 text-gray-800">
                
                {/* Search resi simulation header */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Search size={14} className="text-gray-400" />
                    <span className="text-xs font-mono font-bold text-[#3957ED]">TRX-003</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-green-100 text-green-700 text-[10px] font-bold">
                    Diproses (80%)
                  </span>
                </div>

                {/* Grid layout for Dashboard content */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                  
                  {/* Left Column inside browser: Steps Timeline list */}
                  <div className="sm:col-span-7 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Status Tahapan</p>
                    
                    <div className="relative pl-5 space-y-4">
                      {/* Step line */}
                      <div className="absolute left-2 top-2.5 w-[1.5px] h-[calc(100%-16px)] bg-gradient-to-b from-green-500 via-green-500 to-gray-200" />

                      {[
                        { step: "Diterima", desc: "Verifikasi pakaian", done: true },
                        { step: "Dicuci", desc: "Mesin Cuci #02", done: true },
                        { step: "Dikeringkan", desc: "Pengeringan vakum", done: true },
                        { step: "Disetrika", desc: "Sedang diproses", done: false, active: true },
                        { step: "Selesai", desc: "Packing & Segel", done: false },
                      ].map((step, i) => (
                        <div key={i} className="relative flex gap-3 text-[10px]">
                          {/* Dot marker */}
                          <div className={`absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full border border-white z-10 ${
                            step.active 
                              ? "bg-[#3957ED] ring-2 ring-blue-100 animate-pulse scale-110" 
                              : step.done 
                                ? "bg-green-500" 
                                : "bg-gray-200"
                          }`} />
                          
                          <div className="leading-tight">
                            <p className={`font-bold ${step.done ? "text-gray-800" : step.active ? "text-[#3957ED]" : "text-gray-400"}`}>
                              {step.step}
                            </p>
                            <p className="text-[8px] text-gray-400 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column inside browser: Detail summary card widgets */}
                  <div className="sm:col-span-5 space-y-3">
                    
                    {/* Customer Info Card */}
                    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 space-y-2">
                      <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Pelanggan</p>
                      <div>
                        <p className="text-[11px] font-bold text-gray-800">Kurnia Anwar</p>
                        <p className="text-[8px] text-gray-400 mt-0.5">0896-xxxx-3168</p>
                      </div>
                    </div>

                    {/* Order Meta Data */}
                    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 space-y-2.5 text-[9px] text-gray-550">
                      <div className="flex items-center gap-1.5">
                        <Weight size={12} className="text-[#3957ED]" />
                        <span>Berat: <span className="font-bold text-gray-800">4.0 kg</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#3957ED]" />
                        <span>Est: <span className="font-bold text-gray-800">02 Mei</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CreditCard size={12} className="text-[#3957ED]" />
                        <span>Total: <span className="font-bold text-[#3957ED]">Rp 48.000</span></span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Text description on Right */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
              Fitur Unggulan
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Lacak Cucian Anda Kapan Saja Secara Real-Time
            </h2>
            <p className="text-[11px] font-bold text-white/70 leading-relaxed">
              Kami memahami kekhawatiran Anda tentang status cucian kotor. Oleh karena itu, Netto Laundry menggunakan sistem tracking terintegrasi. Anda akan menerima tautan pelacakan yang menampilkan status pakaian Anda langsung di ponsel Anda.
            </p>

            <div className="space-y-4 pt-4 text-left">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white flex-shrink-0 transition-colors duration-200">
                      <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs sm:text-sm group-hover:text-sky-300 transition-colors duration-200">{feature.title}</h4>
                      <p className="text-[10px] font-bold text-white/60 mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Wave Bottom (matches Promo section gray-50 background) */}
      <div className="absolute bottom-[-1.5px] left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

    </section>
  );
}
