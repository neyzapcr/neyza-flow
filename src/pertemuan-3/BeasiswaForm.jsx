import { useState } from "react";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import ResultCard from "./components/ResultCard";
import Container from "./components/Container";

export default function BeasiswaForm() {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [semester, setSemester] = useState("");
  const [ipk, setIpk] = useState("");

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const jurusanOptions = [
    { value: "Teknik Informatika", label: "Teknik Informatika" },
    { value: "Sistem Informasi", label: "Sistem Informasi" },
    { value: "Akuntansi Perpajakan", label: "Akuntansi Perpajakan" },
    { value: "Bisnis Digital", label: "Bisnis Digital" },
    { value: "Teknik Mesin", label: "Teknik Mesin" },
    { value: "Teknik Listrik", label: "Teknik Listrik" },
  ];

  const semesterOptions = [
    { value: "1", label: "Semester 1" },
    { value: "2", label: "Semester 2" },
    { value: "3", label: "Semester 3" },
    { value: "4", label: "Semester 4" },
    { value: "5", label: "Semester 5" },
    { value: "6", label: "Semester 6" },
    { value: "7", label: "Semester 7" },
    { value: "8", label: "Semester 8" },
  ];

  function validate(field, value) {
    const newErrors = { ...errors };

    if (field === "namaLengkap") {
      if (!value.trim()) {
        newErrors.namaLengkap = "Nama tidak boleh kosong.";
      } else if (/\d/.test(value)) {
        newErrors.namaLengkap = "Nama tidak boleh mengandung angka.";
      } else if (value.trim().length < 3) {
        newErrors.namaLengkap = "Nama minimal 3 karakter.";
      } else {
        delete newErrors.namaLengkap;
      }
    }

    if (field === "nim") {
      if (!value.trim()) {
        newErrors.nim = "NIM tidak boleh kosong.";
      } else if (!/^\d+$/.test(value)) {
        newErrors.nim = "NIM harus berupa angka.";
      } else if (value.length < 8) {
        newErrors.nim = "NIM minimal 8 digit.";
      } else {
        delete newErrors.nim;
      }
    }

    if (field === "email") {
      if (!value.trim()) {
        newErrors.email = "Email tidak boleh kosong.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = "Format email tidak valid.";
      } else if (!value.endsWith("@gmail.com") && !value.endsWith(".ac.id")) {
        newErrors.email =
          "Email harus menggunakan domain @gmail.com. atau .ac.id";
      } else {
        delete newErrors.email;
      }
    }

    if (field === "jurusan") {
      if (!value) {
        newErrors.jurusan = "Pilih jurusan.";
      } else if (!jurusanOptions.some((opt) => opt.value === value)) {
        newErrors.jurusan = "Jurusan tidak valid.";
      } else if (value.trim().length < 5) {
        newErrors.jurusan = "Nama jurusan terlalu pendek.";
      } else {
        delete newErrors.jurusan;
      }
    }

    if (field === "semester") {
      if (!value) {
        newErrors.semester = "Pilih semester.";
      } else if (!semesterOptions.some((opt) => opt.value === value)) {
        newErrors.semester = "Semester tidak valid.";
      } else if (Number(value) < 1 || Number(value) > 8) {
        newErrors.semester = "Semester harus antara 1 sampai 8.";
      } else {
        delete newErrors.semester;
      }
    }

    if (field === "ipk") {
      if (!value.trim()) {
        newErrors.ipk = "IPK tidak boleh kosong.";
      } else if (value.includes(",")) {
        newErrors.ipk = "Gunakan titik (.) bukan koma (,).";
      } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        newErrors.ipk = "Format IPK tidak valid (contoh: 3.50).";
      } else if (Number(value) < 0 || Number(value) > 4) {
        newErrors.ipk = "IPK harus antara 0.00 sampai 4.00.";
      } else {
        delete newErrors.ipk;
      }
    }

    setErrors(newErrors);
  }

  const fields = [namaLengkap, nim, email, jurusan, semester, ipk];
  const bolehSubmit =
    fields.every((v) => v !== "") && Object.keys(errors).length === 0;

  function handleSubmit(e) {
    e.preventDefault();

    validate("namaLengkap", namaLengkap);
    validate("nim", nim);
    validate("email", email);
    validate("jurusan", jurusan);
    validate("semester", semester);
    validate("ipk", ipk);

    const isValidNama =
      namaLengkap.trim() &&
      !/\d/.test(namaLengkap) &&
      namaLengkap.trim().length >= 3;

    const isValidNim = nim.trim() && /^\d+$/.test(nim) && nim.length >= 8;

    const isValidEmail =
      email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      (email.endsWith("@gmail.com") || email.endsWith(".ac.id"));

    const isValidJurusan =
      jurusan && jurusanOptions.some((opt) => opt.value === jurusan);

    const isValidSemester =
      semester &&
      /^\d+$/.test(semester) &&
      Number(semester) >= 2 &&
      Number(semester) <= 8;

    const isValidIpk =
      ipk.trim() &&
      !ipk.includes(",") &&
      /^\d+(\.\d{1,2})?$/.test(ipk) &&
      Number(ipk) >= 0 &&
      Number(ipk) <= 4;

    if ( isValidNama && isValidNim && isValidEmail && 
      isValidJurusan && isValidSemester && isValidIpk
    ) {
      setSubmittedData({
        nama: namaLengkap, nim, email, jurusan, semester, ipk,
      });
    }
  }

  function handleReset() {
    setNamaLengkap("");
    setNim("");
    setEmail("");
    setJurusan("");
    setSemester("");
    setIpk("");
    setErrors({});
    setSubmittedData(null);
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-1.5 md:grid-cols-2 ">
          <InputField label="Nama Lengkap" type="text" placeholder="Masukkan nama lengkap ..." 
          value={namaLengkap} onChange={(e) => {
              setNamaLengkap(e.target.value);
              validate("namaLengkap", e.target.value);
            }}
            error={errors.namaLengkap} />

          <InputField label="NIM" type="text" placeholder="Masukkan NIM ..." 
          value={nim} onChange={(e) => {
              setNim(e.target.value);
              validate("nim", e.target.value);
            }}
            error={errors.nim} />

          <InputField label="Email Aktif" type="email" placeholder="contoh: nama@gmail.com" 
          value={email} onChange={(e) => {
              setEmail(e.target.value);
              validate("email", e.target.value);
            }}
            error={errors.email} />

          <InputField label="IPK" type="text" placeholder="Contoh: 3.75"
            value={ipk} onChange={(e) => {
              setIpk(e.target.value);
              validate("ipk", e.target.value);
            }}
            error={errors.ipk} />

          <SelectField label="Program Studi" placeholder="--- Pilih Jurusan ---" 
          value={jurusan} onChange={(e) => {
              setJurusan(e.target.value);
              validate("jurusan", e.target.value);
            }}
            options={jurusanOptions}
            error={errors.jurusan} />

          <SelectField label="Semester Saat Ini"  placeholder="-- Pilih Semester --" 
          value={semester} onChange={(e) => {
              setSemester(e.target.value);
              validate("semester", e.target.value);
            }}
            options={semesterOptions}
            error={errors.semester} />
        </div>

        <div className="mt-6">
          {bolehSubmit ? (
            <button className="w-full rounded-xl font-bold bg-green-500 py-3 text-white hover:bg-green-600">
              Daftar Beasiswa 
            </button>
          ) : (
            <div className="w-full rounded-xl bg-slate-100 py-3 text-center text-slate-400">
              📝 Lengkapi semua field untuk melanjutkan.
            </div>
          )}
        </div>
      </form>
      <ResultCard data={submittedData} onReset={handleReset} />
    </Container>
  );
}