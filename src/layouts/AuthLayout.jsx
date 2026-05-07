import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex overflow-hidden bg-[#ffffff]">
      
      {/* LEFT SIDE */}
      <div
        className=" hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-[#142297] via-[#1e7a91] to-[#2940D3] flex-col items-center justify-center p-12 relative overflow-hidden rounded-r-[50%] -translate-x-20 z-10
        "
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-md">
          <div className="flex flex-col items-center mb-12">
            {/* Logo */}
            <div className="w-72 xl:w-80 mb-4">
              <img
                src="/img/logo Netto light.png"
                alt="Netto Laundry Logo"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Title */}
            <h1 className="font-Montserrat font-extrabold text-white text-4xl xl:text-5xl leading-tight tracking-tight">
              Selamat Datang!
            </h1>

            {/* Subtitle */}
            <p className="font-Montserrat text-white/80 text-lg xl:text-xl leading-relaxed mt-3 max-w-md">
              Masuk ke panel Admin{" "}
              <span className="font-bold text-white">Netto Laundry</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 font-Montserrat text-white/40 text-xs">
          © 2026 Netto Laundry All rights reserved.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 sm:p-10 min-h-screen relative z-20">
        {/* Mobile logo */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <img
            src="/img/logo Netto Dark.png"
            alt="Netto Laundry Logo"
            className="h-12 w-auto object-contain mb-2"
          />
          <p className="font-Montserrat text-xs text-gray-400">
            Customer Relationship Management
          </p>
        </div>

        {/* Auth card */}
        
          <Outlet />
        

        {/* Mobile footer */}
        <p className="lg:hidden font-Montserrat text-center text-xs text-gray-400 mt-6">
          © 2026 Netto Laundry All rights reserved.
        </p>
      </div>
    </div>
  );
}