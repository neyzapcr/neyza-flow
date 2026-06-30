import { useState, useEffect } from "react";
import {
  Save, Store, Clock, Wallet, Gift, Tag,
  AlertCircle, CheckCircle, Loader2, Zap, RotateCcw,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import Tabs from "../components/Tabs";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import { getSettings, updateSettings } from "../services/SettingsApi";

// ── Toast (pakai window event, konsisten dengan halaman lain) ─────────────
const toast = (type, title, desc, duration = 4000) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc, duration } }));

// ── Nilai default — nama field HARUS sama persis dengan kolom Supabase ────
const DEFAULTS = {
  laundryName: "",
  phone: "",
  email: "",
  address: "",
  openTime: "07:00",
  closeTime: "21:00",
  washOnlyPrice: 7000,
  washIronPrice: 8000,
  ironOnlyPrice: 5000,
  expressPrice: 12000,
  pointPerTransaction: 10,
  minimumRedeemPoint: 100,
  promoTitle: "",
  promoDescription: "",
  promoDiscount: 0,
  promoStatus: false,
};

// ── Nilai bawaan yang tampil saat tombol "Default" ditekan ────────────────
const HARD_DEFAULTS = {
  laundryName: "Netto Express Laundry",
  phone: "082122448899",
  email: "support@nettoexpresslaundry.com",
  address: "Jl. Kuau No.2A, Kp. Melayu, Sukajadi, Kota Pekanbaru, Riau 28122",
  openTime: "07:00",
  closeTime: "21:00",
  washOnlyPrice: 7000,
  washIronPrice: 8000,
  ironOnlyPrice: 5000,
  expressPrice: 12000,
  pointPerTransaction: 10,
  minimumRedeemPoint: 100,
  promoTitle: "",
  promoDescription: "",
  promoDiscount: 0,
  promoStatus: false,
};

// ── PriceInput ─────────────────────────────────────────────────────────────
function PriceInput({ value, onChange, prefix = "Rp" }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#2940D3] focus-within:ring-2 focus-within:ring-[#2940D3]/20 transition-all">
      <span className="px-3 py-2.5 bg-gray-50 text-xs text-gray-500 border-r border-gray-200 font-medium">{prefix}</span>
      <input
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        min={0}
        className="flex-1 px-3 py-2.5 text-sm outline-none bg-white text-gray-800"
      />
    </div>
  );
}

// ── Toggle switch ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${checked ? "bg-[#2940D3]" : "bg-gray-200"}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-5" : "left-1"}`} />
    </button>
  );
}

// ── Validasi ───────────────────────────────────────────────────────────────
function validate(form) {
  const errors = {};
  if (!form.laundryName?.trim()) errors.laundryName = "Nama laundry wajib diisi.";
  if (!form.phone?.trim()) errors.phone = "Nomor WhatsApp wajib diisi.";
  if (!form.email?.trim()) errors.email = "Email wajib diisi.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Format email tidak valid.";
  if (!form.address?.trim()) errors.address = "Alamat wajib diisi.";
  if (!form.openTime) errors.openTime = "Jam buka wajib diisi.";
  if (!form.closeTime) errors.closeTime = "Jam tutup wajib diisi.";
  if (!(form.washOnlyPrice > 0)) errors.washOnlyPrice = "Harga harus lebih dari 0.";
  if (!(form.washIronPrice > 0)) errors.washIronPrice = "Harga harus lebih dari 0.";
  if (!(form.ironOnlyPrice > 0)) errors.ironOnlyPrice = "Harga harus lebih dari 0.";
  if (!(form.expressPrice > 0)) errors.expressPrice = "Harga harus lebih dari 0.";
  if (form.pointPerTransaction < 0) errors.pointPerTransaction = "Tidak boleh negatif.";
  if (form.minimumRedeemPoint < 0) errors.minimumRedeemPoint = "Tidak boleh negatif.";
  if (form.promoStatus) {
    if (!form.promoTitle?.trim()) errors.promoTitle = "Judul promo wajib diisi jika promo aktif.";
    if (form.promoDiscount <= 0 || form.promoDiscount > 100)
      errors.promoDiscount = "Diskon harus 1–100%.";
  }
  return errors;
}

