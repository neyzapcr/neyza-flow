import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, KeyRound } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (queryError) throw queryError;
      if (!data) {
        throw new Error("Email tidak terdaftar dalam sistem.");
      }

      setSent(true);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message || "Gagal memproses permintaan reset password.");
    } finally {
      setLoading(false);
    }
  };

  const loadingInfo = loading ? (
    <div className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-[#2940D3] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      Mohon Tunggu...
    </div>
  ) : null;

  const errorInfo = error ? (
    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
      <span>⚠</span> {error}
    </div>
  ) : null;

  return (
    <div className="font-Montserrat min-h-screen flex flex-col justify-center items-center bg-white px-4">
      {sent ? (
        <div className="text-center w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
          <div className="w-16 h-16 bg-[#2CC5BD]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Terkirim!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Link reset password telah dikirim ke{" "}
            <span className="font-semibold text-gray-700">{email}</span>. Cek inbox Anda.
          </p>
          <Link
            to="/login"
            className="block w-full py-3 bg-[#2940D3] text-white rounded-xl font-semibold text-sm hover:bg-[#5A6FE4] transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
          <div className="w-14 h-14 bg-[#2940D3]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound size={26} className="text-[#2940D3]" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Forgot Your Password?</h2>
          <p className="text-sm text-gray-400 mb-6 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {errorInfo}
          {loadingInfo}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namaemail@gmail.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2940D3] focus:ring-2 focus:ring-[#2940D3]/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-[#2940D3] text-white rounded-xl font-semibold text-sm hover:bg-[#5A6FE4] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Ingat password?{" "}
            <Link to="/login" className="text-[#2940D3] font-semibold hover:underline">
              Kembali ke Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}