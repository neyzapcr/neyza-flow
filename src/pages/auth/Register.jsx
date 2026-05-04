import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
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

    if (!dataForm.name || !dataForm.email || !dataForm.password) {
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
      <div className="w-4 h-4 border-2 border-[#3ABDE8] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      Mohon Tunggu...
    </div>
  ) : null;

  return (
    <div className="font-lagusans">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Buat Akun Baru</h2>
      <p className="text-sm text-gray-400 mb-6">Daftar untuk mengakses Netto Laundry CRM</p>

      {errorInfo}
      {loadingInfo}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Nama Lengkap",         name: "name",     type: "text",     placeholder: "Nama admin" },
          { label: "Email Address",         name: "email",    type: "email",    placeholder: "admin@netto.com" },
          { label: "Password",              name: "password", type: "password", placeholder: "Min. 6 karakter" },
          { label: "Konfirmasi Password",   name: "confirm",  type: "password", placeholder: "Ulangi password" },
        ].map((f) => (
          <div key={f.name}>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              value={dataForm[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#3ABDE8] text-white rounded-xl font-semibold text-sm hover:bg-[#2AADD8] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Register
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-[#3ABDE8] font-semibold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
