import {
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Mail,
  Map,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";
import { useSettings } from "../../../hooks/useSettings";

// Format nomor WA: strip semua non-digit, pastikan prefix 62
function toWaNumber(phone) {
  if (!phone) return "6282122448899";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return "62" + digits;
}

// Format jam tampil: "07:00" → "07.00"
function formatTime(t) {
  if (!t) return "";
  return t.replace(":", ".");
}

export default function CallToAction() {
  const { isAuthenticated, role } = useAuth();
  const { settings } = useSettings();

  const waNumber = toWaNumber(settings.phone);
  const MAPS_LINK = "https://maps.app.goo.gl/tBqX6vKNuWkP9wU16";
  const EMBED_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.661772409653!2d101.43567687349183!3d0.5075585637072189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5afd54240f221%3A0x2cd0b2091bf7f6d7!2sNETTO%20EXPREES%20LAUNDRY%20KUAU!5e0!3m2!1sid!2sid!4v1782019568210!5m2!1sid!2sid";

  return (
    <section id="cta-lokasi" className="py-10 sm:py-14 bg-[#FAFBFD] text-gray-800 relative overflow-hidden">
      
      {/* Background bubbles */}
      <BackgroundBubbles count={12} theme="blue" />

      {/* Decorative Wave Divider Top */}
      <div className="absolute top-[-1.5px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 font-lagusans">
        
        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

          {/* KOLOM KIRI: CTA & Ajakan */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            
            <ScrollReveal variant="scale">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3957ED]/5 border border-[#3957ED]/10 text-[9px] font-extrabold text-[#3957ED] uppercase tracking-wider animate-pulse">
                <Sparkles size={11} />
                {settings.laundryName}
              </div>
            </ScrollReveal>

            <ScrollReveal variant="slide-up" delay={100} className="space-y-4 pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                Siap Menjadi Bagian dari {settings.laundryName}?
              </h2>
              <p className="text-[10px] sm:text-[11.5px] md:text-xs text-gray-500 leading-relaxed font-bold">
                Daftar sekarang dan rasakan kemudahan layanan laundry modern dengan tracking pesanan, promo menarik, serta program loyalitas yang memberikan lebih banyak keuntungan di setiap transaksi!!
              </p>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal variant="slide-up" delay={200}>
              <div className="flex flex-row items-center gap-3">
                {isAuthenticated ? (
                  <Link 
                    to={role === "Admin" || role === "Karyawan" ? "/dashboard" : "/member/dashboard"}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 sm:px-8 sm:py-3.5 text-[9.5px] sm:text-[10.5px] font-black text-white bg-[#3957ED] rounded-2xl hover:bg-[#3957ED]/90 hover:shadow-xl hover:translate-y-[-1px] transition-all duration-200"
                  >
                    Dashboard Anda
                    <ArrowRight size={13} />
                  </Link>
                ) : (
                  <Link 
                    to="/register"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 sm:px-8 sm:py-3.5 text-[9.5px] sm:text-[10.5px] font-black text-white bg-[#3957ED] rounded-2xl hover:bg-[#3957ED]/90 hover:shadow-xl hover:translate-y-[-1px] transition-all duration-200"
                  >
                    Daftar Sekarang
                    <ArrowRight size={13} />
                  </Link>
                )}
                
                <a 
                  href={`https://wa.me/${waNumber}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-2.5 sm:px-8 sm:py-3.5 text-[9.5px] sm:text-[10.5px] font-black text-gray-700 bg-white border border-gray-250 rounded-2xl hover:bg-gray-50 hover:translate-y-[-1px] transition-all duration-200"
                >
                  Hubungi Kami
                </a>
              </div>
            </ScrollReveal>

          </div>

          {/* KOLOM KANAN: Informasi Lokasi & Peta */}
          <div className="lg:col-span-6 w-full">
            <ScrollReveal variant="slide-up" delay={200}>
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-white/25 text-left text-gray-800 space-y-4 w-full">
                
                <div>
                  <h3 className="text-[10.5px] sm:text-xs font-black text-gray-900 tracking-tight">
                    Kunjungi {settings.laundryName}
                  </h3>
                  <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 mt-0.5">
                    Temukan dan kunjungi outlet laundry modern kami
                  </p>
                </div>

                {/* Google Maps Embed */}
                <div className="h-32 sm:h-38 w-full rounded-xl overflow-hidden border border-slate-200/50 shadow-inner">
                  <iframe
                    title={`${settings.laundryName} Location Map`}
                    src={EMBED_SRC}
                    className="w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Contact Details */}
                <div className="space-y-2.5 pt-0.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                      <MapPin size={13} />
                    </div>
                    <div>
                      <p className="text-[7.5px] sm:text-[8.5px] font-black text-gray-450 uppercase tracking-wider">Alamat Lengkap</p>
                      <p className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-700 leading-normal">
                        {settings.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Clock size={13} />
                      </div>
                      <div>
                        <p className="text-[7.5px] sm:text-[8.5px] font-black text-gray-450 uppercase tracking-wider">Operasional</p>
                        <p className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-750">
                          {settings.openTime && settings.closeTime
                            ? `Setiap Hari: ${formatTime(settings.openTime)} - ${formatTime(settings.closeTime)}`
                            : "Setiap Hari: 07.00 - 21.00"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Phone size={13} />
                      </div>
                      <div>
                        <p className="text-[7.5px] sm:text-[8.5px] font-black text-gray-450 uppercase tracking-wider">WhatsApp</p>
                        <p className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-750">
                          {settings.phone ? `+${waNumber}` : "+62 821-2244-8899"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {settings.email && (
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <Mail size={13} />
                      </div>
                      <div>
                        <p className="text-[7.5px] sm:text-[8.5px] font-black text-gray-450 uppercase tracking-wider">Email Resmi</p>
                        <p className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-750">
                          {settings.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* External Maps Button */}
                <div className="pt-1">
                  <a 
                    href={MAPS_LINK}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-[#80C8F6] to-[#3957ED] text-white text-[8.5px] sm:text-[10px] font-black rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-1.5 hover:translate-y-[-1px]"
                  >
                    <Map size={13} />
                    Buka di Google Maps
                  </a>
                </div>

              </div>
            </ScrollReveal>
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
