import { useState, useEffect } from "react";
import { 
  Inbox, 
  Shirt, 
  Eye, 
  Droplets, 
  Wind, 
  Sparkles, 
  Bell, 
  Wallet, 
  RefreshCw 
} from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";
import PolarTimeline from "./PolarTimeline";
import CardDeck3D from "./CardDeck3D";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const steps = [
    {
      title: "Menerima Pakaian",
      description: "Kurir Netto Laundry mengambil pakaian kotor langsung dari kediaman Anda secara terjadwal.",
      icon: Inbox,
      stepNum: 1,
    },
    {
      title: "Pilih Layanan",
      description: "Pelanggan memilih jenis paket laundry (kiloan, setrika, atau express) melalui panel dashboard digital.",
      icon: Shirt,
      stepNum: 2,
    },
    {
      title: "Melakukan Tracking",
      description: "Pelanggan memantau status cucian secara real-time dari website dari awal hingga selesai.",
      icon: Eye,
      stepNum: 3,
    },
    {
      title: "Pencucian",
      description: "Proses pencucian higienis terpisah 1 mesin 1 pelanggan menggunakan detergen ramah lingkungan.",
      icon: Droplets,
      stepNum: 4,
    },
    {
      title: "Pengeringan",
      description: "Pengeringan higienis menggunakan mesin dryer modern bersuhu tinggi bebas bau apek.",
      icon: Wind,
      stepNum: 5,
    },
    {
      title: "Penyetrikaan",
      description: "Pakaian disetrika uap presisi oleh tim profesional agar licin rapi dan tidak merusak kain.",
      icon: Sparkles,
      stepNum: 6,
    },
    {
      title: "Info ke Pelanggan",
      description: "WhatsApp dan email pemberitahuan dikirim otomatis begitu cucian Anda selesai dikemas.",
      icon: Bell,
      stepNum: 7,
    },
    {
      title: "Pembayaran",
      description: "Pembayaran tagihan aman dan praktis melalui e-wallet, transfer bank, maupun tunai.",
      icon: Wallet,
      stepNum: 8,
    },
    {
      title: "Repeat Order",
      description: "Sistem mencatat preferensi Anda, memudahkan pemesanan kembali dalam sekali klik.",
      icon: RefreshCw,
      stepNum: 9,
    },
  ];

  // Detect screen size to scale 3D transform values on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-rotation effect: changes step every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [steps.length]);



  return (
    <section id="cara-kerja" className="py-16 bg-gradient-to-br from-[#80C8F6] to-[#3957ED] text-white relative overflow-hidden">
      <BackgroundBubbles count={10} theme="light" />

      {/* Decorative Wave Divider Top */}
      <div className="absolute top-[-1.5px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[55px] text-[#FAFBFD] fill-current">
          <path opacity="0.2" d="M0,90 C300,50 500,110 800,80 C950,65 1100,85 1200,75 L1200,120 L0,120 Z"></path>
          <path opacity="0.4" d="M0,70 C250,110 450,40 750,70 C950,90 1100,60 1200,85 L1200,120 L0,120 Z"></path>
          <path d="M0,50 C200,20 400,90 700,55 C900,30 1100,75 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal variant="slide-up">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-3">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[10px] font-extrabold text-white uppercase tracking-wider">
              Alur Layanan
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Bagaimana Cara Kerja Netto Laundry?
            </h2>
            <p className="text-[11px] font-bold text-white/80">
              Sistem kami bekerja secara berulang and terarah dalam 9 langkah praktis untuk merawat pakaian Anda.
            </p>
          </div>
        </ScrollReveal>

        {/* Circular Display & Overlapping 3D Cards - Kept horizontal (side-by-side) on mobile */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-16 lg:gap-24">
          <PolarTimeline steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
          <CardDeck3D steps={steps} activeStep={activeStep} isMobile={isMobile} />
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
