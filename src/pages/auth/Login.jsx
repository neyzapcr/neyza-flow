import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// Kredensial valid
const VALID_EMAIL    = "admin@netto.com";
const VALID_PASSWORD = "netto123";

export default function Login() {
  const navigate = useNavigate();

  /* ── state ── */
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [dataForm, setDataForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  /* ── handleChange ── */
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  /* ── handleSubmit ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!dataForm.email || !dataForm.password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    // Simulasi proses autentikasi
    setTimeout(() => {
      if (
        dataForm.email    === VALID_EMAIL &&
        dataForm.password === VALID_PASSWORD
      ) {
        // Simpan status login ke localStorage
        localStorage.setItem("netto_auth", "true");
        navigate("/dashboard");
      } else {
        setError("Email atau password salah. Silakan coba lagi.");
      }
      setLoading(false);
    }, 1000);
  };

  /* ── error & loading info ── */
  const errorInfo = error ? (
    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
      <span className="flex-shrink-0">⚠</span>
      {error}
    </div>
  ) : null;

  const loadingInfo = loading ? (
    <div className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-[#3ABDE8] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      Mohon Tunggu...
    </div>
  ) : null;

  return (
    <div className="font-lagusans">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Selamat Datang</h2>
      <p className="text-sm text-gray-400 mb-6">Masuk ke panel admin Netto Laundry CRM</p>

      {errorInfo}
      {loadingInfo}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={dataForm.email}
            onChange={handleChange}
            placeholder="admin@netto.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-[#3ABDE8]" />
            <span className="text-xs text-gray-500">Ingat saya</span>
          </label>
          <Link to="/forgot" className="text-xs text-[#3ABDE8] font-semibold hover:underline">
            Lupa password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#3ABDE8] text-white rounded-xl font-semibold text-sm hover:bg-[#2AADD8] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Login
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Belum punya akun?{" "}
        <Link to="/register" className="text-[#3ABDE8] font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
