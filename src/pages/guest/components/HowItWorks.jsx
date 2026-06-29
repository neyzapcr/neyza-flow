import { useState, useEffect } from "react";
import { 
  Inbox, 
  Shirt, 
  Eye, 
  Sparkles
} from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Terima Pakaian",
      description: "Pakaian kotor Anda kami terima langsung di outlet atau diambil oleh kurir kami di depan pintu rumah.",
      icon: Inbox,
      stepNum: 1,
    },
    {
      title: "Masuk ke Sistem",
      description: "Data cucian dicatat secara digital untuk proses penimbangan, pelabelan, dan penentuan jenis paket.",
      icon: Shirt,
      stepNum: 2,
    },
    {
      title: "Pantau Status",
      description: "Pelanggan memantau setiap tahapan cuci secara real-time dan transparan langsung dari website.",
      icon: Eye,
      stepNum: 3,
    },
    {
      title: "Pesanan Selesai",
      description: "Pakaian bersih, wangi, rapi siap diserahkan/diantar dan Anda mendapatkan poin loyalitas.",
      icon: Sparkles,
      stepNum: 4,
    },
  ];

  // Auto-rotation effect: changes step every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const ActiveIcon = steps[activeStep].icon;

  return (
    <section id="cara-kerja" className="py-16 bg-gradient-to-br from-[#80C8F6] to-[#3957ED] text-white relative overflow-hidden">
      
      {/* CSS Animations */}
      <style>{`
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-step-change {
          animation: slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <BackgroundBubbles count={10} theme="light" />

      {/* Decorative Wave Divider Top */}
      <div className="absolute top-[-1.5px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal variant="slide-up">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-3">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[10px] font-extrabold text-white uppercase tracking-wider">
              Alur Layanan
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Bagaimana Cara Kerja Netto Laundry?
            </h2>
            <p className="text-[11px] font-bold text-white/80">
              Sistem kami bekerja secara berulang dan terarah dalam 4 langkah mudah untuk merawat pakaian Anda.
            </p>
          </div>
        </ScrollReveal>

        {/* Responsive Layout Container (Always side-by-side on all screens) */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-8 md:gap-12 lg:gap-16 w-full max-w-5xl mx-auto">
          
          {/* A. HORIZONTAL ARC TIMELINE (Left side) */}
          <div className="relative w-[130px] xs:w-[150px] sm:w-[280px] md:w-[460px] h-[70px] xs:h-[90px] sm:h-[110px] md:h-[150px] flex-shrink-0">
            {/* SVG Arc Line with Gradient */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 200">
              <defs>
                <linearGradient id="arch-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                  <stop offset="30%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d="M 60,150 C 180,20 420,20 540,150" fill="none" stroke="url(#arch-grad)" strokeWidth="3" strokeDasharray="6 6" />
            </svg>

            {/* Step buttons along the top horizontal arch */}
            {[
              { left: "10%", top: "75%" },
              { left: "36.6%", top: "25%" },
              { left: "63.3%", top: "25%" },
              { left: "90%", top: "75%" }
            ].map((pos, idx) => {
              const StepIcon = steps[idx].icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  style={{ left: pos.left, top: pos.top }}
                  className={`absolute w-8.5 h-8.5 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 shadow-lg focus:outline-none z-20 ${
                    isActive 
                      ? "bg-white text-[#3957ED] scale-110 ring-4 ring-white/30" 
                      : "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  <StepIcon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isActive ? "animate-pulse" : ""}`} />
                  
                  {/* Step number badge */}
                  <span className={`absolute -top-0.5 -right-0.5 md:-top-1.5 md:-right-1.5 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 rounded-full text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-black flex items-center justify-center shadow-md transition-colors duration-300 ${
                    isActive ? "bg-[#3957ED] text-white" : "bg-white text-[#3957ED]"
                  }`}>
                    {steps[idx].stepNum}
                  </span>
                </button>
              );
            })}
          </div>

          {/* B. EXPLANATION PANEL (Right side - Horizontal layout inside on mobile) */}
          <div className="w-[200px] xs:w-[230px] sm:w-[280px] md:w-[400px] bg-white/10 backdrop-blur-md border border-white/20 p-3 xs:p-4 sm:p-6 md:p-8 rounded-[20px] sm:rounded-[32px] shadow-2xl relative overflow-hidden min-h-[105px] xs:min-h-[125px] sm:min-h-[170px] md:min-h-[180px] flex flex-col justify-between transition-all duration-300 hover:border-white/30">
            
            {/* Giant watermark number background */}
            <div className="absolute -right-2 -bottom-4 sm:-right-4 sm:-bottom-6 text-6xl sm:text-8xl md:text-9xl font-black text-white/5 font-mono select-none pointer-events-none">
              {`0${steps[activeStep].stepNum}`}
            </div>

            {/* Dynamic Step Content container (horizontal flow on mobile, vertical on desktop) */}
            <div key={activeStep} className="animate-step-change flex flex-row md:flex-col items-center md:items-start gap-3 sm:gap-4 text-left">
              
              {/* Icon badge */}
              <div className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-white text-[#3957ED] flex items-center justify-center shadow-lg flex-shrink-0">
                <ActiveIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1 sm:space-y-2 flex-1">
                <h3 className="text-[10px] xs:text-[11px] sm:text-[12.5px] md:text-lg font-black text-white tracking-wide leading-tight">
                  {steps[activeStep].stepNum}. {steps[activeStep].title}
                </h3>
                <p className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-xs text-white/80 leading-normal sm:leading-relaxed font-bold">
                  {steps[activeStep].description}
                </p>
              </div>

            </div>

            {/* Bottom active dot markers */}
            <div className="flex gap-1 sm:gap-1.5 pt-2.5 sm:pt-4 border-t border-white/10 mt-3 sm:mt-4 relative z-10">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeStep === idx ? "w-4 sm:w-6 bg-white" : "w-1 sm:w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Decorative Wave Divider Bottom */}
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
