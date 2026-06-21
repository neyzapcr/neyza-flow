import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { FileText, Download, Users, TrendingUp, RefreshCw, UserPlus, Send } from "lucide-react";
import PageHeader from "../components/PageHeader";
import rawCustomersData from "../data/customers.json";
const customersData = rawCustomersData.flatMap((c) => {
  const historyList = c.transactionHistory || [];
  if (historyList.length === 0) {
    return [{
      ...c,
      customerId: c.customerId || String(Math.random()),
      joinDate: c.joinDate || "-",
      totalTransactions: c.totalTransactions !== undefined ? c.totalTransactions : 0,
      totalSpent: c.totalSpent !== undefined ? c.totalSpent : 0,
      points: c.points !== undefined ? c.points : 0,
      segment: c.segment || "New",
      lastTransaction: c.lastTransaction || "-",
      status: c.status || "active",
    }];
  }
  return historyList.map((history) => ({
    ...c,
    customerId: history.customerId || c.customerId || String(Math.random()),
    joinDate: history.joinDate || c.joinDate || "-",
    totalTransactions: history.totalTransactions !== undefined ? history.totalTransactions : (c.totalTransactions || 0),
    totalSpent: history.totalSpent !== undefined ? history.totalSpent : (c.totalSpent || 0),
    points: history.points !== undefined ? history.points : (c.points || 0),
    segment: history.segment || c.segment || "New",
    lastTransaction: history.lastTransaction || c.lastTransaction || "-",
    status: history.status || c.status || "active",
  }));
});
import transactionsData from "../data/transactions.json";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Avatar from "../components/Avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import Pagination from "../components/Pagination";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
async function exportPDF({ totalRevenue, activeCustomers, newCustomers, retentionRate, period, monthlyData }) {
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
    headStyles: { fillColor: [20, 34, 151], halign: "left" }, // Darker blue #142297
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
    const sc = customersData.filter((c) => c.segment === seg);
    const total = sc.reduce((s, c) => s + c.totalSpent, 0);
    const avg = Math.round(total / (sc.length || 1));
    const avgTrx = Math.round(sc.reduce((s, c) => s + c.totalTransactions, 0) / (sc.length || 1));
    const pct = Math.round((sc.length / customersData.length) * 100);

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
  const inactiveCustomers = customersData.filter((c) => c.status === "inactive");
  const inactiveRows = inactiveCustomers.map(c => [
    c.customerName,
    "Tidak Aktif",
    c.lastTransaction
  ]);

  doc.autoTable({
    startY: nextY + 5,
    head: [inactiveHeaders],
    body: inactiveRows,
    theme: "striped",
    headStyles: { fillColor: [239, 68, 68], halign: "left" }, // red-500
    styles: { font: "helvetica", fontSize: 9 },
    margin: { left: 14, right: 14 }
  });

  doc.save(`Laporan_CRM_${period}_${new Date().toISOString().split("T")[0]}.pdf`);
}

