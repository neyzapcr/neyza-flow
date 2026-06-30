import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { FileText, Download, Users, TrendingUp, RefreshCw, UserPlus, Send } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Avatar from "../components/Avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getCustomers } from "../services/CustomerApi";
import { getTransactions } from "../services/TransactionApi";

const chartConfig = {
  pendapatan: {
    label: "Pendapatan",
    color: "#2940D3",
  },
  pelangganBaru: {
    label: "Pelanggan Baru",
    color: "#2940D3",
  },
};

// --- Fungsi Export PDF & Word ---
async function exportPDF({ totalRevenue, activeCustomers, newCustomers, retentionRate, period, monthlyData, customers }) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doc = new jsPDF();
  const primaryColor = [41, 64, 211]; // #2940D3
  const darkTextColor = [31, 41, 55]; // #1f2937
  const lightTextColor = [107, 114, 128]; // #6b7280

  // 1. Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("LAPORAN CRM - Netto LAUNDRY", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  doc.text(`Dicetak pada: ${dateStr}  |  Filter Periode: ${period.toUpperCase()}`, 14, 26);

  // Line separator
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(14, 29, 196, 29);

  // 2. Executive Summary (KPIs)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text("Ringkasan Performa Bisnis", 14, 37);

  const kpiHeaders = ["Indikator Performa", "Nilai Realisasi"];
  const kpiRows = [
    ["Total Pendapatan", `Rp ${totalRevenue.toLocaleString("id-ID")}`],
    ["Pelanggan Aktif", `${activeCustomers} Pelanggan`],
    ["Pelanggan Baru", `${newCustomers} Pelanggan`],
    ["Tingkat Retensi", `${retentionRate}% dari total pelanggan`],
  ];

  doc.autoTable({
    startY: 42,
    head: [kpiHeaders],
    body: kpiRows,
    theme: "grid",
    headStyles: { fillColor: primaryColor, halign: "left" },
    styles: { font: "helvetica", fontSize: 9 },
    margin: { left: 14, right: 14 }
  });

  // 3. Trend Table
  let nextY = doc.lastAutoTable.finalY + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`Detail Tren Aktivitas (${period.toUpperCase()})`, 14, nextY);

  const trendHeaders = ["Periode / Label", "Pelanggan Baru", "Total Transaksi", "Total Pendapatan"];
  const trendRows = (monthlyData || []).map(d => [
    d.month,
    `${d.pelangganBaru} Pelanggan`,
    `${d.transaksi} Transaksi`,
    `Rp ${d.pendapatan.toLocaleString("id-ID")}`
  ]);

  doc.autoTable({
    startY: nextY + 5,
    head: [trendHeaders],
    body: trendRows,
    theme: "striped",
    headStyles: { fillColor: [20, 34, 151], halign: "left" },
    styles: { font: "helvetica", fontSize: 9 },
    margin: { left: 14, right: 14 }
  });

  // 4. Segment Analysis
  nextY = doc.lastAutoTable.finalY + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Laporan Per Segmen Pelanggan", 14, nextY);

  const segmentHeaders = ["Segmen", "Jumlah", "Total Belanja", "Rata-rata Belanja", "Rata-rata Transaksi", "Kontribusi"];
  const segmentRows = ["VIP", "Loyal", "Regular", "New"].map((seg) => {
    const sc = customers.filter((c) => c.segment === seg);
    const total = sc.reduce((s, c) => s + Number(c.totalSpent || 0), 0);
    const avg = Math.round(total / (sc.length || 1));
    const avgTrx = Math.round(sc.reduce((s, c) => s + Number(c.totalTransactions || 0), 0) / (sc.length || 1));
    const pct = Math.round((sc.length / (customers.length || 1)) * 100);

    return [
      seg,
      `${sc.length} Pelanggan`,
      `Rp ${total.toLocaleString("id-ID")}`,
      `Rp ${avg.toLocaleString("id-ID")}`,
      `${avgTrx}x`,
      `${pct}%`
    ];
  });

  doc.autoTable({
    startY: nextY + 5,
    head: [segmentHeaders],
    body: segmentRows,
    theme: "grid",
    headStyles: { fillColor: primaryColor, halign: "left" },
    styles: { font: "helvetica", fontSize: 9 },
    margin: { left: 14, right: 14 }
  });

  // 5. Inactive Customers List
  nextY = doc.lastAutoTable.finalY + 12;
  if (nextY > 230) {
    doc.addPage();
    nextY = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Daftar Pelanggan Tidak Aktif (Perlu Tindakan)", 14, nextY);

  const inactiveHeaders = ["Nama Pelanggan", "Status", "Terakhir Bertransaksi"];
  const inactiveCustomers = customers.filter((c) => c.status === "inactive");
  const inactiveRows = inactiveCustomers.map(c => [
    c.customerName,
    "Tidak Aktif",
    c.lastTransaction || "-"
  ]);

  doc.autoTable({
    startY: nextY + 5,
    head: [inactiveHeaders],
    body: inactiveRows,
    theme: "striped",
    headStyles: { fillColor: [239, 68, 68], halign: "left" },
    styles: { font: "helvetica", fontSize: 9 },
    margin: { left: 14, right: 14 }
  });

  doc.save(`Laporan_CRM_${period}_${new Date().toISOString().split("T")[0]}.pdf`);
}

