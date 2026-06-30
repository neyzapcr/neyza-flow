import { useState, useEffect } from "react";
import { Send, CheckCircle, XCircle, Bell, ToggleLeft, ToggleRight, MessageSquare, Mail } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DynamicForm from "../components/DynamicForm";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Card from "../components/Card";
import { getCustomers } from "../services/CustomerApi";
import { getNotifications, createNotification } from "../services/NotificationApi";

const TEMPLATES = [
  { id: "cucian-selesai", name: "Cucian Selesai", category: "status", description: "Dikirim otomatis saat status laundry berubah menjadi selesai", trigger: "Otomatis — Status Selesai", defaultMessage: "Halo {nama}, cucian Anda sudah selesai dan siap diambil di Netto Laundry. Terima kasih telah mempercayakan cucian Anda kepada kami.", active: true },
  { id: "reminder-ambil", name: "Pengingat Pengambilan", category: "reminder", description: "Dikirim otomatis 2 hari setelah cucian selesai jika belum diambil", trigger: "Otomatis — 2 hari setelah selesai", defaultMessage: "Halo {nama}, cucian Anda sudah selesai sejak 2 hari lalu dan belum diambil. Segera ambil cucian Anda di Netto Laundry sebelum dikenakan biaya penyimpanan.", active: true },
  { id: "pelanggan-tidak-aktif", name: "Reminder Pelanggan Tidak Aktif", category: "retensi", description: "Dikirim ke pelanggan yang tidak bertransaksi lebih dari 30 hari", trigger: "Otomatis — 30 hari tidak aktif", defaultMessage: "Halo {nama}, kami kangen dengan Anda! Sudah lama tidak bertransaksi di Netto Laundry. Kunjungi kami kembali dan dapatkan diskon 10% untuk transaksi berikutnya.", active: false },
  { id: "promo-spesial", name: "Promo Spesial", category: "promosi", description: "Dikirim manual untuk menyebarkan informasi promo", trigger: "Manual", defaultMessage: "Halo {nama}, ada promo spesial dari Netto Laundry! Dapatkan diskon 20% untuk semua layanan cuci setrika. Promo berlaku hingga akhir bulan ini. Jangan sampai terlewat!", active: true }
];

const categoryVariant = { status: "blue", reminder: "yellow", retensi: "red", promosi: "green" };

