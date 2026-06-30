import { MapPin, Phone, Mail, Clock, ArrowRight, Shirt } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../../../components/Logo";
import BackgroundBubbles from "./BackgroundBubbles";
import { useSettings } from "../../../hooks/useSettings";

// Format nomor WA
function toWaNumber(phone) {
  if (!phone) return "6282122448899";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return "62" + digits;
}

function formatTime(t) {
  return t ? t.slice(0, 5).replace(":", ".") : "";
}

// ── Ikon sosmed SVG ────────────────────────────────────────────────────────
const IconInstagram = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const IconFacebook = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconWhatsapp = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// ── Data navigasi ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Beranda",     href: "#home" },
  { label: "Tentang Kami", href: "#tentang-kami" },
  { label: "Cara Kerja",  href: "#cara-kerja" },
  { label: "Layanan",     href: "#layanan" },
  { label: "Ulasan",      href: "#testimoni" },
  { label: "FAQ",         href: "#faq" },
];

const MEMBER_LINKS = [
  { label: "Daftar Akun",       to: "/register" },
  { label: "Masuk",             to: "/login" },
  { label: "Dashboard Member",  to: "/member/dashboard" },
  { label: "Tracking Laundry",  to: "/member/tracking" },
  { label: "Program Loyalitas", to: "/member/loyalty" },
];

export default function Footer() {
  const { settings } = useSettings();
  const waNumber = toWaNumber(settings.phone);

  return (
    <footer className="bg-gradient-to-br from-[#80C8F6] to-[#3957ED] text-white relative overflow-hidden font-lagusans">

      {/* ── Background bubbles ── */}
      <BackgroundBubbles count={8} theme="light" />

      {/* ── Decorative blobs ── */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/10 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/8 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* ── Main footer content ── */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Kolom 1 — Brand */}
          <div className="lg:col-span-1 space-y-5">
            <Logo variant="light" className="h-9 w-auto" />
            <p className="text-xs text-white/70 leading-relaxed">
              Layanan laundry modern dengan sistem digital — tracking real-time, program loyalitas, dan kemudahan transaksi dalam satu platform.
            </p>

            {/* Sosmed */}
            <div className="flex items-center gap-2.5">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank" rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:text-[#3957ED]"
              >
                <IconWhatsapp />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:text-[#3957ED]"
              >
                <IconInstagram />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:text-[#3957ED]"
              >
                <IconFacebook />
              </a>
            </div>
          </div>

          {/* Kolom 2 — Navigasi */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-4">
              Navigasi
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-xs text-white/75 hover:text-white transition-colors duration-150"
                  >
                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 text-white" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3 — Member */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-4">
              Area Member
            </p>
            <ul className="space-y-2.5">
              {MEMBER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-xs text-white/75 hover:text-white transition-colors duration-150"
                  >
                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 text-white" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4 — Kontak */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-4">
              Kontak & Lokasi
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} className="text-white" />
                </div>
                <p className="text-xs text-white/75 leading-relaxed">{settings.address}</p>
              </li>

              {settings.openTime && settings.closeTime && (
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Setiap Hari</p>
                    <p className="text-xs font-bold text-white">
                      {formatTime(settings.openTime)} – {formatTime(settings.closeTime)} WIB
                    </p>
                  </div>
                </li>
              )}

              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={13} className="text-white" />
                </div>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-white/75 hover:text-white transition-colors"
                >
                  {settings.phone || "+62 821-2244-8899"}
                </a>
              </li>

              {settings.email && (
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail size={13} className="text-white" />
                  </div>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-xs text-white/75 hover:text-white transition-colors break-all"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/20 relative z-10" />

      {/* ── Bottom bar ── */}
      <div className="max-w-6xl mx-auto px-6 py-5 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-2 text-[10px] text-white/60">
            <Shirt size={12} className="text-white" />
            <span>© {new Date().getFullYear()} {settings.laundryName}. Semua hak dilindungi.</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="#" className="text-[10px] text-white/60 hover:text-white transition-colors">
              Syarat & Ketentuan
            </a>
            <a href="#" className="text-[10px] text-white/60 hover:text-white transition-colors">
              Kebijakan Privasi
            </a>
            <span className="text-[10px] text-white/40">
              Made with ♥ in Pekanbaru
            </span>
          </div>

        </div>
      </div>

    </footer>
  );
}
