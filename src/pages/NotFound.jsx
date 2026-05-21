import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-lagusans">
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
          <Button variant="outline" icon={<ArrowLeft size={15} />} onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button variant="primary" icon={<Home size={15} />} onClick={() => navigate("/dashboard")}>
            Ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
