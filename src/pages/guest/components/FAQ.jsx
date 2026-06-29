import { useState } from "react";
import { ChevronDown } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";

export default function FAQ() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "Bagaimana cara kerja layanan antar jemput Netto Laundry?",
      a: "Sangat mudah! Anda cukup menghubungi admin kami melalui WhatsApp, menentukan alamat serta jadwal penjemputan. Kurir kami akan datang menjemput cucian kotor Anda, menimbangnya langsung di lokasi, dan membawanya ke workshop kami.",
    },
    {
      q: "Berapa lama proses pencucian laundry?",
      a: "Kami menyediakan beberapa jenis layanan: Layanan Express (selesai dalam 6-12 jam) dan Layanan Reguler (selesai dalam 2-3 hari) tergantung kebutuhan Anda.",
    },
    {
      q: "Apakah pakaian saya akan dicampur dengan pakaian pelanggan lain?",
      a: "Sama sekali tidak. Komitmen utama kami adalah menjaga higienitas. Setiap mesin cuci hanya digunakan untuk 1 pelanggan saja untuk menghindari risiko tertukar, kelunturan, atau kontaminasi kuman.",
    },
    {
      q: "Apakah detergen yang digunakan aman untuk pakaian bayi?",
      a: "Ya. Kami menggunakan detergen khusus hipoalergenik yang lembut, bebas dari pewangi buatan yang keras dan bahan kimia berbahaya, sehingga aman untuk kulit bayi yang sensitif.",
    },
    {
      q: "Bagaimana jika pakaian saya hilang atau rusak?",
      a: "Kami memiliki sistem pemindaian barcode pakaian yang sangat ketat untuk meminimalisir kesalahan. Namun, jika terjadi kerusakan atau kehilangan karena kelalaian operasional kami, kami akan memberikan ganti rugi hingga 10x lipat biaya laundry item tersebut sesuai dengan syarat dan ketentuan yang berlaku.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Split FAQs into two columns for desktop layout
  const leftColFaqs = faqs.filter((_, idx) => idx % 2 === 0);
  const rightColFaqs = faqs.filter((_, idx) => idx % 2 !== 0);

  return (
    <section id="faq" className="py-14 bg-gradient-to-br from-[#80C8F6] to-[#3957ED] text-white relative overflow-hidden">
      <BackgroundBubbles count={8} theme="light" />

      {/* Decorative SVG Wave Divider Top */}
      <div className="absolute top-[-1.5px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 font-lagusans">
        
        <ScrollReveal variant="slide-up">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[10px] font-extrabold text-white uppercase tracking-wider">
              FAQ
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-[11px] font-bold text-white/80 max-w-xl mx-auto">
              Temukan jawaban cepat atas pertanyaan-pertanyaan yang sering ditanyakan mengenai layanan kami.
            </p>
          </div>
        </ScrollReveal>

        {/* 2-Column FAQ Layout - Side-by-side columns on mobile */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 items-start">
          
          {/* Left Column */}
          <ScrollReveal variant="slide-right" delay={150} className="space-y-2.5 sm:space-y-4">
            {leftColFaqs.map((faq, idx) => {
              // Convert index to original array index
              const originalIdx = idx * 2;
              const isOpen = activeFaq === originalIdx;
              
              return (
                <div 
                  key={originalIdx} 
                  className={`group border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? "border-[#3957ED] bg-white ring-2 ring-[#3957ED]/15 shadow-xl shadow-[#3957ED]/8" 
                      : "border-gray-150 bg-white/75 hover:border-gray-300 hover:shadow-md hover:shadow-gray-100"
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(originalIdx)}
                    className="w-full px-2.5 py-2 sm:px-5 sm:py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <span className={`font-black text-[8px] xs:text-[9.5px] sm:text-xs leading-tight transition-colors duration-200 ${
                      isOpen ? "text-[#3957ED]" : "text-gray-800 group-hover:text-[#3957ED]"
                    }`}>
                      {faq.q}
                    </span>
                    <ChevronDown 
                      className={`w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] flex-shrink-0 ml-1.5 transition-all duration-300 ${
                        isOpen ? "transform rotate-180 text-[#3957ED]" : "text-gray-400 group-hover:text-[#3957ED]"
                      }`}
                    />
                  </button>
                  
                  {/* CSS Grid Smooth Height Auto transition details container */}
                  <div 
                    className={`grid transition-all duration-350 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] border-t border-gray-100 opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-2.5 py-2 sm:px-5 sm:py-4 text-[8px] xs:text-[9px] sm:text-[10.5px] font-bold text-gray-500 leading-normal sm:leading-relaxed bg-[#3957ED]/2">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollReveal>

          {/* Right Column */}
          <ScrollReveal variant="slide-left" delay={250} className="space-y-2.5 sm:space-y-4">
            {rightColFaqs.map((faq, idx) => {
              // Convert index to original array index
              const originalIdx = idx * 2 + 1;
              const isOpen = activeFaq === originalIdx;
              
              return (
                <div 
                  key={originalIdx} 
                  className={`group border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? "border-[#3957ED] bg-white ring-2 ring-[#3957ED]/15 shadow-xl shadow-[#3957ED]/8" 
                      : "border-gray-150 bg-white/75 hover:border-gray-300 hover:shadow-md hover:shadow-gray-100"
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(originalIdx)}
                    className="w-full px-2.5 py-2 sm:px-5 sm:py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <span className={`font-black text-[8px] xs:text-[9.5px] sm:text-xs leading-tight transition-colors duration-200 ${
                      isOpen ? "text-[#3957ED]" : "text-gray-800 group-hover:text-[#3957ED]"
                    }`}>
                      {faq.q}
                    </span>
                    <ChevronDown 
                      className={`w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] flex-shrink-0 ml-1.5 transition-all duration-300 ${
                        isOpen ? "transform rotate-180 text-[#3957ED]" : "text-gray-400 group-hover:text-[#3957ED]"
                      }`}
                    />
                  </button>
                  
                  {/* CSS Grid Smooth Height Auto transition details container */}
                  <div 
                    className={`grid transition-all duration-350 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] border-t border-gray-100 opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-2.5 py-2 sm:px-5 sm:py-4 text-[8px] xs:text-[9px] sm:text-[10.5px] font-bold text-gray-500 leading-normal sm:leading-relaxed bg-[#3957ED]/2">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollReveal>

        </div>

      </div>

    </section>
  );
}
