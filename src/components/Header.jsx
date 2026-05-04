import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, ChevronDown, User, Settings,
  LogOut, X, Check, Menu, Users, Receipt,
  Package, CheckCircle, Clock,
} from "lucide-react";

// ── Data untuk global search ──────────────────────────────────────────────
import customers from "../data/customers.json";
import transactions from "../data/transactions.json";
import laundry from "../data/laundryStatus.json";

// Notifikasi awal
const INITIAL_NOTIFS = [
  {
    id: 1,
    type: "laundry",
    title: "Cucian Selesai",
    desc: "TRX-001 · Rina Marlina sudah bisa diambil",
    time: "2 menit lalu",
    read: false,
  },
  {
    id: 2,
    type: "transaction",
    title: "Transaksi Baru",
    desc: "TRX-007 · Siti Nurhaliza — Rp 84.000",
    time: "15 menit lalu",
    read: false,
  },
  {
    id: 3,
    type: "laundry",
    title: "Cucian Diproses",
    desc: "TRX-008 · Rina Marlina sedang dikeringkan",
    time: "1 jam lalu",
    read: false,
  },
  {
    id: 4,
    type: "customer",
    title: "Pelanggan Tidak Aktif",
    desc: "Dedi Kurniawan belum transaksi 30+ hari",
    time: "3 jam lalu",
    read: true,
  },
  {
    id: 5,
    type: "transaction",
    title: "Transaksi Baru",
    desc: "TRX-003 · Fajar Nugroho — Rp 48.000",
    time: "5 jam lalu",
    read: true,
  },
];

const notifIcon = {
  laundry:     { Icon: Package,      bg: "bg-blue-100",   color: "text-[#3ABDE8]" },
  transaction: { Icon: Receipt,      bg: "bg-green-100",  color: "text-green-600" },
  customer:    { Icon: Users,        bg: "bg-orange-100", color: "text-orange-500" },
};

// ── Fungsi search global ──────────────────────────────────────────────────
function globalSearch(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results = [];

  // Pelanggan
  customers.forEach((c) => {
    if (c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)) {
      results.push({
        type: "customer",
        icon: Users,
        label: c.name,
        sub: c.phone + " · " + c.segment,
        path: "/customers",
      });
    }
  });

  // Transaksi
  transactions.forEach((t) => {
    if (
      t.id.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.service.toLowerCase().includes(q)
    ) {
      results.push({
        type: "transaction",
        icon: Receipt,
        label: t.id + " · " + t.customerName,
        sub: t.service + " — Rp " + t.total.toLocaleString("id-ID"),
        path: "/transactions",
      });
    }
  });

  // Tracking
  laundry.forEach((o) => {
    if (o.customerName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)) {
      results.push({
        type: "tracking",
        icon: Package,
        label: o.id + " · " + o.customerName,
        sub: o.service + " · " + o.currentStatus,
        path: "/tracking",
      });
    }
  });

  return results.slice(0, 8);
}

const typeLabel = {
  customer:    "Pelanggan",
  transaction: "Transaksi",
  tracking:    "Tracking",
};

const typeBadge = {
  customer:    "bg-blue-100 text-[#3ABDE8]",
  transaction: "bg-green-100 text-green-700",
  tracking:    "bg-yellow-100 text-yellow-700",
};

