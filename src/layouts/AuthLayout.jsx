import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">

      {/* ── Kiri: Panel branding ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-[#1A667A] via-[#1e7a91] to-[#3ABDE8] flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Dekorasi lingkaran */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2" />

        {/* Konten branding */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">

          {/* Logo + teks rapat tanpa gap */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-56 xl:w-64">
              <img
                src="/img/logo Netto light.png"
                alt="NettoOps Logo"
                className="w-full h-auto object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="font-lagusans font-extrabold text-white text-3xl xl:text-4xl leading-tight mt-2">
              Selamat Datang!
            </h1>
            <p className="font-lagusans text-white/80 text-base xl:text-lg leading-relaxed mt-1">
              Masuk ke panel Admin <span className="font-bold text-white">NettoOps</span>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="absolute bottom-6 font-lagusans text-white/40 text-xs">
          © 2026 Netto Laundry All rights reserved.
        </p>
      </div>

      {/* ── Kanan: Form area ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6 sm:p-10 min-h-screen">

        {/* Logo mobile */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <img
            src="/img/logo Netto Dark.png"
            alt="NettoOps Logo"
            className="h-12 w-auto object-contain mb-2"
          />
          <p className="font-lagusans text-xs text-gray-400">Customer Relationship Management</p>
        </div>

        {/* Card form */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <Outlet />
        </div>

        <p className="lg:hidden font-lagusans text-center text-xs text-gray-400 mt-6">
          © 2026 Netto Laundry All rights reserved.
        </p>
      </div>

    </div>
  );
}
