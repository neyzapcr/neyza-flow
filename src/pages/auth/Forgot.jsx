import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, KeyRound } from "lucide-react";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  const loadingInfo = loading ? (
    <div className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-[#3ABDE8] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      Mohon Tunggu...
    </div>
  ) : null;

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-green-500" />
        </div>
        <h2 className="font-lagusans text-xl font-bold text-gray-800 mb-2"> Email Terkirim! </h2>
        <p className="text-sm text-gray-500 mb-6">
          Link reset password telah dikirim ke{" "}
          <span className="font-semibold text-gray-700">{email}</span>. Cek inbox Anda.
        </p>
        <Link
          to="/login"
          className="block w-full py-3 bg-[#3ABDE8] text-white rounded-xl font-semibold text-sm hover:bg-[#2AADD8] transition-colors text-center" >
          Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <div className="font-lagusans">
      <div className="w-12 h-12 bg-[#3ABDE8]/10 rounded-2xl flex items-center justify-center mb-4">
        <KeyRound size={22} className="text-[#3ABDE8]" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Forgot Your Password?
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {loadingInfo}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="namaemail@gmail.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3ABDE8] focus:ring-2 focus:ring-[#3ABDE8]/20 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-3 bg-[#3ABDE8] text-white rounded-xl font-semibold text-sm hover:bg-[#2AADD8] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed" >
          Send Reset Link
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Ingat password?{" "}
        <Link
          to="/login"
          className="text-[#3ABDE8] font-semibold hover:underline" >
          Kembali ke Login
        </Link>
      </p>
    </div>
  );
}
