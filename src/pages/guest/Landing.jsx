import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowItWorks";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAFBFD] text-gray-800 font-lagusans overflow-x-hidden selection:bg-[#3957ED]/20 selection:text-[#3957ED]">
      
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <Hero />

      {/* 3. TENTANG KAMI */}
      <AboutUs />

      {/* 4. CARA KERJA */}
      <HowItWorks />

      {/* 5. DAFTAR LAYANAN LAUNDRY */}
      <Services />

      {/* 6. TESTIMONI PELANGGAN */}
      <Testimonials />

      {/* 7. FAQ ACCORDION */}
      <FAQ />

      {/* 8. FOOTER & KONTAK */}
      <Footer />

    </div>
  );
}
