import { useState } from "react";
import { Outlet } from "react-router-dom";
import MemberSidebar from "../pages/member/components/MemberSidebar";

export default function MemberLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden">
      <MemberSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between lg:hidden">
          <span className="font-bold text-gray-800">Netto Member</span>
          <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
