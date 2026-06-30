import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getSettings } from "../../services/SettingsApi";
import { Ticket, Calendar, Check, Copy } from "lucide-react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Button from "../../components/Button";

const toast = (type, title, desc) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));

export default function MemberPromos() {
  const { customerProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [promos, setPromos] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    async function loadPromos() {
      if (!customerProfile) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const settings = await getSettings();
        const list = [];
        if (settings && settings.promoStatus) {
          list.push({
            promoId: "PROMO-SETTING",
            title: settings.promoTitle || "Promo Hemat",
            description: settings.promoDescription || "Potongan harga spesial untuk Anda.",
            discount: Number(settings.promoDiscount || 0),
            targetSegment: "Semua",
            startDate: settings.promoStartDate || new Date().toISOString().split("T")[0],
            endDate: settings.promoEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "Active"
          });
        }
        
        const segment = customerProfile.segment || "New";
        // Filter promos matching member segment
        const filtered = list.filter(
          (p) => p.targetSegment === "Semua" || p.targetSegment === segment
        );
        setPromos(filtered);
      } catch (err) {
        console.error("Error loading promotions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPromos();
  }, [customerProfile]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast("success", "Kode Disalin", `Kode promo ${code} berhasil disalin ke clipboard.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Promo Spesial Anda</h1>
        <p className="text-sm text-gray-500">Gunakan voucher & penawaran khusus untuk segmen pelanggan {customerProfile?.segment || "New"}</p>
      </div>

      {promos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white rounded-2xl p-6 border border-gray-150">
          {promos.map((p) => (
            <Card key={p.promoId} className="flex flex-col h-full hover:shadow-md transition-all relative overflow-hidden group">
              {/* Ticket cut-outs on sides */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-gray-50 border border-gray-105 z-10 -translate-y-1/2"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-gray-50 border border-gray-105 z-10 -translate-y-1/2"></div>

              <div className="flex-1 pb-4 bg-white">
                <div className="flex justify-between items-start mb-3 bg-white">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#2940D3]">
                    <Ticket size={20} />
                  </div>
                  <Badge variant={p.targetSegment === "Semua" ? "gray" : "purple"} className="uppercase font-bold text-[9px]">
                    {p.targetSegment === "Semua" ? "Semua Pelanggan" : `Khusus ${p.targetSegment}`}
                  </Badge>
                </div>

                <h3 className="font-bold text-gray-800 text-sm bg-white">{p.title}</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed bg-white">{p.description}</p>
                
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-medium bg-white">
                  <Calendar size={12} />
                  <span>Valid s/d: {p.endDate}</span>
                </div>
              </div>

              {/* Action area */}
              <div className="pt-4 border-t border-dashed border-gray-105 mt-4 flex items-center justify-between bg-white">
                <div className="bg-white">
                  <p className="text-[10px] text-gray-400">Potongan Diskon</p>
                  <p className="text-sm font-extrabold text-[#2940D3]">Rp {Number(p.discount).toLocaleString("id-ID")}</p>
                </div>

                <Button
                  variant={copiedCode === p.promoId ? "outline" : "primary"}
                  className="h-8 text-xs font-bold px-3"
                  icon={copiedCode === p.promoId ? <Check size={12} /> : <Copy size={12} />}
                  onClick={() => handleCopy(p.promoId)}
                >
                  {copiedCode === p.promoId ? "Disalin" : "Klaim"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 text-gray-400 border-dashed border-2 border-gray-200">
          <Ticket size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-xs font-semibold">Tidak ada promo aktif untuk saat ini.</p>
        </Card>
      )}
    </div>
  );
}
