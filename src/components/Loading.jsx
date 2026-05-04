// Komponen Loading — ditampilkan oleh Suspense saat lazy load berlangsung
export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-[#3ABDE8] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-lagusans text-[#3ABDE8] text-lg font-semibold">Loading...</p>
    </div>
  );
}
