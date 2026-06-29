import { useState } from "react";
import { Star, X } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";
import Corkboard from "./Corkboard";
import NotepadForm from "./NotepadForm";

export default function Testimonials() {
  const [testimonialList, setTestimonialList] = useState([
    {
      name: "Putri Saputra",
      role: "Pelanggan Premium",
      feedback: "Sangat puas mencuci di Netto! Pakaian saya selalu wangi bersih, dan yang paling canggih saya bisa melacak progress tahapan cucian secara langsung lewat handphone.",
      bgColor: "bg-white",
      textColor: "text-gray-800",
      rating: 5,
      tilt: "rotate-[-2deg]",
      date: "18 Juni 2026",
      isNew: false,
    },
    {
      name: "Kurnia Anwar",
      role: "Pelanggan Setia",
      feedback: "Layanan kurir antar jemputnya sangat membantu, tepat waktu dan ramah. Pakaian tiba kembali dalam kondisi terlipat rapi, disetrika uap wangi harum semerbak.",
      bgColor: "bg-sky-50",
      textColor: "text-gray-900",
      rating: 5,
      tilt: "rotate-[2.5deg]",
      date: "19 Juni 2026",
      isNew: false,
    },
    {
      name: "Elisa Zulkarnain",
      role: "Pelanggan Baru",
      feedback: "Awalnya mencoba karena tertarik promo kupon, ternyata hasilnya luar biasa rapi wangi bintang lima. Detergen ramah lingkungannya terbukti aman untuk bayi saya.",
      bgColor: "bg-blue-50",
      textColor: "text-gray-900",
      rating: 5,
      tilt: "rotate-[-1.5deg]",
      date: "20 Juni 2026",
      isNew: false,
    },
    {
      name: "Rian Hidayat",
      role: "Pelanggan Setia",
      feedback: "Layanan express Netto Laundry beneran cepat, pagi ditaruh sore udah siap. Sangat recommended buat yang butuh pakaian buru-buru bersih.",
      bgColor: "bg-white",
      textColor: "text-gray-800",
      rating: 5,
      tilt: "rotate-[2deg]",
      date: "20 Juni 2026",
      isNew: false,
    },
  ]);

  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formFeedback, setFormFeedback] = useState("");
  const [formRating, setFormRating] = useState(5);

  const getFormattedDate = () => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('id-ID', options);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formName || !formFeedback) return;

    // Pick a clean card style sequentially or randomly
    const cardStyles = [
      { bg: "bg-white", text: "text-gray-800" },
      { bg: "bg-sky-50", text: "text-gray-900" },
      { bg: "bg-blue-50", text: "text-gray-900" },
    ];
    const pickedStyle = cardStyles[Math.floor(Math.random() * cardStyles.length)];
    
    // Choose a tilt angle
    const tilts = ["rotate-[2.5deg]", "rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-3deg]"];
    const randomTilt = tilts[Math.floor(Math.random() * tilts.length)];

    const newReview = {
      name: formName,
      role: "Pelanggan Baru",
      feedback: formFeedback,
      bgColor: pickedStyle.bg,
      textColor: pickedStyle.text,
      rating: formRating,
      tilt: randomTilt,
      date: getFormattedDate(),
      isNew: true, // triggers drop animation
    };

    setTestimonialList([newReview, ...testimonialList]);
    setFormName("");
    setFormFeedback("");
    setFormRating(5);
  };

  return (
    <section id="testimoni" className="py-16 bg-[#FAFBFD] text-gray-800 relative overflow-hidden">
      <BackgroundBubbles count={12} theme="blue" />
      
      {/* CSS Keyframe for card drop animation & custom scrollbar */}
      <style>{`
        @keyframes card-pin-drop {
          0% {
            transform: translateY(-80px) scale(1.4) rotate(15deg);
            opacity: 0;
            filter: drop-shadow(0 25px 15px rgba(0,0,0,0.15));
          }
          100% {
            transform: translateY(0px) scale(1) var(--original-rotate, rotate(-3deg));
            opacity: 1;
            filter: drop-shadow(0 10px 8px rgba(0,0,0,0.12));
          }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(15px) var(--original-rotate, rotate(0deg)); }
          100% { opacity: 1; transform: translateY(0px) var(--original-rotate, rotate(0deg)); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-pin-drop {
          animation: card-pin-drop 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .board-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .board-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .board-scrollbar::-webkit-scrollbar-thumb {
          background: #3957ED/30;
          border-radius: 9999px;
        }
        .board-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3957ED/50;
        }
      `}</style>

      {/* Curved SVG Wave Divider Top */}
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
          <div className="text-center max-w-xl mx-auto mb-8 space-y-3">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#3957ED]/5 text-[10px] font-extrabold text-[#3957ED] uppercase tracking-wider">
              Ulasan Papan Buletin
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              Ulasan Hangat Pelanggan Netto
            </h2>
            <p className="text-[11px] font-bold text-gray-500">
              Papan catatan ulasan pelanggan Netto. Tulis ulasan Anda di sebelah kanan untuk menempelkannya langsung.
            </p>
          </div>
        </ScrollReveal>

        {/* SIDE BY SIDE CONTAINER (Flex layouts: Board on Left, Notepad Form on Right) */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center">
          <Corkboard testimonialList={testimonialList} onCardClick={setSelectedTestimonial} />
          <NotepadForm
            formName={formName}
            setFormName={setFormName}
            formFeedback={formFeedback}
            setFormFeedback={setFormFeedback}
            formRating={formRating}
            setFormRating={setFormRating}
            onSubmit={handleSubmitReview}
          />
        </div>

      </div>

      {/* Modal Popup for Full Testimonial */}
      {selectedTestimonial && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSelectedTestimonial(null)}
        >
          <style>{`
            @keyframes modal-drop-in {
              0% { transform: translateY(-30px) scale(0.95); opacity: 0; }
              100% { transform: translateY(0px) scale(1); opacity: 1; }
            }
            .animate-modal {
              animation: modal-drop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>

          <div 
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 relative animate-modal text-gray-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Name, Date, Rating & Close button */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-[#3957ED] tracking-widest uppercase font-mono bg-blue-50 px-2 py-0.5 rounded-md">
                  Detail Ulasan
                </span>
                <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-wide">
                  {selectedTestimonial.name}
                </h3>
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold text-gray-400">
                  <span>{selectedTestimonial.date}</span>
                  <span>•</span>
                  <span>{selectedTestimonial.role || "Pelanggan"}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedTestimonial(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: selectedTestimonial.rating }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" className="stroke-none" />
              ))}
            </div>

            {/* Message Body */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-150 relative overflow-hidden">
              {/* Lined paper decoration */}
              <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-red-200/40 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-5 w-[1px] bg-red-200/40 pointer-events-none" />
              
              <p className="text-[11px] sm:text-xs font-bold leading-relaxed italic text-gray-700 pl-4">
                "{selectedTestimonial.feedback}"
              </p>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="px-4 py-2 text-[10px] sm:text-xs font-black text-white bg-gradient-to-r from-[#80C8F6] to-[#3957ED] rounded-xl hover:shadow-lg transition-all uppercase tracking-wider cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

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
