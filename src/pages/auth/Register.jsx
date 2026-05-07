import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({
    name: "", email: "", password: "", confirm: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!dataForm.name || !dataForm.email || !dataForm.password || !dataForm.confirm) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (dataForm.password !== dataForm.confirm) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (dataForm.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1200);
  };

  const errorInfo = error ? (
    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
      <span>⚠</span> {error}
    </div>
  ) : null;

  const loadingInfo = loading ? (
    <div className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-[#2940D3] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      Mohon Tunggu...
    </div>
  ) : null;

  return (
    <div className="font-Montserrat min-h-screen flex flex-col justify-center items-center bg-white px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Buat Akun Baru</h1>
        <p className="text-sm text-gray-400">Daftar untuk mengakses Netto Laundry CRM</p>
      </div>

      {/* Form container */}
        {/* Judul Form */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Register</h2>

        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama & Email */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={dataForm.name}
                onChange={handleChange}
                placeholder="Nama admin"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
              <input
                type="email"
                name="email"
                value={dataForm.email}
                onChange={handleChange}
                placeholder="admin@netto.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all"
              />
            </div>
          </div>

          {/* Password & Konfirmasi Password */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
              <input
                type="password"
                name="password"
                value={dataForm.password}
                onChange={handleChange}
                placeholder="Min. 6 karakter"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Konfirmasi Password</label>
              <input
                type="password"
                name="confirm"
                value={dataForm.confirm}
                onChange={handleChange}
                placeholder="Ulangi password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2940D3] text-white rounded-xl font-semibold text-sm hover:bg-[#5A6FE4] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Register
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-[#2940D3] font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
  );
}