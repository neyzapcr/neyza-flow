import { useState } from "react";
import { Send, CheckCircle, XCircle, Bell, ToggleLeft, ToggleRight, MessageSquare, Mail } from "lucide-react";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";

const TEMPLATES = [
  {
    id: "cucian-selesai",
    name: "Cucian Selesai",
    category: "status",
    description: "Dikirim otomatis saat status laundry berubah menjadi selesai",
    trigger: "Otomatis — Status Selesai",
    defaultMessage: "Halo {nama}, cucian Anda sudah selesai dan siap diambil di LaundryPro. Terima kasih telah mempercayakan cucian Anda kepada kami.",
    active: true,
  },
  {
    id: "reminder-ambil",
    name: "Pengingat Pengambilan",
    category: "reminder",
    description: "Dikirim otomatis 2 hari setelah cucian selesai jika belum diambil",
    trigger: "Otomatis — 2 hari setelah selesai",
    defaultMessage: "Halo {nama}, cucian Anda sudah selesai sejak 2 hari lalu dan belum diambil. Segera ambil cucian Anda di LaundryPro sebelum dikenakan biaya penyimpanan.",
    active: true,
  },
  {
    id: "pelanggan-tidak-aktif",
    name: "Reminder Pelanggan Tidak Aktif",
    category: "retensi",
    description: "Dikirim ke pelanggan yang tidak bertransaksi lebih dari 30 hari",
    trigger: "Otomatis — 30 hari tidak aktif",
    defaultMessage: "Halo {nama}, kami kangen dengan Anda! Sudah lama tidak bertransaksi di LaundryPro. Kunjungi kami kembali dan dapatkan diskon 10% untuk transaksi berikutnya.",
    active: false,
  },
  {
    id: "promo-spesial",
    name: "Promo Spesial",
    category: "promosi",
    description: "Dikirim manual untuk menyebarkan informasi promo",
    trigger: "Manual",
    defaultMessage: "Halo {nama}, ada promo spesial dari LaundryPro! Dapatkan diskon 20% untuk semua layanan cuci setrika. Promo berlaku hingga akhir bulan ini. Jangan sampai terlewat!",
    active: true,
  },
];

const categoryBadge = {
  status: "bg-blue-100 text-blue-700",
  reminder: "bg-yellow-100 text-yellow-700",
  retensi: "bg-red-100 text-red-600",
  promosi: "bg-green-100 text-green-700",
};

const notifHistory = [
  { id: 1, customer: "Rina Marlina", template: "Cucian Selesai", time: "2025-04-20 11:05", channel: "WhatsApp", status: "terkirim" },
  { id: 2, customer: "Fajar Nugroho", template: "Cucian Selesai", time: "2025-04-30 11:00", channel: "WhatsApp", status: "terkirim" },
  { id: 3, customer: "Siti Nurhaliza", template: "Pengingat Pengambilan", time: "2025-05-01 10:05", channel: "Email", status: "terkirim" },
  { id: 4, customer: "Dedi Kurniawan", template: "Reminder Pelanggan Tidak Aktif", time: "2025-04-01 09:00", channel: "WhatsApp", status: "gagal" },
  { id: 5, customer: "Ani Rahayu", template: "Promo Spesial", time: "2025-04-15 08:00", channel: "Email", status: "terkirim" },
];

