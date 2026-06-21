import { MessageSquare, Award, Zap, ArrowRight } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";

export default function Promo() {
  const benefits = [
    {
      title: "Notifikasi WA Otomatis",
      desc: "Tidak perlu repot membuka web terus-menerus. Dapatkan pemberitahuan otomatis via WhatsApp setiap kali cucian Anda selesai dikeringkan atau siap diantar.",
      icon: MessageSquare,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Netto Loyalty Points",
      desc: "Kumpulkan 1 poin setiap kelipatan transaksi Rp 10.000. Kumpulkan poin sebanyak-banyaknya dan tukarkan dengan voucher cuci gratis sepuasnya!",
      icon: Award,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Prioritas VIP Express",
      desc: "Khusus member terdaftar, nikmati antrean prioritas pengerjaan Express kilat yang selesai hanya dalam waktu 6 jam saja tanpa biaya tambahan tersembunyi.",
      icon: Zap,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section id="manfaat" className="py-14 bg-[#FAFBFD] relative overflow-hidden">
      <BackgroundBubbles count={8} theme="blue" />
      
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#3957ED]/5 text-[10px] font-extrabold text-[#3957ED] uppercase tracking-wider">
            Manfaat Pelanggan
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
            Keuntungan Istimewa Menjadi Pelanggan Netto Laundry
          </h2>
          <p className="text-[11px] font-bold text-gray-500 leading-relaxed">
            Rasakan pengalaman laundry modern dengan berbagai kemudahan dan bonus poin loyalty eksklusif yang menguntungkan kantong Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={idx} 
                className="bg-white/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/60 shadow-sm hover:shadow-xl hover:translate-y-[-6px] transition-all duration-300 group text-left"
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${benefit.color} flex items-center justify-center mb-3.5 sm:mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]" />
                </div>
                
                <h3 className="text-[11px] sm:text-xs font-black text-gray-900 mb-1.5 sm:mb-2 group-hover:text-[#3957ED] transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-[9.5px] sm:text-[10.5px] font-bold text-gray-500 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