function exportWord({ totalRevenue, activeCustomers, newCustomers, retentionRate, period, monthlyData }) {
  const dateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const segmentRowsHtml = ["VIP", "Loyal", "Regular", "New"].map((seg) => {
    const sc = customersData.filter((c) => c.segment === seg);
    const total = sc.reduce((s, c) => s + c.totalSpent, 0);
    const avg = Math.round(total / (sc.length || 1));
    const avgTrx = Math.round(sc.reduce((s, c) => s + c.totalTransactions, 0) / (sc.length || 1));
    const pct = Math.round((sc.length / customersData.length) * 100);

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

  const trendRowsHtml = (monthlyData || []).map(d => `
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">${d.month}</td>
      <td style="padding:8px; border:1px solid #ddd;">${d.pelangganBaru} Pelanggan</td>
      <td style="padding:8px; border:1px solid #ddd;">${d.transaksi} Transaksi</td>
      <td style="padding:8px; border:1px solid #ddd;">Rp ${d.pendapatan.toLocaleString("id-ID")}</td>
    </tr>
  `).join("");

  const inactiveCustomers = customersData.filter((c) => c.status === "inactive");
  const inactiveRowsHtml = inactiveCustomers.map(c => `
    <tr>
      <td style="padding:8px; border:1px solid #ddd;">${c.customerName}</td>
      <td style="padding:8px; border:1px solid #ddd; color:red;">Tidak Aktif</td>
      <td style="padding:8px; border:1px solid #ddd;">${c.lastTransaction}</td>
    </tr>
  `).join("");

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>Laporan CRM  Netto Laundry</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; }
        h1 { color: #2940D3; border-bottom: 2px solid #2940D3; padding-bottom: 5px; }
        h2 { color: #142297; margin-top: 20px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th { background-color: #2940D3; color: white; text-align: left; padding: 10px; font-weight: bold; }
        td { padding: 10px; border: 1px solid #ddd; }
        .meta { color: #666; font-size: 12px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>LAPORAN CRM - Netto LAUNDRY</h1>
      <p class="meta">Dicetak pada: ${dateStr} | Filter Periode: ${period.toUpperCase()}</p>

      <h2>Ringkasan Performa Bisnis</h2>
      <table>
        <thead>
          <tr>
            <th style="background-color:#2940D3; color:white;">Indikator Performa</th>
            <th style="background-color:#2940D3; color:white;">Nilai Realisasi</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><b>Total Pendapatan</b></td><td>Rp ${totalRevenue.toLocaleString("id-ID")}</td></tr>
          <tr><td><b>Pelanggan Aktif</b></td><td>${activeCustomers} Pelanggan</td></tr>
          <tr><td><b>Pelanggan Baru</b></td><td>${newCustomers} Pelanggan</td></tr>
          <tr><td><b>Tingkat Retensi</b></td><td>${retentionRate}% dari total pelanggan</td></tr>
        </tbody>
      </table>

      <h2>Detail Tren Aktivitas (${period.toUpperCase()})</h2>
      <table>
        <thead>
          <tr>
            <th style="background-color:#142297; color:white;">Periode / Label</th>
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

  const blob = new Blob(['\\ufeff' + htmlContent], {
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
  const [period, setPeriod] = useState("bulan");
  const [exporting, setExporting] = useState(null);
  const [inactivePage, setInactivePage] = useState(1);

  const maxDateStr = transactionsData.map(t => t.date).filter(Boolean).sort().pop() || "2026-05-31";
  const [yr, mt, dy] = maxDateStr.split("-").map(Number);

  let monthlyData = [];

  if (period === "hari") {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(yr, mt - 1, dy - (6 - i));
      return d;
    });

    monthlyData = days.map((date) => {
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const dayTrxs = transactionsData.filter((t) => t.date === dateStr);
      const dayCusts = customersData.filter((c) => c.joinDate === dateStr);
      return {
        month: date.toLocaleDateString("id-ID", { weekday: "short" }),
        pelangganBaru: dayCusts.length,
        transaksi: dayTrxs.length,
        pendapatan: dayTrxs.reduce((s, t) => s + t.total, 0),
      };
    });
  } else if (period === "minggu") {
    const weeks = Array.from({ length: 4 }, (_, i) => {
      const wEnd = new Date(yr, mt - 1, dy - (3 - i) * 7);
      const wStart = new Date(wEnd.getTime() - 6 * 24 * 60 * 60 * 1000);
      return { start: wStart, end: wEnd, label: `Mng ${i + 1}` };
    });

    monthlyData = weeks.map((w) => {
      const weekTrxs = transactionsData.filter((t) => {
        if (!t.date) return false;
        const d = new Date(t.date);
        return d >= w.start && d <= w.end;
      });
      const weekCusts = customersData.filter((c) => {
        if (!c.joinDate) return false;
        const d = new Date(c.joinDate);
        return d >= w.start && d <= w.end;
      });
      return {
        month: w.label,
        pelangganBaru: weekCusts.length,
        transaksi: weekTrxs.length,
        pendapatan: weekTrxs.reduce((s, t) => s + t.total, 0),
      };
    });
  } else {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(yr, mt - 1 - (5 - i), 1);
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleDateString("id-ID", { month: "short" })
      };
    });

    monthlyData = months.map((m) => {
      const monthTrxs = transactionsData.filter((t) => {
        if (!t.date) return false;
        const [y, mNum] = t.date.split("-").map(Number);
        return y === m.year && (mNum - 1) === m.month;
      });
      const monthCusts = customersData.filter((c) => {
        if (!c.joinDate) return false;
        const [y, mNum] = c.joinDate.split("-").map(Number);
        return y === m.year && (mNum - 1) === m.month;
      });
      return {
        month: `${m.label} ${String(m.year).substring(2)}`,
        pelangganBaru: monthCusts.length,
        transaksi: monthTrxs.length,
        pendapatan: monthTrxs.reduce((s, t) => s + t.total, 0),
      };
    });
  }

  const totalRevenue = transactionsData.reduce((s, t) => s + t.total, 0);
  const activeCustomers = customersData.filter((c) => c.status === "active").length;
  const newCustomers = customersData.filter((c) => c.joinDate >= "2025-01-01").length;
  const retentionRate = Math.round((activeCustomers / customersData.length) * 100);

  const handleExport = async (type) => {
    setExporting(type);
    const args = { totalRevenue, activeCustomers, newCustomers, retentionRate, period, monthlyData };
    type === "pdf" ? await exportPDF(args) : exportWord(args);
    setExporting(null);
  };

  return (
    <div>
      <PageHeader title="Laporan CRM" subtitle="Analisis performa bisnis dan data pelanggan">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {["hari", "minggu", "bulan"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? "bg-white text-[#2940D3] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {p}
              </button>
            ))}
          </div>
          <Button variant="danger" size="sm" icon={<FileText size={13} />} loading={exporting === "pdf"} onClick={() => handleExport("pdf")}>PDF</Button>
          <Button variant="secondary" size="sm" icon={<Download size={13} />} loading={exporting === "word"} onClick={() => handleExport("word")}>Word</Button>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Pendapatan", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, Icon: TrendingUp, sub: "↑ 12% vs bulan lalu", subColor: "text-green-500", color: "bg-blue-50", iconColor: "text-[#2940D3]" },
          { label: "Pelanggan Aktif", value: activeCustomers, Icon: Users, sub: `${retentionRate}% retensi`, subColor: "text-[#2940D3]", color: "bg-green-50", iconColor: "text-green-500" },
          { label: "Pelanggan Baru", value: newCustomers, Icon: UserPlus, sub: "Tahun 2025", subColor: "text-purple-500", color: "bg-purple-50", iconColor: "text-purple-500" },
          { label: "Tingkat Retensi", value: `${retentionRate}%`, Icon: RefreshCw, sub: "Pelanggan kembali", subColor: "text-orange-500", color: "bg-orange-50", iconColor: "text-orange-500" },
        ].map((s) => (
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
        <Card>
          <p className="font-bold text-gray-800 mb-1">Tren Pendapatan</p>
          <p className="text-xs text-gray-400 mb-4">
            {period === "hari" ? "Pendapatan per hari (7 hari terakhir)" : period === "minggu" ? "Pendapatan per minggu (4 minggu terakhir)" : "Pendapatan per bulan (6 bulan terakhir)"}
          </p>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={monthlyData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />} />
              <Bar dataKey="pendapatan" fill="var(--color-pendapatan)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>
        <Card>
          <p className="font-bold text-gray-800 mb-1">Pertumbuhan Pelanggan</p>
          <p className="text-xs text-gray-400 mb-4">
            {period === "hari" ? "Pelanggan baru per hari (7 hari terakhir)" : period === "minggu" ? "Pelanggan baru per minggu (4 minggu terakhir)" : "Pelanggan baru per bulan (6 bulan terakhir)"}
          </p>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="pelangganBaru" stroke="var(--color-pelangganBaru)" strokeWidth={2.5} dot={{ fill: "var(--color-pelangganBaru)", r: 4 }} />
            </LineChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Segment Report Table */}
      <Card className="mb-4">
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
                    <td className="px-4 py-3"><Badge variant={seg}>{seg}</Badge></td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{sc.length}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">Rp {total.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-gray-600">Rp {avg.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-gray-600">{avgTrx}x</td>
                    <td className="px-4 py-3"><ProgressBar value={pct} height="sm" className="w-16" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inactive Reminder */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-gray-800">Pelanggan Tidak Aktif</p>
            <p className="text-xs text-gray-400">Tidak bertransaksi lebih dari 30 hari</p>
          </div>
          <Button variant="ghost" size="sm" icon={<Send size={13} />}>Kirim Reminder</Button>
        </div>
        <div className="space-y-3">
          {(() => {
            const inactiveCustomers = customersData.filter((c) => c.status === "inactive");
            const paginatedInactive = inactiveCustomers.slice((inactivePage - 1) * 5, inactivePage * 5);
            return (
              <>
                {paginatedInactive.map((c) => (
                  <div key={c.customerId} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.customerName} size="md" color="bg-red-100" className="text-red-500" />
                      <div><p className="font-semibold text-sm">{c.customerName}</p><p className="text-xs text-gray-500">Terakhir: {c.lastTransaction}</p></div>
                    </div>
                    <Button size="sm" icon={<Send size={11} />}>Pesan</Button>
                  </div>
                ))}
                <Pagination
                  currentPage={inactivePage}
                  totalItems={inactiveCustomers.length}
                  itemsPerPage={5}
                  onPageChange={setInactivePage}
                  itemName="pelanggan tidak aktif"
                />
              </>
            );
          })()}
        </div>
      </Card>
    </div>
  );
}