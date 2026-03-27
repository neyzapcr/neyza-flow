// 1. Foto Profil
function FotoProfil() {
  return (
    <div className="foto-bulat">
      <img src="img/Neyza Shafalika - profil.png" alt="Foto Profil" />
    </div>
  );
}

// 2. Info Utama (Nama + Prodi)
function InfoUtama(props) {
  return (
    <>
      <div className="info-box nama-box">{props.nama}</div>
      <div className="info-box prodi-box">{props.prodi}</div>
    </>
  );
}

// 3. Info Detail (NIM & Kelas)
function InfoDetail(props) {
  return (
    <div className="info-dua">
      <div className="info-box mini-box">
        <span>NIM</span>
        <p>{props.nim}</p>
      </div>

      <div className="info-box mini-box">
        <span>Kelas</span>
        <p>{props.kelas}</p>
      </div>
    </div>
  );
}

// 4. Profil Kiri
function ProfilKiri(props) {
  return (
    <div className="profil-kiri">
      <FotoProfil />
      <InfoUtama nama={props.nama} prodi={props.prodi} />
      <InfoDetail nim={props.nim} kelas={props.kelas} />
    </div>
  );
}

// 5. Tentang Saya
function TentangSaya() {
  return (
    <div className="section">
      <h2>👤 Tentang Saya</h2>
      <p>Saya mahasiswa yang kritis, cepat nangkep, dan terus berkembang.</p>
    </div>
  );
}

// 6. Item Pengalaman
function ItemPengalaman(props) {
  return (
    <div className="item">
      <p className="judul">{props.judul}</p>
      <span>
        {props.divisi} • {props.tahun}
      </span>
    </div>
  );
}

// 7. Pengalaman Kepanitiaan
function PengalamanKepanitiaan() {
  return (
    <div className="section">
      <h2>🎯 Pengalaman Kepanitiaan</h2>

      <div className="pengalaman-grid">
        <ItemPengalaman judul="CB Himasistifo" divisi="Divisi Acara" tahun="2025"/>
        <ItemPengalaman judul="Seminar & Workshop CSIRT" divisi="Divisi Acara" tahun="2024"/>
        <ItemPengalaman judul="LDKP 1 UKMI" divisi="Divisi Acara" tahun="2025"/>
        <ItemPengalaman judul="CUXION III" divisi="Divisi Acara" tahun="2025" />
        <ItemPengalaman judul="ISO 2025" divisi="Divisi Acara" tahun="2025" />
        <ItemPengalaman judul="Grand Opening SII" divisi="Divisi Acara" tahun="2025"/>
      </div>
    </div>
  );
}

// 8. Hobi
function Hobi() {
  return (
    <div className="section">
      <h2>🎨 Hobi</h2>
      <p>Membaca & mendengarkan musik</p>
    </div>
  );
}

// 9. Quote
function Quote() {
  return (
    <div className="section">
      <h2>💬 Quote</h2>
      <p><i>"Learning to fly starts with a fall."</i></p>
    </div>
  );
}

// 10. Sosial Media
function SosialMedia() {
  return (
    <div className="section">
      <h2>🌐 Sosial Media & Kontak</h2>
      <div className="sosmed-list">
        <a href="https://instagram.com/neza.sha" target="_blank" rel="noreferrer">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram"/>
        </a>

        <a href="https://github.com/neyzapcr" target="_blank" rel="noreferrer">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub"/>
        </a>

        <a href="https://www.linkedin.com/in/neyza-shafalika-s0020244636/" target="_blank" rel="noreferrer">
          <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn"/>
        </a>

        <a href="mailto:neyza24si@mahasiswa.pcr.ac.id"> 
          <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" />
        </a>
      </div>
    </div>
  );
}

// Main Component
export default function BiodataDiri() {
  return (
    <div className="main-layout">
      <ProfilKiri
        nama="Neyza Shafalika"
        nim="2457301113"
        kelas="2 SI C"
        prodi="Mahasiswa Sistem Informasi Semester 4"/>

      <div className="konten-kanan">
        <TentangSaya />
        <PengalamanKepanitiaan />

        <div className="row-dua">
          <Hobi />
          <Quote />
        </div>

        <SosialMedia />
      </div>
    </div>
  );
}
