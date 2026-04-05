export function Header() {
  return (
    <div className="bg-gradient-to-r from-blue-600  to-sky-700 px-8 py-6 text-white">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        

        <div className="text-center">
          <h1 className="text-2xl font-extrabold">
            📝 Formulir Pendaftaran Beasiswa 🎓
          </h1>
          <p className="text-sm text-white/85">
            Politeknik Caltex Riau - Tahun Akademik 2025/2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Container({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-violet-100 px-4 py-10 flex justify-center">
      {/* 🔥 INI NGATUR UKURAN FORM */}
      <div className="w-full max-w-xl rounded-[30px] bg-white shadow-2xl overflow-hidden">
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
