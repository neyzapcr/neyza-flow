import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";
import HowItWorks from "./components/HowItWorks";
import Services from "./components/Services";
import Promo from "./components/Promo";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAFBFD] text-gray-800 font-lagusans overflow-x-hidden selection:bg-[#3957ED]/20 selection:text-[#3957ED]">
      
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. HERO SECTION (Biru) */}
      <Hero />

      {/* 3. KENAPA HARUS NETTO (Putih) */}
      <WhyChooseUs />

      {/* 4. CARA KERJA (Biru) */}
      <HowItWorks />

      {/* 5. DAFTAR LAYANAN LAUNDRY (Putih) */}
      <Services />

      {/* 6. PROMO & LOYALTY PROGRAM (Biru) */}
      <Promo />

      {/* 7. TESTIMONI PELANGGAN (Putih) */}
      <Testimonials />

      {/* 8. FAQ ACCORDION (Putih) */}
      <FAQ />

      {/* 9. CALL TO ACTION & LOKASI (Biru) */}
      <CallToAction />

      {/* 10. FOOTER & KONTAK (Biru Tua) */}
      <Footer />

    </div>
  );
}
