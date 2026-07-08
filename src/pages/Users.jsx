import { useState, useEffect } from "react";
import { Users as UsersIcon, ShieldAlert, ShieldCheck, Search, Loader2, Plus, Pencil, Trash2, Check } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { usersAPI } from "../services/usersApi";
import { useAuth } from "../hooks/useAuth";
import SearchInput from "../components/SearchInput";
import Card from "../components/Card";
import Table from "../components/Table";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";

const toast = (type, title, desc) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc } }));

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // CRUD States
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [localForm, setLocalForm] = useState({ fullname: "", email: "", password: "", role: "member" });
  const [formError, setFormError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchUsersData = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.fetchUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast("error", "Error", "Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!localForm.fullname || !localForm.email || (!editUser && !localForm.password)) {
      setFormError("Field wajib diisi dengan benar.");
      return;
    }

    setSaveLoading(true);
    try {
      // Pengecekan email terdaftar untuk user baru, atau email terdaftar untuk user lain saat edit
      const emailExists = users.some(
        (u) => 
          u.email && 
          u.email.toLowerCase() === localForm.email.toLowerCase() && 
          (!editUser || u.id !== editUser.id)
      );

      if (emailExists) {
        setFormError("Email sudah terdaftar. Silakan gunakan email lain.");
        setSaveLoading(false);
        return;
      }

      if (editUser) {
        // Edit User
        const payload = {
          fullname: localForm.fullname,
          email: localForm.email,
          role: localForm.role,
        };
        // Hanya sertakan password jika diisi
        if (localForm.password) {
          payload.password = localForm.password;
        }

        await usersAPI.updateUser(editUser.id, payload);
        toast("success", "Pengguna Diperbarui", `Data ${localForm.fullname} berhasil disimpan.`);
      } else {
        // Create User
        const payload = {
          fullname: localForm.fullname,
          email: localForm.email,
          password: localForm.password,
          role: localForm.role,
        };

        await usersAPI.createUser(payload);
        toast("success", "Pengguna Ditambahkan", `Akun ${localForm.fullname} berhasil dibuat.`);
      }

      setShowModal(false);
      setEditUser(null);
      fetchUsersData();
    } catch (err) {
      console.error("Error saving user:", err);
      setFormError("Gagal menyimpan data pengguna. Silakan coba lagi.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setSaveLoading(true);
    try {
      await usersAPI.deleteUser(deleteConfirm.id);
      toast("warning", "Pengguna Dihapus", `Akun ${deleteConfirm.fullname} telah dihapus.`);
      setDeleteConfirm(null);
      fetchUsersData();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast("error", "Gagal Menghapus", "Terjadi kesalahan saat menghapus pengguna.");
    } finally {
      setSaveLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const nameMatch = u.fullname?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = u.email?.toLowerCase().includes(search.toLowerCase());
    return nameMatch || emailMatch;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const memberCount = users.filter((u) => u.role === "member").length;

  const stats = [
    {
      label: "Total Pengguna",
      value: totalUsers,
      Icon: UsersIcon,
      color: "bg-blue-50/70 border-blue-100",
      iconColor: "text-[#2940D3]"
    },
    {
      label: "Jumlah Admin",
      value: adminCount,
      Icon: ShieldAlert,
      color: "bg-red-50/70 border-red-100",
      iconColor: "text-red-500"
    },
    {
      label: "Jumlah Member",
      value: memberCount,
      Icon: ShieldCheck,
      color: "bg-green-50/70 border-green-100",
      iconColor: "text-green-500"
    }
  ];

  return (
    <div>
      <PageHeader title="Kelola Pengguna" subtitle="Daftar pengguna terdaftar di database Supabase">
        <Button 
          icon={<Plus size={15} />} 
          onClick={() => {
            setEditUser(null);
            setLocalForm({ fullname: "", email: "", password: "", role: "member" });
            setFormError("");
            setShowModal(true);
          }}
        >
          Tambah User
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border text-left flex items-center justify-between shadow-sm`}>
            <div>
              <p className="text-2xl font-bold text-gray-800">{loading ? "..." : s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${s.color.split(" ")[0]} border border-white/50`}>
              <s.Icon size={20} className={s.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter / Search Bar */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput 
            className="flex-1" 
            value={search} 
            onChange={setSearch} 
            placeholder="Cari nama atau email pengguna..." 
          />
        </div>
      </Card>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <Loader2 className="animate-spin text-[#2940D3]" size={32} />
            <p className="text-xs font-semibold">Mengambil data dari Supabase...</p>
          </div>
        ) : (
          <>
            <Table headers={["Nama Lengkap", "Alamat Email", "Hak Akses (Role)", "Tanggal Registrasi", "Aksi"]}>
              {filteredUsers.map((u) => {
                const dateStr = u.created_at 
                  ? new Date(u.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })
                  : "-";
                
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.fullname || "User"} size="md" shape="rounded" color="bg-[#2940D3]/10" className="text-[#2940D3]" />
                        <div>
                          <p className="font-semibold text-gray-800">{u.fullname || "-"}</p>
                          <p className="text-[10px] text-gray-400 font-mono">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-left font-medium text-gray-700">
                      {u.email || "-"}
                    </td>
                    <td className="px-5 py-4 text-left">
                      <Badge variant={u.role === "admin" ? "blue" : "green"}>
                        {u.role === "admin" ? "Admin" : "Member"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-left text-xs text-gray-500 font-medium">
                      {dateStr}
                    </td>
                    <td className="px-5 py-4 text-left">
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => { 
                            setEditUser(u); 
                            setLocalForm({ fullname: u.fullname || "", email: u.email || "", password: "", role: u.role || "member" }); 
                            setFormError("");
                            setShowModal(true); 
                          }} 
                          className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-100 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          disabled={u.id === user?.id}
                          onClick={() => setDeleteConfirm(u)} 
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </Table>
            {filteredUsers.length === 0 && (
              <EmptyState icon={<Search size={32} />} message="Tidak ada pengguna ditemukan" />
            )}
          </>
        )}
      </div>

      {/* ── Create/Edit Modal ── */}
      <Dialog open={showModal} onOpenChange={(openState) => { if (!openState) { setShowModal(false); setEditUser(null); } }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-Montserrat p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left">
            <DialogTitle className="text-base font-bold text-gray-800">
              {editUser ? "Ubah Data Pengguna" : "Tambah Pengguna Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-700">
            <form onSubmit={handleSave} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <span>⚠</span> {formError}
                </div>
              )}

              <div className="space-y-4">
                <Input 
                  label="Nama Lengkap"
                  name="fullname"
                  value={localForm.fullname}
                  onChange={(e) => setLocalForm({ ...localForm, fullname: e.target.value })}
                  placeholder="Nama lengkap pengguna"
                  required
                />
                
                <Input 
                  label="Alamat Email"
                  name="email"
                  type="email"
                  value={localForm.email}
                  onChange={(e) => setLocalForm({ ...localForm, email: e.target.value })}
                  placeholder="email@laundry.com"
                  required
                />

                <Input 
                  label={editUser ? "Password Baru (Kosongkan jika tidak ingin diubah)" : "Password"}
                  name="password"
                  type="password"
                  value={localForm.password}
                  onChange={(e) => setLocalForm({ ...localForm, password: e.target.value })}
                  placeholder={editUser ? "••••••••" : "Min. 6 karakter"}
                  required={!editUser}
                />

                <Select 
                  label="Hak Akses (Role)"
                  name="role"
                  value={localForm.role}
                  onChange={(e) => setLocalForm({ ...localForm, role: e.target.value })}
                  options={[
                    { value: "member", label: "Member" },
                    { value: "admin", label: "Admin" }
                  ]}
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowModal(false); setEditUser(null); }}>Batal</Button>
                <Button type="submit" variant="primary" disabled={saveLoading} className="flex-1">
                  {saveLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(openState) => { if (!openState) setDeleteConfirm(null); }}>
        <AlertDialogContent className="font-Montserrat max-w-sm rounded-2xl bg-white border-none shadow-2xl p-6">
          <AlertDialogHeader className="flex flex-col items-center text-center gap-0">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-3">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <AlertDialogTitle className="font-bold text-gray-800 mb-2 text-center w-full">Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 text-center w-full">
              Apakah Anda yakin ingin menghapus <strong>{deleteConfirm?.fullname}</strong>? Akun ini tidak akan dapat login lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 mt-4 w-full">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                Batal
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="danger" className="flex-1" disabled={saveLoading} onClick={handleDelete}>
                {saveLoading ? "Menghapus..." : "Hapus"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
