import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateCustomer } from "../../services/CustomerApi";
import { User, Phone, MapPin, Mail, ShieldAlert, Heart, Calendar } from "lucide-react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";

const toast = (type, title, desc) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));

export default function MemberProfile() {
  const { profile, customerProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    maritalStatus: "Belum Menikah",
  });

  useEffect(() => {
    if (customerProfile) {
      setForm({
        customerName: customerProfile.customerName || profile?.fullName || "",
        phone: customerProfile.phone || "",
        address: customerProfile.address || "",
        maritalStatus: customerProfile.maritalStatus || "Belum Menikah",
      });
    }
  }, [customerProfile, profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerProfile) return;

    setLoading(true);
    try {
      await updateCustomer(customerProfile.id, {
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        maritalStatus: form.maritalStatus,
        updatedAt: new Date().toISOString()
      });
      await refreshProfile();
      toast("success", "Profil Diperbarui", "Data profil Anda berhasil disimpan.");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast("error", "Gagal Memperbarui", err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Pelanggan</h1>
        <p className="text-sm text-gray-500">Kelola dan perbarui informasi detail data akun Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Account Info Cards */}
        <div className="space-y-6">
          {/* Card Badge Profile */}
          <Card className="text-center py-6">
            <div className="w-20 h-20 bg-indigo-50 text-[#2940D3] rounded-3xl flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-sm border border-indigo-100/50">
              {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : "M"}
            </div>
            <h3 className="font-bold text-gray-800 text-base">{profile?.fullName}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{customerProfile?.customerId}</p>
            <div className="mt-3 flex items-center justify-center bg-white">
              <Badge variant="blue" className="text-[10px] font-extrabold uppercase">
                {customerProfile?.segment || "New"} Member
              </Badge>
            </div>
          </Card>

          {/* Account Permissions Warning */}
          <Card className="bg-amber-50/50 border border-amber-100 text-xs">
            <div className="flex gap-2.5 text-amber-700 bg-transparent">
              <ShieldAlert size={20} className="shrink-0" />
              <div>
                <p className="font-bold">Keamanan Akun</p>
                <p className="mt-1 text-[11px] text-amber-600/80 leading-relaxed bg-transparent">
                  Member tidak diperkenankan mengubah email, jenis keanggotaan, total transaksi, total belanja, serta poin loyalty secara mandiri. Hubungi kasir Netto Express jika terdapat kekeliruan data.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Edit Form */}
        <Card className="md:col-span-2">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-6 text-sm bg-white">Detail Informasi</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
              {/* Nama Lengkap */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></span>
                  <Input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Alamat Email (Read Only)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"><Mail size={16} /></span>
                  <input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="w-full bg-gray-50 border border-gray-100 text-gray-400 rounded-xl px-4 py-3 pl-10 text-sm outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
              {/* Nomor Handphone */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nomor HP / WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={16} /></span>
                  <Input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>
              </div>

              {/* Status Pernikahan */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Status Pernikahan</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10"><Heart size={16} /></span>
                  <Select
                    name="maritalStatus"
                    value={form.maritalStatus}
                    onChange={(val) => handleSelectChange("maritalStatus", val)}
                    options={["Belum Menikah", "Menikah", "Janda / Duda"]}
                    className="pl-10 relative"
                  />
                </div>
              </div>
            </div>

            {/* Alamat Rumah */}
            <div className="bg-white">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Alamat Lengkap</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-gray-400"><MapPin size={16} /></span>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm outline-none focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all"
                  placeholder="Alamat lengkap tempat tinggal"
                  required
                />
              </div>
            </div>

            {/* Read-Only Stats */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl text-xs text-gray-500 border border-gray-100">
              <div className="flex items-center gap-2 bg-transparent">
                <Calendar size={16} className="text-[#2940D3]" />
                <div>
                  <p className="text-[10px] text-gray-400">Tanggal Bergabung</p>
                  <p className="font-bold text-gray-700">{customerProfile?.joinDate || "-"}</p>
                </div>
              </div>
              <div className="bg-transparent">
                <p className="text-[10px] text-gray-400">Tipe Pelanggan</p>
                <p className="font-bold text-gray-700">{customerProfile?.customerType || "Umum"}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 bg-white">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
