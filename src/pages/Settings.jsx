import { useState } from "react";
import { Save, Plus, Trash2, RotateCcw, Settings2, Tag, Gift, Zap } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Tabs from "../components/Tabs";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";

// ── Default settings ──────────────────────────────────────────────────────
const DEFAULT_SERVICES = [
  { id: 1, name: "Cuci + Setrika", regularPrice: 8000, expressPrice: 14000, active: true },
  { id: 2, name: "Cuci Kering", regularPrice: 7000, expressPrice: 12000, active: true },
  { id: 3, name: "Cuci + Setrika + Parfum", regularPrice: 12000, expressPrice: 18000, active: true },
  { id: 4, name: "Setrika Saja", regularPrice: 5000, expressPrice: 9000, active: false },
];

const DEFAULT_DISCOUNTS = [
  { id: 1, name: "Diskon Member VIP", type: "persen", value: 15, minTransaction: 50000, active: true },
  { id: 2, name: "Diskon Pelanggan Loyal", type: "persen", value: 10, minTransaction: 30000, active: true },
  { id: 3, name: "Promo Akhir Bulan", type: "persen", value: 20, minTransaction: 100000, active: false },
  { id: 4, name: "Diskon Nominal", type: "nominal", value: 5000, minTransaction: 25000, active: true },
];

const DEFAULT_POINTS = {
  pointsPerRp: 2000,
  redeemRate: 100,
  redeemValue: 5000,
  bonusVIP: 2,
  bonusLoyal: 1.5,
  expressBonus: 1.5,
};

// ── Komponen input harga ──────────────────────────────────────────────────
function PriceInput({ value, onChange, prefix = "Rp" }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#2940D3] focus-within:ring-2 focus-within:ring-[#2940D3]/20 transition-all">
      <span className="px-3 py-2.5 bg-gray-50 text-xs text-gray-500 border-r border-gray-200 font-medium">{prefix}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={0}
        className="flex-1 px-3 py-2.5 text-sm outline-none bg-white text-gray-800"
      />
    </div>
  );
}

