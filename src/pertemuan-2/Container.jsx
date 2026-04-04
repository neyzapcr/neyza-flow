export default function Container({ children }) {
  return (
    <div className="page-wrap">
      <div className="biodata-card">
        
        <div className="header-judul">
          <h1>Biodata Diri</h1>
          <p>📚 Pertemuan 2 - PFL</p>
        </div>
        {children}

        <div className="footer-bawah">
          2025 - Politeknik Caltex Riau
        </div>
      </div>
    </div>
  );
}