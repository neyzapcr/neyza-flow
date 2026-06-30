import { MapPin, Phone, Clock } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";
import { useSettings } from "../../../hooks/useSettings";

// Format jam tampil: "07:00" → "07.00"
function formatTime(t) {
  if (!t) return "";
  return t.replace(":", ".");
}

export default function TemukanKami() {
  const { settings } = useSettings();

  // Iframe embed tetap pakai fallback hardcoded — tidak ada kolom mapsEmbed di DB
  const EMBED_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.661772409653!2d101.43567687349183!3d0.5075585637072189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5afd54240f221%3A0x2cd0b2091bf7f6d7!2sNETTO%20EXPREES%20LAUNDRY%20KUAU!5e0!3m2!1sid!2sid!4v1782019568210!5m2!1sid!2sid";

  return (
    <section id="temukan-kami" className="py-16 bg-gradient-to-br from-[#80C8F6] to-[#3957ED] text-white relative overflow-hidden">
      
      {/* Background bubbles */}
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
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[10px] font-extrabold text-white uppercase tracking-wider">
              Temukan Kami
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Kunjungi Outlet {settings.laundryName}
            </h2>
            <p className="text-[11px] font-bold text-blue-100">
              Gunakan peta petunjuk arah di bawah ini untuk mempermudah kunjungan Anda ke outlet fisik kami.
            </p>
          </div>
        </ScrollReveal>

        {/* Location & Map Card */}
        <ScrollReveal variant="slide-up" delay={200}>
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-white/20 text-left text-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Side: Address Details */}
              <div className="md:col-span-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-gray-900">
                      Lokasi Usaha Kami
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-extrabold text-gray-700 mt-1">
                      {settings.laundryName}
                    </p>
                    <p className="text-[9.5px] sm:text-[10.5px] font-bold text-gray-500 mt-1 leading-relaxed">
                      {settings.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-gray-900">
                      Jam Operasional
                    </h3>
                    <p className="text-[9.5px] sm:text-[10.5px] font-bold text-gray-500 mt-1 leading-relaxed">
                      {settings.openTime && settings.closeTime
                        ? `Setiap Hari: ${formatTime(settings.openTime)} - ${formatTime(settings.closeTime)} WIB`
                        : "Setiap Hari: 07.00 - 21.00 WIB"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-gray-900">
                      Hubungi Kami
                    </h3>
                    <p className="text-[9.5px] sm:text-[10.5px] font-bold text-gray-500 mt-1 leading-relaxed">
                      WhatsApp: {settings.phone || "+62 821-2244-8899"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Map Embed */}
              <div className="md:col-span-7 h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-slate-200/50 shadow-inner">
                <iframe
                  title={`${settings.laundryName} Location Map`}
                  src={EMBED_SRC}
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

            </div>
          </div>
        </ScrollReveal>

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
