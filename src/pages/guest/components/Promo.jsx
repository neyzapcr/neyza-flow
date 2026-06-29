import { UserPlus, Trophy, Ticket, Star, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";

export default function Promo() {
  const userSession = JSON.parse(localStorage.getItem("netto_user") || "null");

  const promoCards = [
    {
      title: "Member Baru",
      description: "Daftar sekarang dan nikmati promo khusus untuk transaksi pertama Anda.",
      icon: UserPlus,
      tag: "Diskon 20%",
      tagBg: "bg-rose-500 text-white",
      color: "from-blue-50 to-sky-50 border-blue-100 text-blue-600",
    },
    {
      title: "Loyalty Point",
      description: "Semakin sering menggunakan layanan, semakin banyak poin yang dapat dikumpulkan.",
      icon: Trophy,
      tag: "Tukar Hadiah",
      tagBg: "bg-emerald-500 text-white",
      color: "from-emerald-50 to-teal-50 border-emerald-100 text-emerald-600",
    },
    {
      title: "Promo Spesial",
      description: "Dapatkan berbagai penawaran menarik pada periode tertentu atau hari besar.",
      icon: Ticket,
      tag: "Kupon Mingguan",
      tagBg: "bg-amber-500 text-white",
      color: "from-amber-50 to-orange-50 border-amber-100 text-amber-600",
    },
    {
      title: "Pelanggan Setia",
      description: "Pelanggan dengan poin tertentu akan memperoleh keuntungan tambahan sesuai program yang berlaku.",
      icon: Star,
      tag: "Prioritas",
      tagBg: "bg-purple-500 text-white",
      color: "from-purple-50 to-pink-50 border-purple-100 text-purple-600",
    },
  ];

  return (
    <section id="promo" className="py-16 bg-gradient-to-br from-[#80C8F6] to-[#3957ED] text-white relative overflow-hidden">
      
      {/* Background Bubbles */}
      <BackgroundBubbles count={8} theme="light" />

      {/* Decorative Wave Divider Top */}
      <div className="absolute top-[-1.5px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal variant="slide-up">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[10px] font-extrabold text-white uppercase tracking-wider">
              <Gift size={11} className="text-white" />
              Promo & Loyalty Program
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Nikmati Promo & Keuntungan Berlimpah
            </h2>
            <p className="text-[11px] font-bold text-blue-100">
              Kumpulkan poin loyalitas Netto di setiap pemesanan dan nikmati diskon khusus yang kami persiapkan untuk Anda.
            </p>
          </div>
        </ScrollReveal>

        {/* Promo Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {promoCards.map((promo, idx) => {
            const Icon = promo.icon;
            return (
              <ScrollReveal key={idx} variant="scale" delay={idx * 100} className="flex">
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-white/60 shadow-sm hover:shadow-2xl hover:translate-y-[-6px] hover:border-white/80 transition-all duration-300 flex flex-col justify-between relative group w-full text-left font-lagusans">
                  
                  {/* Floating Promo Tag */}
                  {promo.tag && (
                    <span className={`absolute top-2.5 right-2.5 sm:top-4 sm:right-4 px-2 py-0.5 rounded-full text-[6.5px] sm:text-[9px] font-black uppercase tracking-wider ${promo.tagBg}`}>
                      {promo.tag}
                    </span>
                  )}

                  <div className="space-y-4">
                    {/* Icon circle */}
                    <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${promo.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-[10px] xs:text-[11px] sm:text-sm font-black text-gray-900 group-hover:text-[#3957ED] transition-colors duration-250 leading-tight">
                        {promo.title}
                      </h3>
                      <p className="text-[8.5px] xs:text-[9.5px] sm:text-xs text-gray-500 leading-relaxed font-bold">
                        {promo.description}
                      </p>
                    </div>
                  </div>

                  {/* Optional Action inside card */}
                  {idx === 0 && !userSession && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Link 
                        to="/register" 
                        className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-black text-[#3957ED] hover:underline uppercase tracking-wider"
                      >
                        Daftar Sekarang
                        <ArrowRight size={10} />
                      </Link>
                    </div>
                  )}

                </div>
              </ScrollReveal>
            );
          })}
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
