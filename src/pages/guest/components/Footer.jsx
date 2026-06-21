import { MapPin, Phone, Mail } from "lucide-react";
import BackgroundBubbles from "./BackgroundBubbles";
import ScrollReveal from "./ScrollReveal";

export default function Footer() {
  const socials = [
    {
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      href: "#",
      label: "Instagram"
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
      href: "#",
      label: "Facebook"
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
      href: "https://wa.me/6282122448899",
      label: "WhatsApp"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-[#80C8F6] to-[#3957ED] text-white py-10 relative z-10 overflow-hidden text-center">
      <BackgroundBubbles count={6} theme="light" />
      <ScrollReveal variant="fade" className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="space-y-6">
        
        {/* Centered Logo & Motto */}
        <div className="flex flex-col items-center space-y-2">
          <img 
            src="/img/logo Netto Dark.png" 
            alt="Netto Laundry Logo" 
            className="h-8 w-auto object-contain transform hover:scale-102 transition-transform duration-200"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
            Laundry Cepat, Bersih, dan Terpercaya
          </p>
        </div>

        {/* Compact Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-extrabold text-white/80 uppercase tracking-wider">
          <a href="#home" className="hover:text-white transition-colors">Beranda</a>
          <a href="#tentang-kami" className="hover:text-white transition-colors">Tentang Kami</a>
          <a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a>
          <a href="#layanan" className="hover:text-white transition-colors">Layanan</a>
          <a href="#testimoni" className="hover:text-white transition-colors">Ulasan</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-3">
          {socials.map((social, i) => (
            <a 
              key={i} 
              href={social.href}
              aria-label={social.label}
              className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#3957ED] flex items-center justify-center transition-all duration-300 hover:translate-y-[-2px]"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <hr className="border-white/10" />

        {/* Copyright & Legal links */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-bold text-white/60">
          <p>© 2026 Netto Laundry. Hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>

        </div>
      </ScrollReveal>
    </footer>
  );
}