function exportWord({ totalRevenue, activeCustomers, newCustomers, retentionRate, period, monthlyData, customers }) {
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const segmentRowsHtml = ["VIP", "Loyal", "Regular", "New"].map((seg) => {
    const sc = customers.filter((c) => c.segment === seg);
    const total = sc.reduce((s, c) => s + Number(c.totalSpent || 0), 0);
    const avg = Math.round(total / (sc.length || 1));
    const avgTrx = Math.round(sc.reduce((s, c) => s + Number(c.totalTransactions || 0), 0) / (sc.length || 1));
    const pct = Math.round((sc.length / (customers.length || 1)) * 100);

    return `
      <tr>
        <td style="padding:8px; border:1px solid #ddd;"><b>${seg}</b></td>
        <td style="padding:8px; border:1px solid #ddd;">${sc.length} Pelanggan</td>
        <td style="padding:8px; border:1px solid #ddd;">Rp ${total.toLocaleString("id-ID")}</td>
        <td style="padding:8px; border:1px solid #ddd;">Rp ${avg.toLocaleString("id-ID")}</td>
        <td style="padding:8px; border:1px solid #ddd;">${avgTrx}x</td>
        <td style="padding:8px; border:1px solid #ddd;">${pct}%</td>
      </tr>
    `;
  }).join("");

  const inactiveCustomers = customers.filter((c) => c.status === "inactive");
  const inactiveRowsHtml = inactiveCustomers.map(c => `
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">${c.customerName}</td>
      <td style="padding:8px; border:1px solid #ddd; color:red;">Tidak Aktif</td>
      <td style="padding:8px; border:1px solid #ddd;">${c.lastTransaction || "-"}</td>
    </tr>
  `).join("");

  const trendRowsHtml = (monthlyData || []).map(d => `
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">${d.month}</td>
      <td style="padding:8px; border:1px solid #ddd;">${d.pelangganBaru} Pelanggan</td>
      <td style="padding:8px; border:1px solid #ddd;">${d.transaksi} Transaksi</td>
      <td style="padding:8px; border:1px solid #ddd;">Rp ${d.pendapatan.toLocaleString("id-ID")}</td>
    </tr>
  `).join("");

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>Laporan CRM</title>
      <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom></w:WordDocument></xml><![endif]-->
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; margin: 20px; }
        h1 { color: #2940D3; font-size: 20px; border-bottom: 2px solid #2940D3; padding-bottom: 5px; }
        h2 { color: #333; font-size: 14px; margin-top: 25px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background-color: #2940D3; color: white; text-align: left; padding: 8px; font-size: 11px; }
        td { padding: 8px; border: 1px solid #ddd; font-size: 10px; }
      </style>
    </head>
    <body>
      <h1>LAPORAN PERFORMA CRM LAUNDRY</h1>
      <p style="font-size:10px; color:#666;">Dicetak pada: ${dateStr} | Filter Periode: ${period.toUpperCase()}</p>
      
      <h2>Ringkasan Eksekutif</h2>
      <table>
        <thead>
          <tr>
            <th style="background-color:#2940D3; color:white;">Indikator Performa</th>
            <th style="background-color:#2940D3; color:white;">Nilai Realisasi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">Total Pendapatan</td>
            <td style="padding:8px; border:1px solid #ddd;"><b>Rp ${totalRevenue.toLocaleString("id-ID")}</b></td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">Pelanggan Aktif</td>
            <td style="padding:8px; border:1px solid #ddd;">${activeCustomers} Pelanggan</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">Pelanggan Baru</td>
            <td style="padding:8px; border:1px solid #ddd;">${newCustomers} Pelanggan</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">Tingkat Retensi</td>
            <td style="padding:8px; border:1px solid #ddd;">${retentionRate}%</td>
          </tr>
        </tbody>
      </table>

      <h2>Tren Aktivitas (${period.toUpperCase()})</h2>
      <table>
        <thead>
          <tr>
            <th style="background-color:#142297; color:white;">Periode</th>
            <th style="background-color:#142297; color:white;">Pelanggan Baru</th>
            <th style="background-color:#142297; color:white;">Total Transaksi</th>
            <th style="background-color:#142297; color:white;">Total Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          ${trendRowsHtml}
        </tbody>
      </table>

      <h2>Laporan Per Segmen Pelanggan</h2>
      <table>
        <thead>
          <tr>
            <th style="background-color:#2940D3; color:white;">Segmen</th>
            <th style="background-color:#2940D3; color:white;">Jumlah</th>
            <th style="background-color:#2940D3; color:white;">Total Belanja</th>
            <th style="background-color:#2940D3; color:white;">Rata-rata Belanja</th>
            <th style="background-color:#2940D3; color:white;">Rata-rata Transaksi</th>
            <th style="background-color:#2940D3; color:white;">Kontribusi</th>
          </tr>
        </thead>
        <tbody>
          ${segmentRowsHtml}
        </tbody>
      </table>

      <h2>Daftar Pelanggan Tidak Aktif (> 30 Hari)</h2>
      <table>
        <thead>
          <tr>
            <th style="background-color:#ef4444; color:white;">Nama Pelanggan</th>
            <th style="background-color:#ef4444; color:white;">Status</th>
            <th style="background-color:#ef4444; color:white;">Terakhir Bertransaksi</th>
          </tr>
        </thead>
        <tbody>
          ${inactiveRowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Laporan_CRM_${period}_${new Date().toISOString().split("T")[0]}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [period, setPeriod] = useState("bulan");
  const [exporting, setExporting] = useState(null);
  const [inactivePage, setInactivePage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const custs = await getCustomers();
        const trxs = await getTransactions();
        setCustomers(custs || []);
        setTransactions(trxs || []);
      } catch (err) {
        console.error("Failed to load reports data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const maxDateStr = transactions.map(t => t.receivedDate || t.date).filter(Boolean).sort().pop() || new Date().toISOString().split("T")[0];
  const [yr, mt, dy] = maxDateStr.split("-").map(Number);

  let monthlyData = [];

  if (period === "hari" && transactions.length > 0) {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(yr, mt - 1, dy - (6 - i));
      return d;
    });

    monthlyData = days.map((date) => {
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const dayTrxs = transactions.filter((t) => (t.receivedDate || t.date) === dateStr);
      const dayCusts = customers.filter((c) => c.joinDate === dateStr);
      return {
        month: date.toLocaleDateString("id-ID", { weekday: "short" }),
        pelangganBaru: dayCusts.length,
        transaksi: dayTrxs.length,
        pendapatan: dayTrxs.reduce((s, t) => s + Number(t.total || 0), 0),
      };
    });
  } else if (period === "minggu" && transactions.length > 0) {
    const weeks = Array.from({ length: 4 }, (_, i) => {
      const wEnd = new Date(yr, mt - 1, dy - (3 - i) * 7);
      const wStart = new Date(wEnd.getTime() - 6 * 24 * 60 * 60 * 1000);
      return { start: wStart, end: wEnd, label: `Mng ${i + 1}` };
    });

    monthlyData = weeks.map((w) => {
      const weekTrxs = transactions.filter((t) => {
        const dStr = t.receivedDate || t.date;
        if (!dStr) return false;
        const d = new Date(dStr);
        return d >= w.start && d <= w.end;
      });
      const weekCusts = customers.filter((c) => {
        if (!c.joinDate) return false;
        const d = new Date(c.joinDate);
        return d >= w.start && d <= w.end;
      });
      return {
        month: w.label,
        pelangganBaru: weekCusts.length,
        transaksi: weekTrxs.length,
        pendapatan: weekTrxs.reduce((s, t) => s + Number(t.total || 0), 0),
      };
    });
  } else if (transactions.length > 0) {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(yr, mt - 1 - (5 - i), 1);
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleDateString("id-ID", { month: "short" }),
      };
    });

    monthlyData = months.map((m) => {
      const mTrxs = transactions.filter((t) => {
        const dStr = t.receivedDate || t.date;
        if (!dStr) return false;
        const d = new Date(dStr);
        return d.getFullYear() === m.year && d.getMonth() === m.month;
      });
      const mCusts = customers.filter((c) => {
        if (!c.joinDate) return false;
        const d = new Date(c.joinDate);
        return d.getFullYear() === m.year && d.getMonth() === m.month;
      });
      return {
        month: m.label,
        pelangganBaru: mCusts.length,
        transaksi: mTrxs.length,
        pendapatan: mTrxs.reduce((s, t) => s + Number(t.total || 0), 0),
      };
    });
  }

  // --- Aggregate Stats ---
  const totalRevenue = transactions.reduce((s, t) => s + Number(t.total || 0), 0);
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const newCustomers = customers.filter(c => {
    if (!c.joinDate) return false;
    const d = new Date(c.joinDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return d >= thirtyDaysAgo;
  }).length;
  const retentionRate = Math.round((activeCustomers / (customers.length || 1)) * 100);

  const itemsPerPage = 5;
  const inactiveCustomers = customers.filter(c => c.status === "inactive");
  const paginatedInactive = inactiveCustomers.slice((inactivePage - 1) * itemsPerPage, inactivePage * itemsPerPage);

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      await exportPDF({ totalRevenue, activeCustomers, newCustomers, retentionRate, period, monthlyData, customers });
    } finally {
      setExporting(null);
    }
  };

  const handleExportWord = async () => {
    setExporting("word");
    try {
      await exportWord({ totalRevenue, activeCustomers, newCustomers, retentionRate, period, monthlyData, customers });
    } finally {
      setExporting(null);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-24 bg-gray-200 rounded-2xl"></div>)}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Laporan CRM & Analitik" subtitle="Unduh laporan performa bisnis dan pertumbuhan pelanggan">
        <div className="flex gap-2">
          <Button variant="outline" disabled={exporting !== null} loading={exporting === "word"} icon={<FileText size={15} />} onClick={handleExportWord}>Word</Button>
          <Button variant="primary" disabled={exporting !== null} loading={exporting === "pdf"} icon={<Download size={15} />} onClick={handleExportPDF}>PDF</Button>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-left">
        {[
          { label: "Total Pendapatan", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, Icon: TrendingUp, color: "bg-blue-50 text-[#2940D3]" },
          { label: "Pelanggan Aktif", value: `${activeCustomers} member`, Icon: Users, color: "bg-green-50 text-green-500" },
          { label: "Pelanggan Baru", value: `${newCustomers} member`, Icon: UserPlus, color: "bg-purple-50 text-purple-500" },
          { label: "Tingkat Retensi", value: `${retentionRate}%`, Icon: RefreshCw, color: "bg-yellow-50 text-yellow-500" }
        ].map(k => (
          <div key={k.label} className={`${k.color.split(" ")[0]} rounded-2xl p-5 border border-white bg-white text-left`}>
            <k.Icon size={22} className={`${k.color.split(" ")[1]} mb-2.5`} />
            <p className="text-2xl font-bold text-gray-800 leading-none">{k.value}</p>
            <p className="text-xs text-gray-400 mt-2 font-medium">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Period Filter Card */}
      <Card className="mb-4">
        <div className="flex justify-between items-center bg-white">
          <p className="font-bold text-gray-800 text-sm">Visualisasi Tren</p>
          <div className="flex gap-1">
            {["hari", "minggu", "bulan"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all ${period === p ? "bg-[#2940D3] text-white shadow-sm" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>{p}</button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 text-left">
        {/* Recharts Revenue Trends */}
        <Card className="lg:col-span-2">
          <p className="font-bold text-gray-800 mb-1">Tren Pendapatan</p>
          <p className="text-xs text-gray-400 mb-4 bg-white">Estimasi total omzet bersih pengerjaan laundry</p>
          <ChartContainer config={chartConfig} className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(val) => val} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="pendapatan" fill="#2940D3" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Customer Growth Trends */}
        <Card>
          <p className="font-bold text-gray-800 mb-1">Pertumbuhan Pelanggan</p>
          <p className="text-xs text-gray-400 mb-4 bg-white">Registrasi baru member laundry</p>
          <ChartContainer config={chartConfig} className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line type="monotone" dataKey="pelangganBaru" stroke="#2940D3" strokeWidth={2.5} dot={{ fill: "#2940D3" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
        {/* Segment Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2 bg-white">
          <div className="px-5 py-4 border-b border-gray-100 bg-white"><p className="font-bold text-gray-800 text-sm">Analisis Nilai Segmen</p></div>
          <Table headers={["Segmen", "Jumlah Pelanggan", "Total Belanja", "Rata-rata Belanja", "Rata-rata Transaksi"]}>
            {["VIP", "Loyal", "Regular", "New"].map((seg) => {
              const sc = customers.filter(c => c.segment === seg);
              const total = sc.reduce((s, c) => s + Number(c.totalSpent || 0), 0);
              const avg = Math.round(total / (sc.length || 1));
              const avgTrx = Math.round(sc.reduce((s, c) => s + Number(c.totalTransactions || 0), 0) / (sc.length || 1));
              return (
                <tr key={seg} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-800">{seg}</td>
                  <td className="px-5 py-4 text-gray-600">{sc.length} member</td>
                  <td className="px-5 py-4 font-bold text-gray-800">Rp {total.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-4 text-gray-600">Rp {avg.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-4 text-gray-600">{avgTrx}x</td>
                </tr>
              );
            })}
          </Table>
        </div>

        {/* Inactive Customers Alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden bg-white">
          <div className="px-5 py-4 border-b border-gray-100 bg-white"><p className="font-bold text-gray-800 text-sm">Pelanggan Tidak Aktif</p></div>
          <div className="divide-y divide-gray-50">
            {paginatedInactive.map((c) => (
              <div key={c.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 bg-white">
                  <Avatar name={c.customerName} size="md" color="bg-red-50 text-red-500" />
                  <div className="flex-1 min-w-0 bg-white">
                    <p className="font-semibold text-gray-800 text-sm truncate">{c.customerName}</p>
                    <p className="text-xs text-gray-400 truncate">Terakhir: {c.lastTransaction || "-"}</p>
                  </div>
                  <Badge variant="red">Tidak Aktif</Badge>
                </div>
              </div>
            ))}
            {inactiveCustomers.length === 0 && (
              <div className="py-8 text-center text-gray-400">
                <Users size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Semua pelanggan aktif!</p>
              </div>
            )}
          </div>
          {inactiveCustomers.length > 0 && (
            <Pagination
              currentPage={inactivePage}
              totalItems={inactiveCustomers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setInactivePage}
              itemName="pelanggan"
            />
          )}
        </div>
      </div>
    </div>
  );
}