import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar — fixed di mobile, relative di desktop */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Spacer desktop: mendorong konten agar tidak tertimpa sidebar fixed.
          Di desktop sidebar relative jadi spacer ini tidak dibutuhkan (hidden). */}
      <div className="hidden lg:block w-[68px] flex-shrink-0" />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
