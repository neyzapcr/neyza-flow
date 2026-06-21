import { Sparkles, Clock, Truck } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";

export default function WhyChooseUs() {
  const whyChooseUsData = [
    {
      title: "Lacak Cucian Real-Time",
      description: "Pantau setiap tahap cucian Anda mulai dari diterima, dicuci, disetrika, hingga siap diantar langsung melalui WhatsApp & Web.",
      icon: Clock,
      color: "bg-blue-50 text-[#3957ED]",
    },
    {
      title: "Proses Higienis & Cepat",
      description: "Setiap cucian pelanggan dipisah (tidak dicampur), menggunakan detergen premium ramah lingkungan, serta disetrika uap rapi.",
      icon: Sparkles,
      color: "bg-[#80C8F6]/10 text-[#3957ED]",
    },
    {
      title: "Antar Jemput Gratis",
      description: "Malas keluar rumah? Kurir Netto Ops siap menjemput cucian kotor Anda dan mengantarkannya kembali dalam kondisi bersih wangi.",
      icon: Truck,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <section id="fitur" className="py-14 bg-gradient-to-br from-[#80C8F6] to-[#3957ED] text-white relative overflow-hidden">
      <BackgroundBubbles count={10} theme="light" />
      
      {/* Top Wave (curves in from white Partners section) */}
      <div className="absolute top-[-1.5px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[10px] font-extrabold text-white uppercase tracking-wider">
            Layanan Terbaik
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Kenapa Harus Mempercayakan Pakaian Anda di Netto Laundry?
          </h2>
          <p className="text-[11px] font-bold text-white/80 leading-relaxed">
            Kami membawa proses laundry konvensional ke era digital yang serba cepat, transparan, dan berkualitas tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {whyChooseUsData.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-4 sm:p-5 border border-white/10 shadow-lg hover:translate-y-[-6px] transition-all duration-300 group text-left"
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${item.color} flex items-center justify-center mb-3 sm:mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <IconComponent className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]" />
                </div>
                <h3 className="text-[11px] sm:text-xs font-black text-gray-900 mb-1.5 sm:mb-2 group-hover:text-[#3957ED] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[9.5px] sm:text-[10.5px] font-bold text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Wave (curves out to white Services section) */}
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
