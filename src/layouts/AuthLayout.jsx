import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3ABDE8]/10 via-white to-[#1A667A]/5 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#3ABDE8]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#1A667A]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#1A667A] flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-xl font-lagusans">N</span>
          </div>
          <div>
            <p className="font-lagusans font-extrabold text-gray-800 text-xl leading-tight">
              Netto<span className="text-[#3ABDE8]">Ops</span>
            </p>
            <p className="font-lagusans text-xs text-gray-400">Customer Relationship Management</p>
          </div>
        </div>

        {/* Card — Outlet merender child route (Login / Register / Forgot) */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <Outlet />
        </div>

        <p className="text-center font-lagusans text-xs text-gray-400 mt-6">
          © 2025 NettoOps CRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}
