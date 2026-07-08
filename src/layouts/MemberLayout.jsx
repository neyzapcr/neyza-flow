import { useState } from "react";
import { Outlet } from "react-router-dom";
import MemberSidebar from "../pages/member/components/MemberSidebar";
import MemberHeader from "../components/MemberHeader";

export default function MemberLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden">
      <MemberSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <MemberHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
