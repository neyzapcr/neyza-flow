import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-Montserrat">
      <div className="text-center max-w-md">
        {/* Angka 404 */}
        <div className="relative mb-6">
          <p className="text-[120px] font-extrabold text-[#2940D3]/15 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-[#2940D3]/10 rounded-2xl flex items-center justify-center">
              <img
                src="/img/logo Netto Dark.png"
                alt="Netto Laundry"
                className="h-10 w-auto object-contain opacity-60"
              />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          Pastikan URL yang kamu masukkan sudah benar.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={15} /> Kembali
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2940D3] text-white rounded-xl text-sm font-semibold hover:bg-[#5A6FE4] transition-colors shadow-sm"
          >
            <Home size={15} /> Ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
