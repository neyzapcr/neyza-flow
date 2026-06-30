import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, History, Gift, Ticket, User, LogOut, X
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useSettings } from "../../../hooks/useSettings";

const navItems = [
  { to: "/member/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { to: "/member/tracking",  label: "Tracking",   icon: ClipboardList },
  { to: "/member/transactions", label: "Transaksi", icon: History },
  { to: "/member/loyalty",   label: "Loyalty",    icon: Gift },
  { to: "/member/promos",    label: "Promo",      icon: Ticket, promoKey: true },
  { to: "/member/profile",   label: "Profil",     icon: User },
];

function NavItem({ item, onClose, promoActive }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
          isActive ? "bg-[#2940D3] text-white" : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      <Icon size={18} />
      <span className="flex-1">{item.label}</span>
      {item.promoKey && promoActive && (
        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
      )}
    </NavLink>
  );
}

export default function MemberSidebar({ mobileOpen, onMobileClose }) {
  const { signOut, profile } = useAuth();
  const { settings } = useSettings();
  const promoActive = !!settings.promoStatus;

  const handleLogout = async () => {
    await signOut();
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-800">Netto Express</p>
          <p className="text-xs text-gray-400">Member Area</p>
        </div>
        <button onClick={onMobileClose} className="lg:hidden p-2 text-gray-500">
          <X size={20} />
        </button>
      </div>

      {/* Promo banner di sidebar — muncul kalau ada promo aktif */}
      {promoActive && settings.promoTitle && (
        <NavLink
          to="/member/promos"
          onClick={onMobileClose}
          className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#2940D3] to-[#5A6FE4] text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Ticket size={14} className="flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold leading-tight truncate">{settings.promoTitle}</p>
            {settings.promoDiscount > 0 && (
              <p className="text-[9px] opacity-80">Diskon {settings.promoDiscount}% untukmu!</p>
            )}
          </div>
        </NavLink>
      )}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} onClose={onMobileClose} promoActive={promoActive} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="mb-3 px-4">
          <p className="text-xs font-bold text-gray-700 truncate">{profile?.fullName || "Member"}</p>
          <p className="text-xs text-gray-400 truncate">{profile?.email || ""}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col h-full">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
