import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { FileText, Download, Users, TrendingUp, RefreshCw, UserPlus, Send } from "lucide-react";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";
import transactionsData from "../data/transactions.json";

const monthlyData = [
  { month: "Jan", pelangganBaru: 3, transaksi: 18, pendapatan: 540000 },
  { month: "Feb", pelangganBaru: 2, transaksi: 22, pendapatan: 660000 },
  { month: "Mar", pelangganBaru: 5, transaksi: 30, pendapatan: 900000 },
  { month: "Apr", pelangganBaru: 4, transaksi: 28, pendapatan: 840000 },
  { month: "Mei", pelangganBaru: 6, transaksi: 35, pendapatan: 1050000 },
];

const segmentColors = {
  VIP: "bg-purple-100 text-purple-700",
  Loyal: "bg-blue-100 text-[#3ABDE8]",
  Regular: "bg-green-100 text-green-700",
  New: "bg-yellow-100 text-yellow-700",
};

// ── PDF export using jsPDF ──────────────────────────────────────────────────
async function exportPDF({ totalRevenue, activeCustomers, newCustomers, retentionRate, period }) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const now = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  // Header
  doc.setFillColor(58, 189, 232);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LaundryPro CRM", 14, 13);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Laporan CRM — Periode: ${period}`, 14, 22);
  doc.text(`Dicetak: ${now}`, 150, 22);

  // KPI Summary
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan KPI", 14, 42);

  autoTable(doc, {
    startY: 46,
    head: [["Indikator", "Nilai"]],
    body: [
      ["Total Pendapatan", `Rp ${totalRevenue.toLocaleString("id-ID")}`],
      ["Pelanggan Aktif", `${activeCustomers} pelanggan`],
      ["Pelanggan Baru (2025)", `${newCustomers} pelanggan`],
      ["Tingkat Retensi", `${retentionRate}%`],
    ],
    headStyles: { fillColor: [58, 189, 232], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 250, 255] },
    styles: { fontSize: 10 },
  });

  // Monthly Data
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Data Bulanan", 14, doc.lastAutoTable.finalY + 14);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 18,
    head: [["Bulan", "Pelanggan Baru", "Transaksi", "Pendapatan"]],
    body: monthlyData.map((d) => [
      d.month,
      d.pelangganBaru,
      d.transaksi,
      `Rp ${d.pendapatan.toLocaleString("id-ID")}`,
    ]),
    headStyles: { fillColor: [58, 189, 232], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 250, 255] },
    styles: { fontSize: 10 },
  });

  // Segment Report
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan per Segmen", 14, doc.lastAutoTable.finalY + 14);

  const segRows = ["VIP", "Loyal", "Regular", "New"].map((seg) => {
    const sc = customersData.filter((c) => c.segment === seg);
    const total = sc.reduce((s, c) => s + c.totalSpent, 0);
    const avg = Math.round(total / (sc.length || 1));
    const pct = Math.round((sc.length / customersData.length) * 100);
    return [seg, sc.length, `Rp ${total.toLocaleString("id-ID")}`, `Rp ${avg.toLocaleString("id-ID")}`, `${pct}%`];
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 18,
    head: [["Segmen", "Jumlah", "Total Belanja", "Rata-rata Belanja", "% Total"]],
    body: segRows,
    headStyles: { fillColor: [58, 189, 232], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 250, 255] },
    styles: { fontSize: 10 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`LaundryPro CRM — Halaman ${i} dari ${pageCount}`, 14, 290);
  }

  doc.save(`Laporan-CRM-${period}-${now.replace(/ /g, "-")}.pdf`);
}

