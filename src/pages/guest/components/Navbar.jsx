import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 max-w-5xl mx-auto px-4 mt-4">
      <nav className="bg-white border border-gray-100 rounded-2xl px-6 py-3 flex items-center justify-between shadow-md transition-all duration-300">
        
        {/* Logo Netto */}
        <div className="flex items-center transform hover:scale-105 transition-transform duration-200">
          <img 
            src="/img/logo Netto Dark.png" 
            alt="Netto Laundry Logo" 
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7">
          {[
            { label: "Beranda", href: "#home" },
            { label: "Tentang Kami", href: "#tentang-kami" },
            { label: "Cara Kerja", href: "#cara-kerja" },
            { label: "Layanan", href: "#layanan" },
            { label: "Ulasan", href: "#testimoni" },
            { label: "FAQ", href: "#faq" },
          ].map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              className="text-[10px] font-extrabold text-gray-700 hover:text-[#3957ED] transition-colors relative group py-1 uppercase tracking-wider"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3957ED] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            to="/login" 
            className="px-3.5 py-1.5 text-[10px] font-extrabold text-gray-700 hover:text-[#3957ED] transition-all focus:outline-none uppercase tracking-wider"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-1.5 text-[10px] font-extrabold text-white bg-[#3957ED] rounded-xl hover:bg-[#2940D3] hover:shadow-md active:translate-y-[1px] transition-all duration-200 focus:outline-none uppercase tracking-wider"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-1.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      <div 
        className={`md:hidden mt-2 bg-white border border-gray-100 rounded-2xl px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[350px] py-5 opacity-100 shadow-lg" : "max-h-0 py-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-3">
          {[
            { label: "Beranda", href: "#home" },
            { label: "Tentang Kami", href: "#tentang-kami" },
            { label: "Cara Kerja", href: "#cara-kerja" },
            { label: "Layanan", href: "#layanan" },
            { label: "Ulasan", href: "#testimoni" },
            { label: "FAQ", href: "#faq" },
          ].map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              onClick={() => setMenuOpen(false)}
              className="text-xs font-extrabold text-gray-700 hover:text-[#3957ED] transition-colors uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
        </div>
        <hr className="border-gray-100 my-3.5" />
        <div className="flex flex-row gap-2">
          <Link 
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="w-1/2 py-2 text-center text-[10px] font-extrabold text-[#3957ED] border border-[#3957ED]/20 rounded-xl hover:bg-[#3957ED]/5 transition-all uppercase tracking-wider"
          >
            Login
          </Link>
          <Link 
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="w-1/2 py-2 text-center text-[10px] font-extrabold text-white bg-[#3957ED] rounded-xl hover:bg-[#2940D3] transition-all uppercase tracking-wider"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
