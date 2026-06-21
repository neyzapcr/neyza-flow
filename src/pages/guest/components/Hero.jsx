import { Sparkles, ArrowRight, Clock, Truck, DollarSign } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";
import BrowserMockup from "./BrowserMockup";

export default function Hero() {
  const advantages = [
    { 
      label: "Proses Cepat", 
      desc: "Layanan express selesai dalam 6 jam", 
      icon: Clock,
      color: "bg-white/10 text-white" 
    },
    { 
      label: "Harga Terjangkau", 
      desc: "Tarif ramah di kantong & bersahabat", 
      icon: DollarSign,
      color: "bg-white/10 text-white" 
    },
    { 
      label: "Antar-Jemput", 
      desc: "Kurir siap ambil & antar sampai pintu rumah", 
      icon: Truck,
      color: "bg-white/10 text-white" 
    },
  ];

  return (
    <section id="home" className="relative pt-36 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-br from-[#80C8F6] to-[#3957ED] text-white">
      
      {/* CSS Animations for Floating Widgets and Rotating Drum */}
      <style>{`
        @keyframes float-widget {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes drum-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bubble-rise {
          0% { transform: translateY(10px) scale(0.8); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
        }
        .animate-float-1 {
          animation: float-widget 5s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-widget 6s ease-in-out infinite 1s;
        }
        .animate-spin-slow {
          animation: drum-spin 12s linear infinite;
        }
        .bubble-1 { animation: bubble-rise 3s infinite ease-in-out; }
        .bubble-2 { animation: bubble-rise 4s infinite ease-in-out 1.5s; }
        .bubble-3 { animation: bubble-rise 2.5s infinite ease-in-out 0.7s; }
      `}</style>

      {/* Decorative Floating Background Circles */}
      <BackgroundBubbles count={12} theme="light" />
      <div className="absolute top-24 left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      {/* BOUNDED CONTAINER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <ScrollReveal variant="slide-right" className="lg:col-span-6">
            <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
              <Sparkles size={12} />
              Aplikasi Laundry Modern No.1 di Indonesia
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              Laundry <span className="text-sky-100">Cepat</span>, Bersih, dan <span className="text-sky-100">Terpercaya</span>!
            </h1>
            
            <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed max-w-lg font-bold">
              Solusi perawatan pakaian modern. Kami memproses pakaian Anda secara higienis, cepat, dan rapi. Nikmati kemudahan melacak cucian real-time dan layanan antar jemput instan.
            </p>

            {/* Action Row: Buttons and Advantages responsive placement */}
            <div className="pt-6 border-t border-white/10 flex flex-row flex-wrap md:flex-col gap-4 md:gap-5 items-center md:items-start justify-start w-full">
              
              {/* Group 1: Buttons side-by-side */}
              <div className="flex flex-row gap-2.5 sm:gap-3 flex-shrink-0 w-auto justify-start">
                <a 
                  href="#tentang-kami" 
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold text-[#3957ED] bg-white rounded-xl hover:bg-sky-50 hover:shadow-lg hover:translate-y-[-1px] transition-all duration-200"
                >
                  Pelajari Layanan
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>
                <a 
                  href="#layanan" 
                  className="inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold text-white bg-[#3957ED]/25 border border-white/25 rounded-xl hover:bg-white/10 hover:translate-y-[-1px] transition-all duration-200 shadow-sm"
                >
                  Lihat Paket Harga
                </a>
              </div>

              {/* Group 2: Advantages side-by-side */}
              <div className="flex flex-row gap-3 sm:gap-4 w-auto justify-start">
                {advantages.map((adv, i) => {
                  const Icon = adv.icon;
                  return (
                    <div key={i} className="flex items-center gap-1.5 text-left transform hover:scale-[1.03] transition-transform duration-200">
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 text-white flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="leading-tight">
                        <p className="text-[9px] sm:text-[10px] font-extrabold text-white">
                          {adv.label}
                        </p>
                        <p className="text-[7.5px] sm:text-[8px] text-white/70 font-semibold leading-normal hidden sm:block">
                          {adv.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </ScrollReveal>

          {/* Right Content - Visual Desktop Browser Mockup */}
          <BrowserMockup />
        </div>
      </div>

      {/* WAVE CONNECTOR BOTTOM (smoothly transitions into Partners section white bg) */}
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
