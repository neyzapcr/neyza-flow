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
    let error = "";
    if (field === "namaLengkap") {
      if (!value.trim()) error = "Nama tidak boleh kosong.";
      else if (/\d/.test(value)) error = "Nama tidak boleh mengandung angka.";
      else if (value.trim().length < 3) error = "Nama minimal 3 karakter.";
    }
    if (field === "nim") {
      if (!value.trim()) error = "NIM tidak boleh kosong.";
      else if (!/^\d+$/.test(value)) error = "NIM harus berupa angka.";
      else if (value.length < 8) error = "NIM minimal 8 digit.";
    }
    if (field === "email") {
      if (!value.trim()) error = "Email tidak boleh kosong.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Format email tidak valid.";
      else if (!value.endsWith("@gmail.com") && !value.endsWith(".ac.id")) error = "Email harus @gmail.com atau .ac.id";
    }
    if (field === "jurusan" && !value) error = "Pilih jurusan.";
    if (field === "semester" && !value) error = "Pilih semester.";
    if (field === "ipk") {
      if (!value.trim()) error = "IPK tidak boleh kosong.";
      else if (value.includes(",")) error = "Gunakan titik (.)";
      else if (!/^\d+(\.\d{1,2})?$/.test(value)) error = "Format IPK tidak valid.";
      else if (Number(value) < 0 || Number(value) > 4) error = "IPK 0 - 4";
    }
    return error;
  }

  function handleChange(field, value, setValue) {
    setValue(value);
    setErrors({ ...errors, [field]: validate(field, value) });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {
      namaLengkap: validate("namaLengkap", namaLengkap),
      nim: validate("nim", nim),
      email: validate("email", email),
      jurusan: validate("jurusan", jurusan),
      semester: validate("semester", semester),
      ipk: validate("ipk", ipk),
    };
    setErrors(newErrors);
    if (!Object.values(newErrors).some((e) => e !== "")) {
      setSubmittedData({ nama: namaLengkap, nim, email, jurusan, semester, ipk });
    }
  }

  function handleReset() {
    setNamaLengkap(""); setNim(""); setEmail("");
    setJurusan(""); setSemester(""); setIpk("");
    setErrors({}); setSubmittedData(null);
  }

  const inputFields = [
    { name: "namaLengkap", label: "Nama Lengkap", type: "text", placeholder: "Masukkan nama...", value: namaLengkap, setValue: setNamaLengkap },
    { name: "nim", label: "NIM", type: "text", placeholder: "Masukkan NIM...", value: nim, setValue: setNim },
    { name: "email", label: "Email", type: "email", placeholder: "nama@gmail.com", value: email, setValue: setEmail },
    { name: "ipk", label: "IPK", type: "text", placeholder: "3.75", value: ipk, setValue: setIpk },
  ];

  const selectFields = [
    { name: "jurusan", label: "Program Studi", value: jurusan, setValue: setJurusan, options: jurusanOptions, placeholder: "-- Pilih Jurusan --" },
    { name: "semester", label: "Semester", value: semester, setValue: setSemester, options: semesterOptions, placeholder: "-- Pilih Semester --" },
  ];

  const fields = [namaLengkap, nim, email, jurusan, semester, ipk];
  const bolehSubmit = fields.every((v) => v !== "") && Object.values(errors).every((e) => e === "");

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-1.5 md:grid-cols-2">
          {inputFields.map((f) => (
            <InputField key={f.name} label={f.label} type={f.type} placeholder={f.placeholder}
              value={f.value} onChange={(e) => handleChange(f.name, e.target.value, f.setValue)}
              error={errors[f.name]} />
          ))}
          {selectFields.map((f) => (
            <SelectField key={f.name} label={f.label} value={f.value}
              onChange={(e) => handleChange(f.name, e.target.value, f.setValue)}
              options={f.options} placeholder={f.placeholder} error={errors[f.name]} />
          ))}
        </div>

        <div className="mt-6">
          {bolehSubmit
            ? <button className="w-full rounded-xl bg-green-500 py-3 font-bold text-white hover:bg-green-600">Daftar Beasiswa</button>
            : <div className="w-full rounded-xl bg-slate-100 py-3 text-center text-slate-400">📝 Lengkapi semua field</div>}
        </div>
      </form>
      <ResultCard data={submittedData} onReset={handleReset} />
    </Container>
  );
}