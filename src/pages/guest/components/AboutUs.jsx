import { Info, Target, Compass, MapPin } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";

export default function AboutUs() {
  const sections = [
    {
      title: "Sistem Laundry Modern",
      description: "Netto Laundry mengintegrasikan perawatan pakaian premium dengan sistem digital mutakhir. Kami memastikan seluruh data cucian Anda terpantau secara transparan melalui panel lacak cucian digital.",
      icon: Info,
      color: "bg-blue-50 text-[#3957ED]",
    },
    {
      title: "Latar Belakang",
      description: "Berdiri dari tantangan rutinitas harian yang padat, kami hadir memberikan solusi laundry berkualitas tinggi tanpa menyita waktu berharga Anda. Kami hadir mendefinisikan kembali cara Anda mencuci.",
      icon: Compass,
      color: "bg-sky-50 text-[#3957ED]",
    },
    {
      title: "Tujuan Layanan",
      description: "Memberikan kenyamanan laundry terbaik dengan mengutamakan higienitas mutlak (1 mesin 1 pelanggan), ketepatan waktu tinggi, dan parfum aromatik eksklusif yang bertahan lama.",
      icon: Target,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <section id="tentang-kami" className="py-16 bg-[#FAFBFD] relative overflow-hidden">
      <BackgroundBubbles count={8} theme="blue" />

      {/* Decorative Wave Top (connects with Hero) */}
      <div className="absolute top-[-1.5px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal variant="slide-up">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#3957ED]/5 text-[10px] font-extrabold text-[#3957ED] uppercase tracking-wider">
              Tentang Kami
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              Kenali Lebih Dekat Netto Laundry
            </h2>
            <p className="text-[11px] font-bold text-gray-500">
              Kami menghadirkan standar baru perawatan pakaian modern yang higienis, andal, dan sepenuhnya terdigitalisasi.
            </p>
          </div>
        </ScrollReveal>

        {/* Content Grid */}
        <div className="space-y-6">
          
          {/* Top Row: 3 Core Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {sections.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={idx} variant="scale" delay={idx * 120} className="flex">
                  <div 
                    className="bg-white rounded-xl sm:rounded-3xl p-2.5 sm:p-6 border border-white/60 shadow-sm hover:shadow-md transition-all duration-350 hover:translate-y-[-4px] text-left flex flex-col justify-between w-full"
                  >
                    <div>
                      <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${item.color} flex items-center justify-center mb-2 sm:mb-5`}>
                        <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                      </div>
                      <h3 className="text-[8px] xs:text-[9.5px] sm:text-xs font-black text-gray-900 mb-1 sm:mb-2.5 truncate">
                        {item.title}
                      </h3>
                      <p className="text-[7.5px] sm:text-[10.5px] font-bold text-gray-500 leading-normal sm:leading-relaxed line-clamp-5 sm:line-clamp-none">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Bottom Row: Full-width Location & Contact Map Card */}
          <ScrollReveal variant="slide-up" delay={300}>
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-white/60 shadow-md text-left">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left Side: Location Address & Info */}
                <div className="md:col-span-5 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-gray-900">
                      Lokasi Usaha Kami
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-extrabold text-gray-700 mt-1">
                      Netto Laundry Workshop Utama
                    </p>
                    <p className="text-[9.5px] sm:text-[10.5px] font-bold text-gray-400 mt-1.5 leading-relaxed">
                      Jl. Kebon Jeruk Raya No. 42A, Palmerah, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11530.
                    </p>
                  </div>
                </div>

                {/* Right Side: Map Embed */}
                <div className="md:col-span-7 h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-slate-200/50">
                  <iframe
                    title="Netto Laundry Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4422204992984!2d106.78205467475005!3d-6.205241793782528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f727c62bb1bb%3A0xc3fcdcdcdb53cbfa!2sJl.%20Kebon%20Jeruk%20Raya%20No.42%2C%20RT.1%2FRW.9%2C%20Kb.%20Jeruk%2C%20Kec.%20Kb.%20Jeruk%2C%20Kota%20Jakarta%20Barat%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2011530!5e0!3m2!1sid!2sid!4v1718872000000!5m2!1sid!2sid"
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

      </div>
    </section>
  );
}