// ── Word/DOCX export (plain HTML → .doc trick) ──────────────────────────────
function exportWord({ totalRevenue, activeCustomers, newCustomers, retentionRate, period }) {
  const now = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  const segRows = ["VIP", "Loyal", "Regular", "New"].map((seg) => {
    const sc = customersData.filter((c) => c.segment === seg);
    const total = sc.reduce((s, c) => s + c.totalSpent, 0);
    const avg = Math.round(total / (sc.length || 1));
    const pct = Math.round((sc.length / customersData.length) * 100);
    return `<tr><td>${seg}</td><td>${sc.length}</td><td>Rp ${total.toLocaleString("id-ID")}</td><td>Rp ${avg.toLocaleString("id-ID")}</td><td>${pct}%</td></tr>`;
  }).join("");

  const monthRows = monthlyData.map((d) =>
    `<tr><td>${d.month}</td><td>${d.pelangganBaru}</td><td>${d.transaksi}</td><td>Rp ${d.pendapatan.toLocaleString("id-ID")}</td></tr>`
  ).join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>Laporan CRM</title>
    <style>
      body { font-family: Calibri, sans-serif; font-size: 11pt; color: #1a1a1a; }
      h1 { color: #3ABDE8; font-size: 18pt; margin-bottom: 4pt; }
      h2 { color: #1a1a1a; font-size: 13pt; margin-top: 18pt; margin-bottom: 6pt; border-bottom: 1px solid #3ABDE8; padding-bottom: 4pt; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 12pt; }
      th { background-color: #3ABDE8; color: white; padding: 6pt 8pt; text-align: left; font-size: 10pt; }
      td { padding: 5pt 8pt; border-bottom: 1px solid #e5e7eb; font-size: 10pt; }
      tr:nth-child(even) td { background-color: #f5faff; }
      .meta { color: #6b7280; font-size: 10pt; margin-bottom: 16pt; }
    </style>
    </head><body>
    <h1>LaundryPro CRM</h1>
    <p class="meta">Laporan CRM — Periode: ${period} &nbsp;|&nbsp; Dicetak: ${now}</p>

    <h2>Ringkasan KPI</h2>
    <table>
      <tr><th>Indikator</th><th>Nilai</th></tr>
      <tr><td>Total Pendapatan</td><td>Rp ${totalRevenue.toLocaleString("id-ID")}</td></tr>
      <tr><td>Pelanggan Aktif</td><td>${activeCustomers} pelanggan</td></tr>
      <tr><td>Pelanggan Baru (2025)</td><td>${newCustomers} pelanggan</td></tr>
      <tr><td>Tingkat Retensi</td><td>${retentionRate}%</td></tr>
    </table>

    <h2>Data Bulanan</h2>
    <table>
      <tr><th>Bulan</th><th>Pelanggan Baru</th><th>Transaksi</th><th>Pendapatan</th></tr>
      ${monthRows}
    </table>

    <h2>Laporan per Segmen</h2>
    <table>
      <tr><th>Segmen</th><th>Jumlah</th><th>Total Belanja</th><th>Rata-rata Belanja</th><th>% Total</th></tr>
      ${segRows}
    </table>
    </body></html>
  `;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Laporan-CRM-${period}-${now.replace(/ /g, "-")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [period, setPeriod] = useState("bulan");
  const [exporting, setExporting] = useState(null);

  const totalRevenue = transactionsData.reduce((s, t) => s + t.total, 0);
  const activeCustomers = customersData.filter((c) => c.status === "active").length;
  const newCustomers = customersData.filter((c) => c.joinDate >= "2025-01-01").length;
  const retentionRate = Math.round((activeCustomers / customersData.length) * 100);

  const exportArgs = { totalRevenue, activeCustomers, newCustomers, retentionRate, period };

  const handleExport = async (type) => {
    setExporting(type);
    try {
      if (type === "pdf") await exportPDF(exportArgs);
      else exportWord(exportArgs);
    } finally {
      setExporting(null);
    }
  };

  const kpis = [
    { label: "Total Pendapatan", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, Icon: TrendingUp, sub: "↑ 12% vs bulan lalu", subColor: "text-green-500", color: "bg-blue-50", iconColor: "text-[#3ABDE8]" },
    { label: "Pelanggan Aktif", value: activeCustomers, Icon: Users, sub: `${retentionRate}% retensi`, subColor: "text-[#3ABDE8]", color: "bg-green-50", iconColor: "text-green-500" },
    { label: "Pelanggan Baru", value: newCustomers, Icon: UserPlus, sub: "Tahun 2025", subColor: "text-purple-500", color: "bg-purple-50", iconColor: "text-purple-500" },
    { label: "Tingkat Retensi", value: `${retentionRate}%`, Icon: RefreshCw, sub: "Pelanggan kembali", subColor: "text-orange-500", color: "bg-orange-50", iconColor: "text-orange-500" },
  ];

  return (
    <div>
      <PageHeader title="Laporan CRM" subtitle="Analisis performa bisnis dan data pelanggan">
        <div className="flex items-center gap-2">
          {/* Period filter */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {["hari", "minggu", "bulan"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? "bg-white text-[#3ABDE8] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {p}
              </button>
            ))}
          </div>

          {/* Export PDF */}
          <button
            onClick={() => handleExport("pdf")}
            disabled={exporting === "pdf"}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm disabled:opacity-60"
          >
            {exporting === "pdf"
              ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <FileText size={13} />
            }
            PDF
          </button>

          {/* Export Word */}
          <button
            onClick={() => handleExport("word")}
            disabled={exporting === "word"}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
          >
            {exporting === "word"
              ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Download size={13} />
            }
            Word
          </button>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-white`}>
            <s.Icon size={20} className={`${s.iconColor} mb-2`} />
            <p className="text-xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            <p className={`text-xs font-medium mt-1 ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-800 mb-1">Tren Pendapatan</p>
          <p className="text-xs text-gray-400 mb-4">Pendapatan per bulan (2025)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => [`Rp ${v.toLocaleString("id-ID")}`, "Pendapatan"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="pendapatan" fill="#3ABDE8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-800 mb-1">Pertumbuhan Pelanggan</p>
          <p className="text-xs text-gray-400 mb-4">Pelanggan baru per bulan</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="pelangganBaru" stroke="#3ABDE8" strokeWidth={2.5} dot={{ fill: "#3ABDE8", r: 4 }} name="Pelanggan Baru" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segment Report */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <p className="font-bold text-gray-800 mb-4">Laporan per Segmen</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-4 py-3 font-semibold rounded-l-xl">Segmen</th>
                <th className="px-4 py-3 font-semibold">Jumlah</th>
                <th className="px-4 py-3 font-semibold">Total Belanja</th>
                <th className="px-4 py-3 font-semibold">Rata-rata Belanja</th>
                <th className="px-4 py-3 font-semibold">Rata-rata Transaksi</th>
                <th className="px-4 py-3 font-semibold rounded-r-xl">% dari Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {["VIP", "Loyal", "Regular", "New"].map((seg) => {
                const sc = customersData.filter((c) => c.segment === seg);
                const total = sc.reduce((s, c) => s + c.totalSpent, 0);
                const avg = Math.round(total / (sc.length || 1));
                const avgTrx = Math.round(sc.reduce((s, c) => s + c.totalTransactions, 0) / (sc.length || 1));
                const pct = Math.round((sc.length / customersData.length) * 100);
                return (
                  <tr key={seg} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${segmentColors[seg]}`}>{seg}</span></td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{sc.length}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">Rp {total.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-gray-600">Rp {avg.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-gray-600">{avgTrx}x</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-[#3ABDE8]" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inactive Reminder */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-gray-800">Pelanggan Tidak Aktif</p>
            <p className="text-xs text-gray-400">Tidak bertransaksi lebih dari 30 hari</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#3ABDE8]/10 text-[#3ABDE8] rounded-xl text-xs font-semibold hover:bg-[#3ABDE8]/20 transition-colors">
            <Send size={13} /> Kirim Reminder
          </button>
        </div>
        <div className="space-y-3">
          {customersData.filter((c) => c.status === "inactive").map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-500 font-bold text-sm">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">Terakhir: {c.lastTransaction}</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3ABDE8] text-white rounded-lg text-xs font-semibold hover:bg-[#2AADD8] transition-colors">
                <Send size={11} /> Kirim Pesan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