export default function Notifications() {
  const [customers, setCustomers] = useState([]);
  const [templates, setTemplates] = useState(TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [localMessageState, setLocalMessageState] = useState({ msg: TEMPLATES[0].defaultMessage });
  const [channel, setChannel] = useState("whatsapp");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const custData = await getCustomers();
      setCustomers(custData || []);

      const notifData = await getNotifications();
      const mappedNotif = (notifData || []).map(n => ({
        id: n.id,
        customer: n.customers?.customerName || "Member",
        template: n.title,
        time: new Date(n.createdAt).toLocaleString("id-ID"),
        channel: "WhatsApp",
        status: "terkirim"
      }));
      setHistory(mappedNotif);
    } catch (err) {
      console.error("Failed to load notifications page data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    setLocalMessageState({ msg: tmpl.defaultMessage });
    setSent(false);
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setSelectedCustomers(checked ? customers.map(c => c.id) : []);
  };

  const handleSelectCustomer = (id, checked) => {
    const next = checked ? [...selectedCustomers, id] : selectedCustomers.filter(x => x !== id);
    setSelectedCustomers(next);
    setSelectAll(next.length === customers.length);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedCustomers.length) return;
    try {
      setSending(true);
      setSent(false);

      for (const custId of selectedCustomers) {
        const targetCust = customers.find(c => c.id === custId);
        if (!targetCust) continue;

        const computedMessage = localMessageState.msg.replace(/{nama}/g, targetCust.customerName);
        
        await createNotification({
          customerId: custId,
          title: selectedTemplate.name,
          message: computedMessage
        });
      }

      setSent(true);
      setSelectedCustomers([]);
      setSelectAll(false);
      
      // Reload notifications log
      const notifData = await getNotifications();
      const mappedNotif = (notifData || []).map(n => ({
        id: n.id,
        customer: n.customers?.customerName || "Member",
        template: n.title,
        time: new Date(n.createdAt).toLocaleString("id-ID"),
        channel: channel === "whatsapp" ? "WhatsApp" : "Email",
        status: "terkirim"
      }));
      setHistory(mappedNotif);
    } catch (err) {
      console.error("Failed to send notifications:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-20 bg-gray-200 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Notifikasi" subtitle="Kelola template dan kirim notifikasi ke pelanggan" />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-left">
        {[
          { label: "Template Aktif", value: templates.filter(t => t.active).length, Icon: Bell, color: "bg-blue-50 text-[#2940D3]" },
          { label: "Terkirim Hari Ini", value: history.filter(h => h.status === "terkirim").length, Icon: CheckCircle, color: "bg-green-50 text-green-500" },
          { label: "Gagal Terkirim", value: history.filter(h => h.status === "gagal").length, Icon: XCircle, color: "bg-red-50 text-red-500" },
          { label: "Total Riwayat", value: history.length, Icon: MessageSquare, color: "bg-yellow-50 text-yellow-500" }
        ].map(s => (
          <div key={s.label} className={`${s.color.split(" ")[0]} rounded-2xl p-4 border border-white bg-white text-left`}>
            <s.Icon size={20} className={`${s.color.split(" ")[1]} mb-2`} />
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
        {/* Left: Template List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left bg-white">
          <div className="px-5 py-4 border-b border-gray-100 bg-white">
            <p className="font-bold text-gray-800 text-sm">Template Notifikasi</p>
            <p className="text-xs text-gray-400 mt-0.5">Pilih template untuk dikirim</p>
          </div>
          <div className="divide-y divide-gray-50">
            {templates.map((t) => (
              <div key={t.id} onClick={() => handleSelectTemplate(t)} className={`px-5 py-4 cursor-pointer transition-all ${selectedTemplate.id === t.id ? "bg-[#2940D3]/5 border-l-2 border-[#2940D3]" : "hover:bg-gray-50 border-l-2 border-transparent"}`}>
                <div className="flex items-start justify-between gap-2 mb-1.5 bg-white">
                  <div className="flex-1 bg-white">
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <Badge variant={categoryVariant[t.category] || "gray"} className="mt-1">{t.category}</Badge>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setTemplates(templates.map(tmpl => tmpl.id === t.id ? { ...tmpl, active: !tmpl.active } : tmpl)); }} className="flex-shrink-0 mt-0.5 bg-white">
                    {t.active ? <ToggleRight size={22} className="text-[#2940D3]" /> : <ToggleLeft size={22} className="text-gray-300" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{t.description}</p>
                <p className="text-xs text-[#2940D3] mt-1 font-medium">{t.trigger}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle + Right: Send Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="text-left">
            <p className="font-bold text-gray-800 mb-1">Kirim Notifikasi</p>
            <p className="text-xs text-gray-400 mb-4 bg-white">Template: <span className="font-semibold text-gray-600">{selectedTemplate.name}</span></p>

            {sent && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
                <CheckCircle size={16} /> Notifikasi berhasil dikirim ke pelanggan.
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4">
              <DynamicForm
                fields={[
                  { name: "msg", label: "Isi Pesan", type: "textarea", placeholder: "Isi pesan notifikasi...", rows: 4, hint: "Gunakan {nama} untuk nama pelanggan otomatis." }
                ]}
                initialData={localMessageState}
                onChange={setLocalMessageState}
                customRender={() => (
                  <div className="space-y-4 mt-4 bg-white">
                    {/* Channel Selector */}
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-2 block bg-white">Kirim Melalui</label>
                      <div className="flex gap-3">
                        {[{ value: "whatsapp", label: "WhatsApp", Icon: MessageSquare }, { value: "email", label: "Email", Icon: Mail }].map(ch => (
                          <label key={ch.value} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all flex-1 ${channel === ch.value ? "border-[#2940D3] bg-[#2940D3]/5" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                            <input type="radio" name="channel" checked={channel === ch.value} onChange={() => setChannel(ch.value)} className="sr-only" />
                            <ch.Icon size={16} className={channel === ch.value ? "text-[#2940D3]" : "text-gray-400"} />
                            <span className={`text-sm font-medium ${channel === ch.value ? "text-[#2940D3]" : "text-gray-600"}`}>{ch.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Recipients Checkbox List */}
                    <div>
                      <div className="flex items-center justify-between mb-2 bg-white">
                        <label className="text-xs font-semibold text-gray-600">Pilih Penerima</label>
                        <label className="flex items-center gap-2 cursor-pointer bg-white">
                          <input type="checkbox" checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} className="accent-[#2940D3] w-3.5 h-3.5" />
                          <span className="text-xs text-gray-500">Pilih Semua</span>
                        </label>
                      </div>
                      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <div className="max-h-52 overflow-y-auto divide-y divide-gray-50">
                          {customers.map((c) => (
                            <label key={c.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                              <input type="checkbox" checked={selectedCustomers.includes(c.id)} onChange={(e) => handleSelectCustomer(c.id, e.target.checked)} className="accent-[#2940D3] w-3.5 h-3.5 flex-shrink-0" />
                              <div className="w-7 h-7 rounded-lg bg-[#2940D3]/10 flex items-center justify-center text-[#2940D3] font-bold text-xs flex-shrink-0">{c.customerName.charAt(0)}</div>
                              <div className="flex-1 min-w-0 bg-white">
                                <p className="text-sm font-medium text-gray-800 truncate">{c.customerName}</p>
                                <p className="text-xs text-gray-400">{channel === "whatsapp" ? c.phone : c.email}</p>
                              </div>
                              <Badge variant={c.status === "active" ? "green" : "gray"}>{c.status === "active" ? "Aktif" : "Tidak Aktif"}</Badge>
                            </label>
                          ))}
                        </div>
                      </div>
                      {selectedCustomers.length > 0 && <p className="text-xs text-[#2940D3] font-medium mt-1.5 bg-white">{selectedCustomers.length} pelanggan dipilih</p>}
                    </div>
                  </div>
                )}
              />

              <Button type="submit" disabled={sending || selectedCustomers.length === 0} loading={sending} icon={!sending ? <Send size={15} /> : undefined} className="w-full py-3">
                {sending ? "Mengirim..." : `Kirim ke ${selectedCustomers.length} Pelanggan`}
              </Button>
            </form>
          </Card>

          {/* History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left bg-white">
            <div className="px-5 py-4 border-b border-gray-100 bg-white"><p className="font-bold text-gray-800 text-sm">Riwayat Pengiriman</p></div>
            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {history.map((n) => (
                <div key={n.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between bg-white">
                    <div className="bg-white">
                      <p className="font-semibold text-gray-800 text-sm">{n.customer}</p>
                      <p className="text-xs text-gray-500">{n.template}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time} · {n.channel}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white">
                      {n.status === "terkirim" ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                      <span className={`text-xs font-medium ${n.status === "terkirim" ? "text-green-600" : "text-red-500"}`}>{n.status}</span>
                    </div>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="py-8 text-center text-gray-400">
                  <Bell size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Belum ada riwayat pengiriman.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}