import { Eye, Sparkles, Gift, Zap, Bell, Smartphone } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";

export default function WhyChooseUs() {
  const cards = [
    {
      title: "Pantau Status Laundry Kapan Saja",
      description: "Lihat perkembangan cucian Anda secara real-time tanpa perlu menghubungi pihak laundry.",
      icon: Eye,
      gradient: "from-blue-500/20 to-indigo-500/20 text-blue-600",
    },
    {
      title: "Dapatkan Promo Menarik",
      description: "Nikmati berbagai promo khusus yang diberikan kepada pelanggan melalui sistem kami.",
      icon: Sparkles,
      gradient: "from-amber-500/20 to-orange-500/20 text-amber-600",
    },
    {
      title: "Kumpulkan Poin Loyalitas",
      description: "Setiap transaksi akan memberikan poin yang dapat ditukarkan dengan berbagai keuntungan pada transaksi berikutnya.",
      icon: Gift,
      gradient: "from-emerald-500/20 to-teal-500/20 text-emerald-600",
    },
    {
      title: "Pelayanan Lebih Cepat",
      description: "Data pelanggan tersimpan dengan baik sehingga proses pelayanan menjadi lebih praktis.",
      icon: Zap,
      gradient: "from-purple-500/20 to-pink-500/20 text-purple-600",
    },
    {
      title: "Notifikasi Otomatis",
      description: "Dapatkan informasi ketika cucian diterima, diproses, hingga siap diambil.",
      icon: Bell,
      gradient: "from-sky-500/20 to-cyan-500/20 text-sky-600",
    },
    {
      title: "Pengalaman Laundry yang Lebih Modern",
      description: "Semua layanan dirancang agar pelanggan memperoleh pengalaman yang lebih nyaman, cepat, dan transparan.",
      icon: Smartphone,
      gradient: "from-indigo-500/20 to-purple-500/20 text-indigo-600",
    },
  ];

  return (
    <section id="why-choose-us" className="py-16 bg-[#FAFBFD] relative overflow-hidden">
      
      {/* Decorative Bubble Background */}
      <BackgroundBubbles count={10} theme="blue" />

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
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#3957ED]/5 text-[10px] font-extrabold text-[#3957ED] uppercase tracking-wider">
              Keuntungan Pelanggan
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              Kenapa Harus Netto Express Laundry?
            </h2>
            <p className="text-[11px] font-bold text-gray-500">
              Kami membawa pengalaman mencuci Anda ke era digital dengan berbagai fitur CRM yang memanjakan.
            </p>
          </div>
        </ScrollReveal>

        {/* 6-Card Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <ScrollReveal key={idx} variant="scale" delay={idx * 80} className="flex">
                {/* Outer p-[1px] for smooth gradient border on hover */}
                <div className="w-full bg-gradient-to-br from-white/80 to-white/30 hover:from-[#3957ED]/30 hover:to-[#80C8F6]/30 p-[1px] rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl hover:translate-y-[-4px] group flex">
                  
                  {/* Inner Card Container */}
                  <div className="w-full bg-white rounded-[23px] p-4 sm:p-6 flex flex-col justify-between items-start space-y-4 relative overflow-hidden text-left font-lagusans">
                    
                    {/* Background bubbles specific to card on hover */}
                    <div className="absolute right-0 bottom-0 w-16 h-16 bg-[#3957ED]/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
                    
                    <div className="space-y-3 sm:space-y-4 w-full">
                      {/* Icon circle */}
                      <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0`}>
                        <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>

                      {/* Card Texts */}
                      <div className="space-y-1">
                        <h3 className="text-[10px] xs:text-[11px] sm:text-sm font-black text-gray-900 group-hover:text-[#3957ED] transition-colors duration-250 leading-tight">
                          {card.title}
                        </h3>
                        <p className="text-[8.5px] xs:text-[9.5px] sm:text-xs text-gray-500 leading-relaxed font-bold">
                          {card.description}
                        </p>
                      </div>
                    </div>

                  </div>

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
