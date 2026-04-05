export default function ResultCard({ data, onReset }) {
  if (!data) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-white text-center">
  <h2 className="text-lg font-bold">✅ Data Berhasil Dikirim ✅</h2>
  <p className="mt-1 text-sm text-white/90">
    Berikut ringkasan data pendaftaran kamu.
  </p>
</div>

      <div className="px-5 py-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          

          <div className="space-y-3">
            <Row label="Nama Lengkap" value={data.nama} />
            <Row label="NIM" value={data.nim} />
            <Row label="Email Aktif" value={data.email} />
            <Row label="Program Studi" value={data.jurusan} />
            <Row label="Semester" value={`Semester ${data.semester}`} />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onReset}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.01] active:scale-[0.99]"
          >
            Isi Ulang Form
          </button>
        </div>
      </div>
    </div>
  );
}

// test

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="max-w-[58%] wrap-break-word text-right text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}