// ─────────────────────────────────────────────────────────────────────────
export default function Header({ onMenuClick }) {
  const navigate = useNavigate();

  // ── Search state ──
  const [search, setSearch]         = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchResults               = globalSearch(search);
  const searchRef                   = useRef(null);

  // ── Notif state ──
  const [notifs, setNotifs]         = useState(INITIAL_NOTIFS);
  const [notifOpen, setNotifOpen]   = useState(false);
  const notifRef                    = useRef(null);
  const unread                      = notifs.filter((n) => !n.read).length;

  // ── Profile state ──
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen,    setEditOpen]    = useState(false);
  const [adminName,   setAdminName]   = useState("Admin");
  const [adminRole,   setAdminRole]   = useState("Netto Laundry");
  const [editForm,    setEditForm]    = useState({ name: "Admin", role: "Netto Laundry" });
  const profileRef                    = useRef(null);

  // ── Close panels on outside click ──
  useEffect(() => {
    function handle(e) {
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSearchOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // ── Handlers ──
  const handleSearchSelect = (path) => {
    setSearch("");
    setSearchOpen(false);
    navigate(path);
  };

  const markAllRead = () => setNotifs(notifs.map((n) => ({ ...n, read: true })));
  const markRead    = (id) => setNotifs(notifs.map((n) => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id) => setNotifs(notifs.filter((n) => n.id !== id));

  const handleSaveProfile = () => {
    if (editForm.name.trim()) setAdminName(editForm.name.trim());
    if (editForm.role.trim()) setAdminRole(editForm.role.trim());
    setEditOpen(false);
    setProfileOpen(false);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm font-lagusans">

        {/* ── Kiri: hamburger + search ── */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Hamburger mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-blue-50 transition-colors flex-shrink-0"
          >
            <Menu size={18} className="text-gray-500" />
          </button>

          {/* Search dengan dropdown hasil */}
          <div ref={searchRef} className="relative w-44 sm:w-80">
            <div className={`flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border transition-all ${searchOpen && search ? "border-[#3ABDE8] ring-2 ring-[#3ABDE8]/10" : "border-gray-100"}`}>
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari pelanggan, transaksi..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400"
              />
              {search && (
                <button onClick={() => { setSearch(""); setSearchOpen(false); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Dropdown hasil search */}
            {searchOpen && search && (
              <div className="absolute top-full left-0 mt-2 w-full sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40">
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="text-xs text-gray-400 font-medium">{searchResults.length} hasil ditemukan</p>
                    </div>
                    <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {searchResults.map((r, i) => {
                        const Icon = r.icon;
                        return (
                          <li key={i}>
                            <button
                              onClick={() => handleSearchSelect(r.path)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeBadge[r.type].split(" ")[0]}`}>
                                <Icon size={14} className={typeBadge[r.type].split(" ")[1]} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{r.label}</p>
                                <p className="text-xs text-gray-400 truncate">{r.sub}</p>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${typeBadge[r.type]}`}>
                                {typeLabel[r.type]}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Search size={28} className="mx-auto text-gray-200 mb-2" />
                    <p className="text-sm text-gray-400">Tidak ada hasil untuk <span className="font-semibold text-gray-600">"{search}"</span></p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Kanan: notif + profile ── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* ── Notifikasi ── */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-blue-50 transition-colors"
            >
              <Bell size={16} className="text-gray-500" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#3ABDE8] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {unread}
                </span>
              )}
            </button>

            {/* Panel notifikasi */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40">
                {/* Header panel */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800 text-sm">Notifikasi</p>
                    {unread > 0 && (
                      <span className="bg-[#3ABDE8] text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread}</span>
                    )}
                  </div>
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-xs text-[#3ABDE8] font-semibold hover:underline flex items-center gap-1">
                      <CheckCircle size={12} /> Tandai semua dibaca
                    </button>
                  )}
                </div>

                {/* List notifikasi */}
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifs.length === 0 ? (
                    <li className="px-4 py-10 text-center">
                      <Bell size={28} className="mx-auto text-gray-200 mb-2" />
                      <p className="text-sm text-gray-400">Tidak ada notifikasi</p>
                    </li>
                  ) : notifs.map((n) => {
                    const cfg  = notifIcon[n.type] || notifIcon.transaction;
                    const Icon = cfg.Icon;
                    return (
                      <li
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors ${n.read ? "bg-white" : "bg-[#3ABDE8]/5"}`}
                      >
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                          <Icon size={15} className={cfg.color} />
                        </div>

                        {/* Konten */}
                        <div className="flex-1 min-w-0" onClick={() => markRead(n.id)}>
                          <div className="flex items-start justify-between gap-1">
                            <p className={`text-sm leading-tight ${n.read ? "text-gray-700" : "font-semibold text-gray-800"}`}>
                              {n.title}
                            </p>
                            {!n.read && <span className="w-2 h-2 bg-[#3ABDE8] rounded-full flex-shrink-0 mt-1"></span>}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{n.desc}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={10} className="text-gray-300" />
                            <p className="text-xs text-gray-400">{n.time}</p>
                          </div>
                        </div>

                        {/* Hapus */}
                        <button
                          onClick={() => deleteNotif(n.id)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                        >
                          <X size={12} />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Footer */}
                {notifs.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-100 text-center">
                    <button
                      onClick={() => { navigate("/notifications"); setNotifOpen(false); }}
                      className="text-xs text-[#3ABDE8] font-semibold hover:underline"
                    >
                      Lihat semua notifikasi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2.5 pl-1 pr-2 sm:pr-3 py-1 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-[#3ABDE8] flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-bold text-sm">{adminName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-700 leading-tight">{adminName}</p>
                <p className="text-xs text-gray-400">{adminRole}</p>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40">
                <div className="px-4 py-3 bg-gradient-to-r from-[#3ABDE8]/10 to-[#1A667A]/10 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3ABDE8] flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold">{adminName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{adminName}</p>
                      <p className="text-xs text-gray-500">{adminRole}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={() => { setEditForm({ name: adminName, role: adminRole }); setEditOpen(true); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <User size={15} className="text-gray-400" /> Edit Profil
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <Settings size={15} className="text-gray-400" /> Pengaturan
                  </button>
                </div>
                <div className="border-t border-gray-100 py-1.5">
                  <button
                    onClick={() => { setProfileOpen(false); localStorage.removeItem("netto_auth"); navigate("/login"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Edit Profile Modal ── */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 font-lagusans">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-800">Edit Profil</h2>
              <button onClick={() => setEditOpen(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500">
                <X size={14} />
              </button>
            </div>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-[#3ABDE8] flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-2xl">{(editForm.name || "A").charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Nama admin"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jabatan / Role</label>
                <input type="text" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} placeholder="Contoh: Netto Laundry"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={handleSaveProfile} className="flex-1 py-2.5 rounded-xl bg-[#3ABDE8] text-white text-sm font-semibold hover:bg-[#2AADD8] transition-colors flex items-center justify-center gap-1.5">
                <Check size={14} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
