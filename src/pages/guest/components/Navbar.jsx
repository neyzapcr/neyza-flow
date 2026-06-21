import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, Check, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { usersAPI } from "../../../services/usersApi";
import Logo from "../../../components/Logo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const userSession = JSON.parse(localStorage.getItem("netto_user") || "null");

  const [profileForm, setProfileForm] = useState({
    fullname: userSession?.fullname || "",
    email: userSession?.email || "",
    password: userSession?.password || "",
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("netto_auth");
    localStorage.removeItem("netto_user");
    window.location.reload();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);

    if (!profileForm.fullname || !profileForm.email || !profileForm.password) {
      setSaveError("Semua field wajib diisi.");
      return;
    }

    setSaveLoading(true);
    try {
      // Cek apakah email sudah terdaftar oleh user lain
      const allUsers = await usersAPI.fetchUsers();
      const emailExists = allUsers.some(
        (u) => u.id !== userSession.id && u.email && u.email.toLowerCase() === profileForm.email.toLowerCase()
      );
      if (emailExists) {
        setSaveError("Email sudah digunakan oleh pengguna lain.");
        setSaveLoading(false);
        return;
      }

      // Update user di database Supabase
      await usersAPI.updateUser(userSession.id, {
        fullname: profileForm.fullname,
        email: profileForm.email,
        password: profileForm.password,
      });

      // Update di localStorage
      const updatedUser = {
        ...userSession,
        fullname: profileForm.fullname,
        email: profileForm.email,
        password: profileForm.password,
      };
      localStorage.setItem("netto_user", JSON.stringify(updatedUser));

      setSaveSuccess(true);
      setTimeout(() => {
        setEditOpen(false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Update profile error:", err);
      setSaveError("Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 max-w-5xl mx-auto px-4 mt-4">
      <nav className="bg-white border border-gray-100 rounded-2xl px-6 py-3 flex items-center justify-between shadow-md transition-all duration-300">
        
        {/* Logo Netto */}
        <div className="flex items-center transform hover:scale-105 transition-transform duration-200">
          <Logo variant="dark" className="h-8 w-auto" />
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
          {userSession ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 pl-3.5 pr-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer focus:outline-none"
              >
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-extrabold text-gray-800 leading-tight">
                    {userSession.fullname}
                  </span>
                  <span className="text-[9px] font-medium text-gray-400 leading-none mt-0.5">
                    {userSession.email}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#3957ED] flex items-center justify-center shadow-sm flex-shrink-0 text-white font-extrabold text-xs">
                  {userSession.fullname?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 bg-gradient-to-r from-[#3957ED]/10 to-[#2940D3]/10 border-b border-gray-100 text-left">
                    <p className="font-extrabold text-gray-800 text-xs">{userSession.fullname}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{userSession.email}</p>
                  </div>
                  <div className="py-1 text-left">
                    <button
                      onClick={() => {
                        setProfileForm({ 
                          fullname: userSession.fullname || "", 
                          email: userSession.email || "", 
                          password: userSession.password || "" 
                        });
                        setSaveError("");
                        setSaveSuccess(false);
                        setEditOpen(true);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <User size={14} className="text-gray-400" /> Edit Profil
                    </button>
                    {userSession.role === "admin" && (
                      <Link 
                        to="/dashboard"
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#3957ED] hover:bg-blue-50 transition-colors"
                      >
                        <Settings size={14} className="text-[#3957ED]" /> Panel Admin
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-gray-100 py-1 text-left">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} /> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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
        {userSession ? (
          <div className="flex flex-col gap-3 py-2 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#3957ED] flex items-center justify-center text-white font-extrabold text-xs">
                {userSession.fullname?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-extrabold text-gray-800 block">
                  {userSession.fullname}
                </span>
                <span className="text-[10px] font-medium text-gray-400 block mt-0.5">
                  {userSession.email}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-2 mt-1">
              <button 
                onClick={() => {
                  setProfileForm({ 
                    fullname: userSession.fullname || "", 
                    email: userSession.email || "", 
                    password: userSession.password || "" 
                  });
                  setSaveError("");
                  setSaveSuccess(false);
                  setEditOpen(true);
                  setMenuOpen(false);
                }}
                className="w-1/2 py-2 text-center text-[10px] font-extrabold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all uppercase tracking-wider cursor-pointer"
              >
                Edit Profil
              </button>
              {userSession.role === "admin" ? (
                <Link 
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="w-1/2 py-2 text-center text-[10px] font-extrabold text-[#3957ED] border border-[#3957ED]/25 rounded-xl hover:bg-[#3957ED]/5 transition-all uppercase tracking-wider"
                >
                  Admin Panel
                </Link>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="w-1/2 py-2 text-center text-[10px] font-extrabold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
            {userSession.role === "admin" && (
              <button 
                onClick={handleLogout}
                className="w-full py-2 text-center text-[10px] font-extrabold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        ) : (
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
        )}
      </div>

      {/* ── Edit Profile Modal ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-Montserrat p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left">
            <DialogTitle className="text-base font-bold text-gray-800">Ubah Profil Saya</DialogTitle>
            <DialogDescription className="text-xs text-gray-400 mt-0.5">Perbarui nama, email, dan password akun Anda</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-700">
            {saveSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Check size={24} className="text-green-500" />
                </div>
                <p className="font-bold text-gray-800 mb-1">Profil Berhasil Diperbarui!</p>
                <p className="text-xs text-gray-500">Memuat ulang halaman...</p>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {saveError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <span>⚠</span> {saveError}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={profileForm.fullname} 
                      onChange={(e) => setProfileForm({ ...profileForm, fullname: e.target.value })} 
                      placeholder="Nama lengkap Anda"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#3957ED] focus:ring-2 focus:ring-[#3957ED]/10 transition-all"
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Alamat Email</label>
                    <input 
                      type="email" 
                      value={profileForm.email} 
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} 
                      placeholder="email@domain.com"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#3957ED] focus:ring-2 focus:ring-[#3957ED]/10 transition-all"
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Password Baru</label>
                    <input 
                      type="password" 
                      value={profileForm.password} 
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} 
                      placeholder="Min. 6 karakter"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#3957ED] focus:ring-2 focus:ring-[#3957ED]/10 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setEditOpen(false)} 
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={saveLoading}
                    className="flex-1 py-2.5 rounded-xl bg-[#3957ED] text-white text-xs font-bold hover:bg-[#2940D3] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {saveLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
