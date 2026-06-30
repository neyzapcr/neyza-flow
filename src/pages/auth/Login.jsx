import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, role } = useAuth();

  /* ── state ── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  /* ── redirect setelah role tersedia ── */
  useEffect(() => {
    if (role) {
      if (role === "Member") {
        navigate("/member/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [role, navigate]);

  /* ── handleChange ── */
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  /* ── handleSubmit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!dataForm.email || !dataForm.password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      await signIn(dataForm.email, dataForm.password);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Email atau password salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const errorInfo = error ? (
    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
      <span className="flex-shrink-0">⚠</span>
      {error}
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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Selamat Datang</h1>
        <p className="text-sm text-gray-400">Masuk ke panel Netto Laundry CRM</p>
      </div>

      {/* Form container */}
      <div className="w-full max-w-2xl">
        {/* Judul Form */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>

        {errorInfo}
        {loadingInfo}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Email */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={dataForm.email}
                onChange={handleChange}
                placeholder="namaemail@gmail.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex-1 relative">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={dataForm.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all pr-12"
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

          {/* Ingat saya dan lupa password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#2940D3]" />
              <span className="text-xs text-gray-500">Ingat saya</span>
            </label>
            <Link
              to="/forgot"
              className="text-xs text-[#2940D3] font-semibold hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2940D3] text-white rounded-xl font-semibold text-sm hover:bg-[#5A6FE4] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-[#2940D3] font-semibold hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}