export default function Notifications() {
  const [templates, setTemplates] = useState(TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [messageText, setMessageText] = useState(TEMPLATES[0].defaultMessage);
  const [channel, setChannel] = useState("whatsapp");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState(notifHistory);

  const handleSelectTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    setMessageText(tmpl.defaultMessage);
    setSent(false);
  };

  const handleToggle = (id) => {
    setTemplates(templates.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setSelectedCustomers(checked ? customersData.map((c) => c.id) : []);
  };

  const handleSelectCustomer = (id, checked) => {
    const next = checked ? [...selectedCustomers, id] : selectedCustomers.filter((x) => x !== id);
    setSelectedCustomers(next);
    setSelectAll(next.length === customersData.length);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!selectedCustomers.length) return;
    setSending(true);
    setTimeout(() => {
      const newEntries = selectedCustomers.map((cid) => {
        const c = customersData.find((x) => x.id === cid);
        return {
          id: Date.now() + cid,
          customer: c.name,
          template: selectedTemplate.name,
          time: new Date().toLocaleString("id-ID"),
          channel: channel === "whatsapp" ? "WhatsApp" : "Email",
          status: "terkirim",
        };
      });
      setHistory([...newEntries, ...history]);
      setSending(false);
      setSent(true);
      setSelectedCustomers([]);
      setSelectAll(false);
    }, 1500);
  };

  return (
    <div>
      <PageHeader title="Notifikasi" subtitle="Kelola template dan kirim notifikasi ke pelanggan" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Template Aktif", value: templates.filter((t) => t.active).length, Icon: Bell, color: "bg-blue-50", iconColor: "text-[#3ABDE8]" },
          { label: "Terkirim Hari Ini", value: history.filter((h) => h.status === "terkirim").length, Icon: CheckCircle, color: "bg-green-50", iconColor: "text-green-500" },
          { label: "Gagal Terkirim", value: history.filter((h) => h.status === "gagal").length, Icon: XCircle, color: "bg-red-50", iconColor: "text-red-500" },
          { label: "Total Riwayat", value: history.length, Icon: MessageSquare, color: "bg-yellow-50", iconColor: "text-yellow-500" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-white`}>
            <s.Icon size={20} className={`${s.iconColor} mb-2`} />
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Template List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm">Template Notifikasi</p>
            <p className="text-xs text-gray-400 mt-0.5">Pilih template untuk dikirim</p>
          </div>
          <div className="divide-y divide-gray-50">
            {templates.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className={`px-5 py-4 cursor-pointer transition-all ${selectedTemplate.id === t.id ? "bg-[#3ABDE8]/5 border-l-2 border-[#3ABDE8]" : "hover:bg-gray-50 border-l-2 border-transparent"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${categoryBadge[t.category]}`}>{t.category}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggle(t.id); }}
                    className="flex-shrink-0 mt-0.5"
                    title={t.active ? "Nonaktifkan" : "Aktifkan"}
                  >
                    {t.active
                      ? <ToggleRight size={22} className="text-[#3ABDE8]" />
                      : <ToggleLeft size={22} className="text-gray-300" />
                    }
                  </button>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{t.description}</p>
                <p className="text-xs text-[#3ABDE8] mt-1 font-medium">{t.trigger}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle + Right: Send Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="font-bold text-gray-800 mb-1">Kirim Notifikasi</p>
            <p className="text-xs text-gray-400 mb-4">Template: <span className="font-semibold text-gray-600">{selectedTemplate.name}</span></p>

            {sent && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
                <CheckCircle size={16} />
                Notifikasi berhasil dikirim ke {history.filter((h) => h.template === selectedTemplate.name).length} pelanggan.
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4">
              {/* Message */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Isi Pesan</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 resize-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">Gunakan <code className="bg-gray-100 px-1 rounded">{"{nama}"}</code> untuk nama pelanggan secara otomatis.</p>
              </div>

              {/* Channel */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Kirim Melalui</label>
                <div className="flex gap-3">
                  {[
                    { value: "whatsapp", label: "WhatsApp", Icon: MessageSquare },
                    { value: "email", label: "Email", Icon: Mail },
                  ].map(({ value, label, Icon }) => (
                    <label key={value}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all flex-1 ${channel === value ? "border-[#3ABDE8] bg-[#3ABDE8]/5" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" name="channel" value={value} checked={channel === value} onChange={() => setChannel(value)} className="sr-only" />
                      <Icon size={16} className={channel === value ? "text-[#3ABDE8]" : "text-gray-400"} />
                      <span className={`text-sm font-medium ${channel === value ? "text-[#3ABDE8]" : "text-gray-600"}`}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">Pilih Penerima</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} className="accent-[#3ABDE8] w-3.5 h-3.5" />
                    <span className="text-xs text-gray-500">Pilih Semua</span>
                  </label>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="max-h-52 overflow-y-auto divide-y divide-gray-50">
                    {customersData.map((c) => (
                      <label key={c.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(c.id)}
                          onChange={(e) => handleSelectCustomer(c.id, e.target.checked)}
                          className="accent-[#3ABDE8] w-3.5 h-3.5 flex-shrink-0"
                        />
                        <div className="w-7 h-7 rounded-lg bg-[#3ABDE8]/10 flex items-center justify-center text-[#3ABDE8] font-bold text-xs flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
                          <p className="text-xs text-gray-400">{channel === "whatsapp" ? c.phone : c.email}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {c.status === "active" ? "Aktif" : "Tidak Aktif"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {selectedCustomers.length > 0 && (
                  <p className="text-xs text-[#3ABDE8] font-medium mt-1.5">{selectedCustomers.length} pelanggan dipilih</p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending || selectedCustomers.length === 0}
                className="w-full py-3 bg-[#3ABDE8] text-white rounded-xl font-semibold text-sm hover:bg-[#2AADD8] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Kirim ke {selectedCustomers.length} Pelanggan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-bold text-gray-800 text-sm">Riwayat Pengiriman</p>
            </div>
            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {history.map((n) => (
                <div key={n.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{n.customer}</p>
                      <p className="text-xs text-gray-500">{n.template}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time} · {n.channel}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {n.status === "terkirim"
                        ? <CheckCircle size={14} className="text-green-500" />
                        : <XCircle size={14} className="text-red-500" />
                      }
                      <span className={`text-xs font-medium ${n.status === "terkirim" ? "text-green-600" : "text-red-500"}`}>
                        {n.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