// ── Toast notifikasi ──────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#142297] text-white px-5 py-3 rounded-2xl shadow-xl animate-bounce-once">
      <Save size={16} />
      <span className="text-sm font-semibold">{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [discounts, setDiscounts] = useState(DEFAULT_DISCOUNTS);
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Service handlers ──
  const updateService = (id, field, val) =>
    setServices(services.map((s) => (s.id === id ? { ...s, [field]: val } : s)));

  const addService = () =>
    setServices([...services, { id: Date.now(), name: "Layanan Baru", regularPrice: 0, expressPrice: 0, active: true }]);

  const deleteService = (id) => setServices(services.filter((s) => s.id !== id));

  // ── Discount handlers ──
  const updateDiscount = (id, field, val) =>
    setDiscounts(discounts.map((d) => (d.id === id ? { ...d, [field]: val } : d)));

  const addDiscount = () =>
    setDiscounts([...discounts, { id: Date.now(), name: "Diskon Baru", type: "persen", value: 0, minTransaction: 0, active: true }]);

  const deleteDiscount = (id) => setDiscounts(discounts.filter((d) => d.id !== id));

  return (
    <div>
      <PageHeader title="Pengaturan" subtitle="Kelola harga layanan, diskon, dan program poin">
        <Button
          icon={<Save size={15} />}
          onClick={() => showToast("Pengaturan berhasil disimpan!")}
        >
          Simpan Semua
        </Button>
      </PageHeader>

      {/* Tab navigation */}
      <Tabs
        className="mb-6"
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: "services", label: "Harga Layanan", icon: <Settings2 size={15} /> },
          { key: "discounts", label: "Diskon & Promo", icon: <Tag size={15} /> },
          { key: "points", label: "Program Poin", icon: <Gift size={15} /> },
        ]}
      />

      {/* ── TAB: Harga Layanan ── */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <div className="bg-[#2940D3]/5 border border-[#2940D3]/20 rounded-2xl px-5 py-3 flex items-start gap-3">
            <Zap size={16} className="text-[#2940D3] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              Harga <span className="font-semibold text-[#2940D3]">Regular</span> untuk pengerjaan normal (2–3 hari).
              Harga <span className="font-semibold text-[#142297]">Express</span> untuk pengerjaan cepat (same day / next day).
            </p>
          </div>

          <Card padding={false} className="overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <div className="col-span-4">Nama Layanan</div>
              <div className="col-span-3">Harga Regular / kg</div>
              <div className="col-span-3">Harga Express / kg</div>
              <div className="col-span-1 text-center">Aktif</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-gray-50">
              {services.map((svc) => (
                <div key={svc.id} className={`grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors ${!svc.active ? "opacity-50" : ""}`}>
                  <div className="col-span-4">

                    <Input value={svc.name} onChange={(e) => updateService(svc.id, "name", e.target.value)} />
                  
                  </div>
                  <div className="col-span-3">
                    <PriceInput value={svc.regularPrice} onChange={(v) => updateService(svc.id, "regularPrice", v)} />
                  </div>
                  <div className="col-span-3">
                    <PriceInput value={svc.expressPrice} onChange={(v) => updateService(svc.id, "expressPrice", v)} />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => updateService(svc.id, "active", !svc.active)}
                      className={`w-10 h-6 rounded-full transition-all relative ${svc.active ? "bg-[#2940D3]" : "bg-gray-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${svc.active ? "left-5" : "left-1"}`} />
                    </button>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => deleteService(svc.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100">
              <Button variant="outline" size="sm" icon={<Plus size={14}/>} onClick={addService}>Tambah Layanan</Button>
            </div>
          </Card>

          <Card>
            <p className="font-bold text-gray-800 mb-3 text-sm">Preview Harga (contoh 3 kg)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.filter((s) => s.active).map((s) => (
                <div key={s.id} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">{s.name}</p>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-[#2940D3]/10 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-[#2940D3] font-medium">Regular</p>
                      <p className="text-sm font-bold text-gray-800">Rp {(s.regularPrice * 3).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex-1 bg-[#142297]/10 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-[#142297] font-medium">Express</p>
                      <p className="text-sm font-bold text-gray-800">Rp {(s.expressPrice * 3).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Diskon & Promo ── */}
      {activeTab === "discounts" && (
        <div className="space-y-4">
          <Card padding={false} className="overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <div className="col-span-3">Nama Diskon</div>
              <div className="col-span-2">Tipe</div>
              <div className="col-span-2">Nilai</div>
              <div className="col-span-3">Min. Transaksi</div>
              <div className="col-span-2 text-center">Aksi</div>
            </div>

            <div className="divide-y divide-gray-50">
              {discounts.map((d) => (
                <div key={d.id} className={`grid grid-cols-12 gap-3 px-5 py-4 items-center ${!d.active ? "opacity-50" : ""}`}>
                  <div className="col-span-3"><Input value={d.name} onChange={(e) => updateDiscount(d.id, "name", e.target.value)} /></div>
                  <div className="col-span-2"><Select value={d.type} onChange={(e) => updateDiscount(d.id, "type", e.target.value)} options={[{label: "Persen (%)", value: "persen"}, {label: "Nominal (Rp)", value: "nominal"}]} /></div>
                  <div className="col-span-2"><Input type="number" value={d.value} onChange={(e) => updateDiscount(d.id, "value", Number(e.target.value))} /></div>
                  <div className="col-span-3"><PriceInput value={d.minTransaction} onChange={(v) => updateDiscount(d.id, "minTransaction", v)} /></div>
                  <div className="col-span-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateDiscount(d.id, "active", !d.active)}
                      className={`w-10 h-6 rounded-full transition-all relative ${d.active ? "bg-[#2940D3]" : "bg-gray-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${d.active ? "left-5" : "left-1"}`} />
                    </button>
                    <button onClick={() => deleteDiscount(d.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-gray-100">
              <Button variant="outline" size="sm" icon={<Plus size={14}/>} onClick={addDiscount}>Tambah Diskon</Button>
            </div>
          </Card>

          <Card>
            <p className="font-bold text-gray-800 mb-3 text-sm">Diskon Aktif</p>
            <div className="flex flex-wrap gap-2">
              {discounts.filter((d) => d.active).map((d) => (
                <div key={d.id} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <Tag size={12} className="text-green-600" />
                  <span className="text-xs font-semibold text-green-700">{d.name}</span>
                  <span className="text-xs text-green-600">
                    {d.type === "persen" ? `${d.value}%` : `Rp ${d.value.toLocaleString("id-ID")}`}
                  </span>
                </div>
              ))}
              {discounts.filter((d) => d.active).length === 0 && (
                <p className="text-sm text-gray-400">Tidak ada diskon aktif</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Program Poin ── */}
      {activeTab === "points" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#2940D3]/10 flex items-center justify-center">
                  <Gift size={16} className="text-[#2940D3]" />
                </div>
                <p className="font-bold text-gray-800">Aturan Dasar Poin</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">1 Poin per Rp</label>
                  <PriceInput value={points.pointsPerRp} onChange={(v) => setPoints({ ...points, pointsPerRp: v })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Poin tukar</label>
                    <Input type="number" value={points.redeemRate} onChange={(e) => setPoints({ ...points, redeemRate: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nilai tukar</label>
                    <PriceInput value={points.redeemValue} onChange={(v) => setPoints({ ...points, redeemValue: v })} />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#142297]/10 flex items-center justify-center">
                  <Zap size={16} className="text-[#142297]" />
                </div>
                <p className="font-bold text-gray-800">Bonus Multiplier Poin</p>
              </div>
              <div className="space-y-4">
                {[{ key: "bonusVIP", label: "VIP" }, { key: "bonusLoyal", label: "Loyal" }, { key: "expressBonus", label: "Express" }].map((item) => (
                  <div key={item.key}>
                    <label className="text-xs font-semibold">{item.label}</label>
                    <Input type="number" value={points[item.key]} onChange={(e) => setPoints({ ...points, [item.key]: Number(e.target.value) })} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <p className="font-bold mb-3 text-sm">Simulasi Poin (transaksi Rp 50.000)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[ {l: "Biasa", v: 1}, {l: "Loyal", v: points.bonusLoyal}, {l: "VIP", v: points.bonusVIP}, {l: "Express", v: points.expressBonus} ].map((sim) => (
                <div key={sim.l} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{sim.l}</p>
                  <p className="text-xl font-bold">{Math.round(25 * sim.v)}</p>
                  <p className="text-xs text-gray-400">poin</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setPoints(DEFAULT_POINTS)} icon={<RotateCcw size={14}/>}>Reset ke Default</Button>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </div>
  );
}