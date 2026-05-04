import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Receipt, Package, Star,
  Gift, PieChart, Bell, FileText, LogOut, Settings,
} from "lucide-react";

const menuItems = [
  {
    group: "MENU UTAMA",
    items: [
      { to: "/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
      { to: "/customers",    icon: Users,           label: "Pelanggan" },
      { to: "/transactions", icon: Receipt,         label: "Transaksi" },
      { to: "/tracking",     icon: Package,         label: "Tracking Laundry" },
      { to: "/feedback",     icon: Star,            label: "Feedback & Rating" },
    ],
  },
  {
    group: "LAINNYA",
    items: [
      { to: "/loyalty",       icon: Gift,     label: "Program Loyalitas" },
      { to: "/segmentation",  icon: PieChart, label: "Segmentasi" },
      { to: "/notifications", icon: Bell,     label: "Notifikasi" },
      { to: "/reports",       icon: FileText, label: "Laporan CRM" },
      { to: "/settings",      icon: Settings, label: "Pengaturan" },
    ],
  },
];

// Props:
//   mobileOpen  — apakah sidebar overlay mobile sedang terbuka
//   onMobileClose — callback untuk menutup overlay mobile
export default function Sidebar({ mobileOpen = false, onMobileClose }) {
  const [hovered, setHovered] = useState(false);

  // Sidebar "expanded" kalau di-hover (desktop) ATAU mobile overlay terbuka
  const expanded = hovered || mobileOpen;

  return (
    <>
      {/* ── Overlay gelap di mobile saat sidebar terbuka ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          fixed lg:static inset-y-0 left-0 z-30 lg:z-auto
          min-h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm
          font-lagusans transition-all duration-300 ease-in-out flex-shrink-0
          ${expanded ? "w-60" : "w-[68px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Logo ── */}
        <div className={`flex items-center border-b border-gray-100 transition-all duration-300 h-16 ${expanded ? "px-4" : "justify-center px-0"}`}>
          <img
            src="/img/logo Netto Dark.png"
            alt="NettoOps"
            className={`object-contain transition-all duration-300 ${expanded ? "h-10 w-auto" : "h-9 w-9"}`}
          />
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto overflow-x-hidden">
          {menuItems.map((group) => (
            <div key={group.group} className="mb-4">
              {/* Group label */}
              <div className={`overflow-hidden transition-all duration-300 ${expanded ? "h-5 opacity-100 mb-2" : "h-0 opacity-0 mb-0"}`}>
                <p className="text-[10px] font-semibold text-gray-400 tracking-widest px-2 whitespace-nowrap">
                  {group.group}
                </p>
              </div>

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        title={!expanded ? item.label : undefined}
                        onClick={mobileOpen ? onMobileClose : undefined}
                        className={({ isActive }) =>
                          `flex items-center rounded-xl text-sm font-medium transition-all duration-150
                          ${expanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5 mx-1"}
                          ${isActive
                            ? "bg-[#3ABDE8] text-white shadow-sm"
                            : "text-gray-500 hover:bg-blue-50 hover:text-[#3ABDE8]"
                          }`
                        }
                      >
                        <Icon size={18} strokeWidth={2} className="flex-shrink-0" />
                        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${expanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                          {item.label}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── Footer — Keluar ── */}
        <div className="px-2 py-4 border-t border-gray-100">
          <NavLink
            to="/login"
            title={!expanded ? "Keluar" : undefined}
            onClick={() => { localStorage.removeItem("netto_auth"); if (mobileOpen) onMobileClose?.(); }}
            className={`flex items-center rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all
              ${expanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5 mx-1"}`}
          >
            <LogOut size={18} strokeWidth={2} className="flex-shrink-0" />
            <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${expanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
              Keluar
            </span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
