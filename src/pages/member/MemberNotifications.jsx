import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supabaseClient";
import {
  Bell, Package, Gift, Award, Clock, X, CheckCircle, Trash2
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import Pagination from "../../components/Pagination";

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

export default function MemberNotifications() {
  const { customerProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  async function loadNotifications() {
    if (!customerProfile?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [customerProfile?.id]);

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

  const unreadCount = notifs.filter(n => !n.isRead).length;

  // Pagination slice
  const paginatedNotifs = notifs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="h-40 bg-gray-200 rounded-2xl"></div>
        <div className="h-40 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left font-Montserrat">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Notifikasi Anda"
          subtitle="Daftar seluruh pemberitahuan riwayat pesanan dan loyalty Anda"
        />
        {unreadCount > 0 && (
          <Button
            variant="outline"
            className="text-xs font-semibold"
            icon={<CheckCircle size={14} />}
            onClick={markAllRead}
          >
            Tandai semua dibaca
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {paginatedNotifs.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Bell size={32} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700 text-sm">Tidak Ada Notifikasi</p>
            <p className="text-xs text-gray-400 mt-1">
              Anda akan melihat pembaruan status laundry dan promo Anda di sini.
            </p>
          </Card>
        ) : (
          paginatedNotifs.map((n) => {
            const cfg = notifIcon[n.type] || notifIcon.Tracking;
            const Icon = cfg.Icon;
            return (
              <div
                key={n.id}
                onClick={() => !n.isRead && markRead(n.id)}
                className={`p-5 rounded-2xl border transition-all duration-200 flex gap-4 items-start ${
                  n.isRead
                    ? "bg-white border-gray-150/70 hover:border-gray-300"
                    : "bg-[#2940D3]/5 border-[#2940D3]/20 hover:border-[#2940D3]/30 cursor-pointer"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}
                >
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm ${n.isRead ? "font-semibold text-gray-800" : "font-extrabold text-gray-900"}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <Badge variant="blue" className="text-[10px] px-1.5 py-0.5">
                        Baru
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                    <Clock size={11} />
                    <span className="text-[10px] font-medium">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                    {n.isRead && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-[10px] font-semibold text-gray-450">Dibaca</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotif(n.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0 mt-0.5"
                  title="Hapus notifikasi"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {notifs.length > itemsPerPage && (
        <div className="pt-2">
          <Pagination
            currentPage={currentPage}
            totalItems={notifs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemName="notifikasi"
          />
        </div>
      )}
    </div>
  );
}
