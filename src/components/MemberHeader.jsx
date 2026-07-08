import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseClient";
import {
  Bell, Package, Gift, Award, Clock, X, CheckCircle, ChevronDown, LogOut, Menu, User
} from "lucide-react";

const notifIcon = {
  Tracking: { Icon: Package, bg: "bg-blue-50 text-[#2940D3]", color: "text-[#2940D3]" },
  Loyalty:  { Icon: Award,   bg: "bg-green-50 text-green-600",  color: "text-green-600" },
  Promo:    { Icon: Gift,    bg: "bg-purple-50 text-purple-600", color: "text-purple-600" }
};

function formatRelativeTime(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHr < 24) return `${diffHr} jam lalu`;
  return `${diffDay} hari lalu`;
}

export default function MemberHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const { profile, customerProfile, signOut } = useAuth();

  const [notifs, setNotifs] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const unread = notifs.filter((n) => !n.isRead).length;

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Fetch notifications and subscribe to realtime updates
  useEffect(() => {
    if (!customerProfile?.id) return;

    async function fetchInitial() {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("customerId", customerProfile.id)
          .order("createdAt", { ascending: false });

        if (error) throw error;
        setNotifs(data || []);
      } catch (err) {
        console.error("Error loading notifications:", err);
      }
    }
    fetchInitial();

    const channel = supabase
      .channel(`member_notifs_${customerProfile.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `customerId=eq.${customerProfile.id}`
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifs((prev) => [payload.new, ...prev]);
            window.dispatchEvent(
              new CustomEvent("addToast", {
                detail: {
                  type: "info",
                  title: payload.new.title,
                  desc: payload.new.message
                }
              })
            );
          } else if (payload.eventType === "UPDATE") {
            setNotifs((prev) =>
              prev.map((n) => (n.id === payload.new.id ? payload.new : n))
            );
          } else if (payload.eventType === "DELETE") {
            setNotifs((prev) => prev.filter((n) => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [customerProfile?.id]);

  // Click outside listener to close panels
  useEffect(() => {
    function handle(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const markAllRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ isRead: true, readAt: new Date().toISOString() })
        .eq("customerId", customerProfile.id)
        .eq("isRead", false);

      if (error) throw error;
      setNotifs(notifs.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const markRead = async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ isRead: true, readAt: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      setNotifs(notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(`Failed to mark read (${id}):`, err);
    }
  };

  const deleteNotif = async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setNotifs(notifs.filter((n) => n.id !== id));
    } catch (err) {
      console.error(`Failed to delete notification (${id}):`, err);
    }
  };

  const memberName = profile?.fullName || "Member";
  const memberSegment = customerProfile?.segment || "New";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm font-Montserrat">
      {/* Kiri: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-blue-50 transition-colors flex-shrink-0"
        >
          <Menu size={18} className="text-gray-500" />
        </button>
        <span className="font-bold text-gray-800 hidden lg:block">Member Area</span>
        <span className="font-bold text-gray-800 lg:hidden">Netto Member</span>
      </div>

      {/* Kanan: Bell + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Notifikasi Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <Bell size={16} className="text-gray-500" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#2940D3] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unread}
              </span>
            )}
          </button>

          {/* Panel Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800 text-sm">Notifikasi</p>
                  {unread > 0 && (
                    <span className="bg-[#2940D3] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unread}
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#2940D3] font-semibold hover:underline flex items-center gap-1"
                  >
                    <CheckCircle size={12} /> Tandai semua dibaca
                  </button>
                )}
              </div>

              <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifs.length === 0 ? (
                  <li className="px-4 py-10 text-center">
                    <Bell size={28} className="mx-auto text-gray-200 mb-2 opacity-40" />
                    <p className="text-xs text-gray-400">Belum ada notifikasi baru</p>
                  </li>
                ) : (
                  notifs.slice(0, 5).map((n) => {
                    const cfg = notifIcon[n.type] || notifIcon.Tracking;
                    const Icon = cfg.Icon;
                    return (
                      <li
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                          n.isRead ? "bg-white" : "bg-[#2940D3]/5"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}
                        >
                          <Icon size={15} />
                        </div>

                        <div className="flex-1 min-w-0 animate-fade-in" onClick={() => !n.isRead && markRead(n.id)}>
                          <div className="flex items-start justify-between gap-1">
                            <p
                              className={`text-xs leading-tight ${
                                n.isRead ? "text-gray-700" : "font-bold text-gray-800"
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.isRead && (
                              <span className="w-1.5 h-1.5 bg-[#2940D3] rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                            {n.message}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={10} className="text-gray-300" />
                            <p className="text-[10px] text-gray-400">
                              {formatRelativeTime(n.createdAt)}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotif(n.id);
                          }}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                        >
                          <X size={12} />
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>

              {notifs.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <button
                    onClick={() => {
                      navigate("/member/notifications");
                      setNotifOpen(false);
                    }}
                    className="text-xs text-[#2940D3] font-semibold hover:underline"
                  >
                    Lihat semua notifikasi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1 pr-2 sm:pr-3 py-1 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2940D3] flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {memberName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-700 leading-tight truncate w-24">
                {memberName}
              </p>
              <p className="text-[10px] text-gray-450 capitalize font-medium">{memberSegment} Member</p>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40">
              <div className="px-4 py-3 bg-gradient-to-r from-[#2940D3]/10 to-[#142297]/10 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#2940D3] flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-white font-bold text-xs">
                      {memberName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-xs truncate">{memberName}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{memberSegment} Member</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate("/member/profile");
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-left"
                >
                  <User size={13} className="text-gray-400" /> Profil Saya
                </button>
              </div>
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={async () => {
                    setProfileOpen(false);
                    await signOut();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={13} /> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
