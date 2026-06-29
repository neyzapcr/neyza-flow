import { Sparkles, Shirt, Droplets, Check, ArrowRight } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";
import Button from "../../../components/Button";

export default function Services() {
  const serviceList = [
    {
      title: "Cuci Kiloan (Reguler)",
      price: "Rp 8.000",
      unit: "kg",
      tag: "Best Seller",
      desc: "Solusi laundry harian lengkap dan higienis. Pakaian dicuci bersih terpisah menggunakan detergen premium, disetrika uap presisi, dan diberi parfum eksklusif.",
      icon: Shirt,
      color: "from-blue-50 to-indigo-50 text-indigo-600 border-indigo-100",
      badgeColor: "bg-indigo-100 text-indigo-700",
      popular: false,
      ribbonText: "Hemat",
    },
    {
      title: "Setrika Saja",
      price: "Rp 5.000",
      unit: "kg",
      tag: "Sangat Praktis",
      desc: "Hanya butuh pakaian rapi seketika? Setrika uap bertekanan tinggi kami siap merapikan pakaian Anda bebas kusut hingga licin sempurna.",
      icon: Check,
      color: "from-green-50 to-emerald-50 text-emerald-600 border-emerald-100",
      badgeColor: "bg-green-100 text-green-700",
      popular: false,
      ribbonText: null,
    },
    {
      title: "Layanan Express (6 Jam)",
      price: "Rp 15.000",
      unit: "kg",
      tag: "Paling Populer",
      desc: "Layanan cuci kilat super cepat selesai hanya dalam waktu 6 jam. Sangat cocok untuk kebutuhan pakaian darurat atau mendesak.",
      icon: Sparkles,
      color: "from-[#80C8F6]/20 to-[#3957ED]/20 text-[#3957ED] border-[#3957ED]/20",
      badgeColor: "bg-gradient-to-r from-[#80C8F6] to-[#3957ED] text-white",
      popular: true,
      ribbonText: "Hot Promo",
    },
    {
      title: "Cuci Kering (Dry Clean)",
      price: "Rp 12.000",
      unit: "pcs",
      tag: "Premium",
      desc: "Perawatan khusus pakaian berbahan halus seperti jas, gaun, kebaya, atau jaket kulit menggunakan metode pencucian kering khusus.",
      icon: Droplets,
      color: "from-sky-50 to-blue-50 text-sky-600 border-sky-100",
      badgeColor: "bg-sky-100 text-sky-700",
      popular: false,
      ribbonText: "10% Off",
    },
  ];

  return (
    <section id="layanan" className="py-16 bg-[#FAFBFD] relative overflow-hidden">
      
      {/* Background bubbles */}
      <BackgroundBubbles count={8} theme="blue" />

      {/* Decorative Wave Divider Top */}
      <div className="absolute top-[-1.5px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        <ScrollReveal variant="slide-up">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#3957ED]/5 text-[10px] font-extrabold text-[#3957ED] uppercase tracking-wider">
              Daftar Layanan
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              Layanan Laundry Terbaik Sesuai Kebutuhan Anda
            </h2>
            <p className="text-[11px] font-bold text-gray-500">
              Pilih paket layanan laundry terbaik kami dengan penawaran tarif yang terjangkau namun tetap mengedepankan kualitas bintang lima.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {serviceList.map((service, idx) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={idx} variant="scale" delay={idx * 100} className="flex">
                <div 
                  className={`bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-5 border transition-all duration-300 flex flex-col justify-between relative group hover:shadow-2xl hover:translate-y-[-8px] hover:scale-[1.02] hover:border-[#3957ED]/45 text-left w-full ${
                    service.popular 
                      ? "border-[#3957ED] ring-2 ring-[#3957ED]/5 shadow-md" 
                      : "border-white/65"
                  }`}
                >
                  {/* Diagonal Ribbon Promo Tag on top-left */}
                  {service.ribbonText && (
                    <div className="absolute top-0 left-0 overflow-hidden w-16 h-16 pointer-events-none rounded-tl-2xl sm:rounded-tl-3xl z-10">
                      <div className="absolute top-3 -left-6 w-20 bg-rose-500 text-white text-[6px] sm:text-[8px] font-black uppercase text-center py-0.5 -rotate-45 shadow-sm">
                        {service.ribbonText}
                      </div>
                    </div>
                  )}

                  {/* Popular Badge Tag */}
                  {service.tag && (
                    <span className={`absolute top-2.5 right-2.5 sm:top-4 sm:right-4 px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[6px] sm:text-[9px] font-black uppercase tracking-wider z-10 ${service.badgeColor}`}>
                      {service.tag}
                    </span>
                  )}

                  <div className="mt-4 sm:mt-6">
                    {/* Card Icon Header */}
                    <div className={`w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-gradient-to-br ${service.color} border flex items-center justify-center mb-2.5 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="w-3.5 h-3.5 sm:w-[22px] sm:h-[22px]" />
                    </div>

                    {/* Title and Price */}
                    <h3 className="text-[9px] sm:text-xs font-black text-gray-900 mb-1 sm:mb-2 group-hover:text-[#3957ED] transition-colors duration-200 truncate">
                      {service.title}
                    </h3>
                    
                    <div className="flex items-baseline gap-0.5 sm:gap-1 mb-2 sm:mb-4">
                      <span className="text-[11px] sm:text-lg font-black text-gray-955">{service.price}</span>
                      <span className="text-[7.5px] sm:text-[10px] text-gray-400 font-bold">/ {service.unit}</span>
                    </div>

                    {/* Description */}
                    <p className="text-[7.5px] sm:text-[10.5px] font-bold text-gray-500 leading-normal sm:leading-relaxed mb-3 sm:mb-6 min-h-[48px] sm:min-h-[72px] line-clamp-3 sm:line-clamp-none">
                      {service.desc}
                    </p>
                  </div>

                  {/* Card Action Button */}
                  <Button 
                    variant={service.popular ? "primary" : "ghost"}
                    className={`w-full !py-1 sm:!py-2.5 rounded-lg sm:rounded-xl text-[8.5px] sm:text-xs font-black transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
                      service.popular
                        ? "bg-gradient-to-r from-[#80C8F6] to-[#3957ED] !text-white hover:shadow-md hover:shadow-[#3957ED]/25"
                        : "!bg-gray-50 !text-gray-650 hover:!bg-gray-100 hover:!text-gray-900"
                    }`}
                  >
                    Pesan
                    <ArrowRight className="w-2.5 h-2.5 sm:w-[13px] sm:h-[13px]" />
                  </Button>

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