// ── Halaman Settings ───────────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState("info");
  const [form, setForm] = useState(DEFAULTS);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load dari Supabase
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getSettings();
        if (data) setForm({ ...DEFAULTS, ...data });
      } catch (err) {
        toast("error", "Gagal Memuat Settings",
          `Tidak dapat mengambil data: ${err.message}`, 6000);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setNum = (field) => (val) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const setBool = (field) => (val) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleReset = () => {
    setForm((prev) => ({ ...prev, ...HARD_DEFAULTS }));
    setErrors({});
    toast("info", "Form Direset",
      "Data diisi dengan nilai default. Tekan Simpan untuk menyimpan.", 4000);
  };

  const handleSave = async () => {    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast("error", "Validasi Gagal",
        "Periksa kembali field yang belum terisi dengan benar.", 5000);
      return;
    }
    setErrors({});
    setSaving(true);

    // Hapus field metadata DB dari payload
    const { id, createdAt, updatedAt, ...payload } = form;

    try {
      const saved = await updateSettings(payload);
      setForm({ ...DEFAULTS, ...saved });
      toast("success", "Pengaturan Berhasil Disimpan",
        "Seluruh perubahan telah tersimpan ke database.", 4000);
    } catch (err) {
      toast("error", "Gagal Menyimpan",
        `Terjadi kesalahan: ${err.message}`, 6000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded-xl" />
        <div className="h-12 bg-gray-200 rounded-2xl" />
        <div className="h-80 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Pengaturan" subtitle="Kelola konfigurasi laundry, harga, loyalitas, dan promo">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            icon={<RotateCcw size={15} />}
            onClick={handleReset}
          >
            Default
          </Button>
          <Button
            icon={saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            loading={saving}
            onClick={handleSave}
          >
            {saving ? "Menyimpan..." : "Simpan Semua"}
          </Button>
        </div>
      </PageHeader>

      {/* Tab navigation */}
      <Tabs
        className="mb-6"
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: "info",      label: "Informasi Laundry", icon: <Store size={15} /> },
          { key: "schedule",  label: "Jam Operasional",   icon: <Clock size={15} /> },
          { key: "prices",    label: "Harga Layanan",     icon: <Wallet size={15} /> },
          { key: "loyalty",   label: "Program Loyalitas", icon: <Gift size={15} /> },
          { key: "promo",     label: "Promo",             icon: <Tag size={15} /> },
        ]}
      />

      {/* ── TAB: Informasi Laundry ── */}
      {activeTab === "info" && (
        <div className="space-y-4">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Laundry"
                required
                value={form.laundryName}
                onChange={set("laundryName")}
                placeholder="Contoh: Netto Express Laundry"
                error={errors.laundryName}
              />
              <Input
                label="Nomor WhatsApp"
                required
                value={form.phone}
                onChange={set("phone")}
                placeholder="Contoh: 08123456789"
                error={errors.phone}
              />
              <Input
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                placeholder="Contoh: laundry@email.com"
                error={errors.email}
              />
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Alamat Lengkap <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.address ?? ""}
                  onChange={set("address")}
                  rows={3}
                  placeholder="Jl. Contoh No. 123, Kota..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none
                    focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all
                    bg-white resize-none"
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Jam Operasional ── */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Jam Buka"
                type="time"
                required
                value={form.openTime}
                onChange={set("openTime")}
                error={errors.openTime}
              />
              <Input
                label="Jam Tutup"
                type="time"
                required
                value={form.closeTime}
                onChange={set("closeTime")}
                error={errors.closeTime}
              />
            </div>
            {form.openTime && form.closeTime && (
              <div className="mt-4 bg-[#2940D3]/5 border border-[#2940D3]/20 rounded-xl px-4 py-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-[#2940D3] flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Laundry buka pukul{" "}
                  <span className="font-semibold text-[#2940D3]">{form.openTime}</span>
                  {" "}—{" "}
                  <span className="font-semibold text-[#2940D3]">{form.closeTime}</span>
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── TAB: Harga Layanan ── */}
      {activeTab === "prices" && (
        <div className="space-y-4">
          <div className="bg-[#2940D3]/5 border border-[#2940D3]/20 rounded-2xl px-5 py-3 flex items-start gap-3">
            <Zap size={16} className="text-[#2940D3] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              Semua harga dalam satuan{" "}
              <span className="font-semibold text-[#2940D3]">Rupiah per kilogram (Rp/kg)</span>.
            </p>
          </div>

          <Card padding={false} className="overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <div className="col-span-6">Jenis Layanan</div>
              <div className="col-span-6">Harga / kg</div>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { field: "washOnlyPrice",  label: "Cuci",             error: errors.washOnlyPrice },
                { field: "washIronPrice",  label: "Cuci + Setrika",   error: errors.washIronPrice },
                { field: "ironOnlyPrice",  label: "Setrika",          error: errors.ironOnlyPrice },
                { field: "expressPrice",   label: "Express",          error: errors.expressPrice },
              ].map((row) => (
                <div key={row.field} className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
                  <div className="col-span-6">
                    <p className="text-sm font-medium text-gray-700">{row.label}</p>
                    {row.error && <p className="text-xs text-red-500 mt-0.5">{row.error}</p>}
                  </div>
                  <div className="col-span-6">
                    <PriceInput
                      value={form[row.field]}
                      onChange={setNum(row.field)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Preview harga 3 kg */}
          <Card>
            <p className="font-bold text-gray-800 mb-3 text-sm">Preview Harga (contoh 3 kg)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Cuci",           price: form.washOnlyPrice },
                { label: "Cuci + Setrika", price: form.washIronPrice },
                { label: "Setrika",        price: form.ironOnlyPrice },
                { label: "Express",        price: form.expressPrice },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className="text-base font-bold text-gray-800">
                    Rp {((s.price || 0) * 3).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Program Loyalitas ── */}
      {activeTab === "loyalty" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#2940D3]/10 flex items-center justify-center">
                  <Gift size={16} className="text-[#2940D3]" />
                </div>
                <p className="font-bold text-gray-800">Pengaturan Poin</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Poin per Transaksi
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden
                    focus-within:border-[#2940D3] focus-within:ring-2 focus-within:ring-[#2940D3]/20 transition-all">
                    <input
                      type="number"
                      value={form.pointPerTransaction ?? 0}
                      onChange={(e) => setNum("pointPerTransaction")(Number(e.target.value))}
                      min={0}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-white text-gray-800"
                    />
                    <span className="px-3 py-2.5 bg-gray-50 text-xs text-gray-500 border-l border-gray-200 font-medium">
                      poin
                    </span>
                  </div>
                  {errors.pointPerTransaction && (
                    <p className="text-xs text-red-500 mt-1">{errors.pointPerTransaction}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Minimum Redeem Point
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden
                    focus-within:border-[#2940D3] focus-within:ring-2 focus-within:ring-[#2940D3]/20 transition-all">
                    <input
                      type="number"
                      value={form.minimumRedeemPoint ?? 0}
                      onChange={(e) => setNum("minimumRedeemPoint")(Number(e.target.value))}
                      min={0}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-white text-gray-800"
                    />
                    <span className="px-3 py-2.5 bg-gray-50 text-xs text-gray-500 border-l border-gray-200 font-medium">
                      poin
                    </span>
                  </div>
                  {errors.minimumRedeemPoint && (
                    <p className="text-xs text-red-500 mt-1">{errors.minimumRedeemPoint}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Simulasi sederhana */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#142297]/10 flex items-center justify-center">
                  <Zap size={16} className="text-[#142297]" />
                </div>
                <p className="font-bold text-gray-800">Simulasi Poin</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Transaksi 1x", tx: 1 },
                  { label: "Transaksi 5x", tx: 5 },
                  { label: "Transaksi 10x", tx: 10 },
                ].map((sim) => (
                  <div key={sim.label} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-600">{sim.label}</span>
                    <span className="font-bold text-gray-800">
                      {(form.pointPerTransaction || 0) * sim.tx} poin
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-[#2940D3]/5 border border-[#2940D3]/20 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-600">Bisa redeem mulai</span>
                  <span className="font-bold text-[#2940D3]">
                    {form.minimumRedeemPoint || 0} poin
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: Promo ── */}
      {activeTab === "promo" && (
        <div className="space-y-4">
          <Card>
            {/* Toggle aktif/non-aktif */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-800">Status Promo</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {form.promoStatus ? "Promo sedang aktif dan terlihat oleh pelanggan" : "Promo tidak aktif"}
                </p>
              </div>
              <Toggle
                checked={!!form.promoStatus}
                onChange={setBool("promoStatus")}
              />
            </div>

            <div className={`space-y-4 transition-opacity ${form.promoStatus ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Judul Promo"
                  required={!!form.promoStatus}
                  value={form.promoTitle}
                  onChange={set("promoTitle")}
                  placeholder="Contoh: Promo Lebaran"
                  error={errors.promoTitle}
                />
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Besar Diskon <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden
                    focus-within:border-[#2940D3] focus-within:ring-2 focus-within:ring-[#2940D3]/20 transition-all">
                    <input
                      type="number"
                      value={form.promoDiscount ?? 0}
                      onChange={(e) => setNum("promoDiscount")(Number(e.target.value))}
                      min={0}
                      max={100}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-white text-gray-800"
                    />
                    <span className="px-3 py-2.5 bg-gray-50 text-xs text-gray-500 border-l border-gray-200 font-medium">
                      %
                    </span>
                  </div>
                  {errors.promoDiscount && (
                    <p className="text-xs text-red-500 mt-1">{errors.promoDiscount}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Deskripsi Promo
                </label>
                <textarea
                  value={form.promoDescription ?? ""}
                  onChange={set("promoDescription")}
                  rows={3}
                  placeholder="Tuliskan detail promo di sini..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none
                    focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all
                    bg-white resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Preview banner promo */}
          {form.promoStatus && form.promoTitle && (
            <Card>
              <p className="font-bold text-gray-800 mb-3 text-sm">Preview Banner Promo</p>
              <div className="bg-gradient-to-r from-[#2940D3] to-[#142297] rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium opacity-70 mb-1">Promo Aktif</p>
                    <p className="text-lg font-bold">{form.promoTitle}</p>
                    {form.promoDescription && (
                      <p className="text-sm opacity-80 mt-1">{form.promoDescription}</p>
                    )}
                  </div>
                  {form.promoDiscount > 0 && (
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-3xl font-extrabold">{form.promoDiscount}%</p>
                      <p className="text-xs opacity-70">DISKON</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
