import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { DollarSign, Users, ClipboardList, Star, Plus, Check } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { getCustomers, createCustomer } from "../services/CustomerApi";
import { getTransactions, createTransaction, syncCustomerStats } from "../services/TransactionApi";
import { getFeedback } from "../services/FeedbackApi";
import { createNotification } from "../services/NotificationApi";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Table from "../components/Table";
import Input from "../components/Input";
import Select from "../components/Select";
import TextArea from "../components/TextArea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { Combobox } from "../components/ui/combobox";

// Helper — kirim toast tanpa import context
const toast = (type, title, desc, duration) =>
  window.dispatchEvent(new CustomEvent("addToast", { detail: { type, title, desc, duration } }));

// ── Konfigurasi & Status ──────────────────────────────────────────────────────
const statusMap = { selesai: "green", diproses: "blue", menunggu: "yellow" };
const SERVICES = ["Cuci + Setrika", "Cuci Kering", "Cuci + Setrika + Parfum", "Cuci Basah", "Setrika Saja"];
const PAYMENT_METHODS = ["Cash", "Transfer", "QRIS"];
const priceMap = {
  "Cuci + Setrika": 8000,
  "Cuci Kering": 7000,
  "Cuci + Setrika + Parfum": 12000,
  "Cuci Basah": 6000,
  "Setrika Saja": 5000,
};

const PIE_COLORS = ["#2940D3", "#142297", "#7DD3F0", "#3ABDE8", "#A5F3FC"];

const chartConfig = {
  thisWeek: { label: "Minggu Ini", color: "#2940D3" },
  lastWeek: { label: "Minggu Lalu", color: "#142297" },
};

const pieChartConfig = {
  value: { label: "Porsi" },
  "Cuci + Setrika": { label: "Cuci + Setrika", color: "#2940D3" },
  "Cuci Kering": { label: "Cuci Kering", color: "#142297" },
  "Cuci + Setrika + Parfum": { label: "Cuci + Setrika + Parfum", color: "#7DD3F0" },
  "Cuci Basah": { label: "Cuci Basah", color: "#3ABDE8" },
  "Setrika Saja": { label: "Setrika Saja", color: "#A5F3FC" },
};

const Legend = ({ period }) => {
  const getLabels = () => {
    if (period === "hari") return { thisLabel: "7 Hari Ini", lastLabel: "7 Hari Lalu" };
    if (period === "minggu") return { thisLabel: "4 Minggu Ini", lastLabel: "4 Minggu Lalu" };
    return { thisLabel: "6 Bulan Ini", lastLabel: "Tahun Lalu" };
  };
  const { thisLabel, lastLabel } = getLabels();

  return (
    <div className="flex gap-4 mt-2">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-[#2940D3]"></span>
        <span className="text-xs text-gray-500">{thisLabel}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-[#142297]"></span>
        <span className="text-xs text-gray-500">{lastLabel}</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [period, setPeriod] = useState("minggu");
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTambah, setShowTambah] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localForm, setLocalForm] = useState({});
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTransaction, setCreatedTransaction] = useState(null);

  // States for loyalty voucher auto-apply & validation
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [verifyCodeInput, setVerifyCodeInput] = useState("");
  const [verifiedVoucher, setVerifiedVoucher] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    async function checkActiveVoucher() {
      if (!selectedCustomerId || selectedCustomerId === "new_customer") {
        setActiveVoucher(null);
        return;
      }
      try {
        const cust = customers.find(c => c.customerId === selectedCustomerId);
        if (!cust) {
          setActiveVoucher(null);
          return;
        }

        const { data, error } = await supabase
          .from("loyalty_transactions")
          .select("*")
          .eq("customerId", cust.id)
          .eq("type", "Tukar")
          .like("description", "Klaim Reward:%Status: Ready to Use")
          .order("createdAt", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const desc = data[0].description;
          const parts = desc.split(" | ");
          const name = parts[0].replace("Klaim Reward: ", "");
          const discount = parseInt(parts[1].replace("Discount: ", "").replace("%", ""), 10);
          const code = parts[2].replace("Code: ", "");
          const expiry = parts[3].replace("Expiry: ", "");
          setActiveVoucher({ id: data[0].id, name, discount, code, expiry });
        } else {
          setActiveVoucher(null);
        }
      } catch (err) {
        console.error("Failed to check active voucher:", err);
        setActiveVoucher(null);
      }
    }
    checkActiveVoucher();
  }, [selectedCustomerId, customers]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const custs = await getCustomers();
        const trxs = await getTransactions();
        const fbs = await getFeedback();
        setCustomers(custs);
        setTransactions(trxs);
        setFeedback(fbs);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Perhitungan Data Grafik Dinamis dari Database ────────────────────────
  const maxDateStr = transactions.map(t => t.receivedDate || t.date).filter(Boolean).sort().pop() || "2026-06-30";
  const [yr, mt, dy] = maxDateStr.split("-").map(Number);

  let revenueData = [];
  let orderTrendData = [];

  if (period === "hari") {
    // Tampilkan 7 hari terakhir vs 7 hari sebelumnya
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(yr, mt - 1, dy - (6 - i));
      return d;
    });

    revenueData = days.map((date) => {
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const prevDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
      const prevDateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(prevDate.getDate()).padStart(2, "0")}`;

      const thisWeekVal = transactions.filter(t => (t.receivedDate || t.date) === dateStr).reduce((s, t) => s + Number(t.total), 0);
      const lastWeekVal = transactions.filter(t => (t.receivedDate || t.date) === prevDateStr).reduce((s, t) => s + Number(t.total), 0);

      return {
        day: date.toLocaleDateString("id-ID", { weekday: "short" }),
        thisWeek: thisWeekVal,
        lastWeek: lastWeekVal,
      };
    });

    orderTrendData = days.map((date) => {
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const prevDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
      const prevDateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(prevDate.getDate()).padStart(2, "0")}`;

      const thisWeekVal = transactions.filter(t => (t.receivedDate || t.date) === dateStr).length;
      const lastWeekVal = transactions.filter(t => (t.receivedDate || t.date) === prevDateStr).length;

      return {
        day: date.toLocaleDateString("id-ID", { weekday: "short" }),
        thisWeek: thisWeekVal,
        lastWeek: lastWeekVal,
      };
    });
  } else if (period === "minggu") {
    // Tampilkan 4 minggu terakhir vs 4 minggu sebelumnya
    const weeks = Array.from({ length: 4 }, (_, i) => {
      const wEnd = new Date(yr, mt - 1, dy - (3 - i) * 7);
      const wStart = new Date(wEnd.getTime() - 6 * 24 * 60 * 60 * 1000);
      return { start: wStart, end: wEnd, label: `Mng ${i + 1}` };
    });

    const getRangeStats = (start, end) => {
      const txs = transactions.filter(t => {
        const tDate = t.receivedDate || t.date;
        if (!tDate) return false;
        const d = new Date(tDate);
        return d >= start && d <= end;
      });
      return {
        revenue: txs.reduce((s, t) => s + Number(t.total), 0),
        count: txs.length
      };
    };

    revenueData = weeks.map((w) => {
      const thisPeriod = getRangeStats(w.start, w.end);
      const prevStart = new Date(w.start.getTime() - 28 * 24 * 60 * 60 * 1000);
      const prevEnd = new Date(w.end.getTime() - 28 * 24 * 60 * 60 * 1000);
      const lastPeriod = getRangeStats(prevStart, prevEnd);

      return {
        day: w.label,
        thisWeek: thisPeriod.revenue,
        lastWeek: lastPeriod.revenue,
      };
    });

    orderTrendData = weeks.map((w) => {
      const thisPeriod = getRangeStats(w.start, w.end);
      const prevStart = new Date(w.start.getTime() - 28 * 24 * 60 * 60 * 1000);
      const prevEnd = new Date(w.end.getTime() - 28 * 24 * 60 * 60 * 1000);
      const lastPeriod = getRangeStats(prevStart, prevEnd);

      return {
        day: w.label,
        thisWeek: thisPeriod.count,
        lastWeek: lastPeriod.count,
      };
    });
  } else {
    // period === "bulan"
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(yr, mt - 1 - (5 - i), 1);
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleDateString("id-ID", { month: "short" })
      };
    });

    const getMonthStats = (year, month) => {
      const txs = transactions.filter(t => {
        const tDate = t.receivedDate || t.date;
        if (!tDate) return false;
        const [y, m] = tDate.split("-").map(Number);
        return y === year && (m - 1) === month;
      });
      return {
        revenue: txs.reduce((s, t) => s + Number(t.total), 0),
        count: txs.length
      };
    };

    revenueData = months.map((m) => {
      const thisPeriod = getMonthStats(m.year, m.month);
      const lastPeriod = getMonthStats(m.year - 1, m.month);

      return {
        day: `${m.label} ${String(m.year).substring(2)}`,
        thisWeek: thisPeriod.revenue,
        lastWeek: lastPeriod.revenue,
      };
    });

    orderTrendData = months.map((m) => {
      const thisPeriod = getMonthStats(m.year, m.month);
      const lastPeriod = getMonthStats(m.year - 1, m.month);

      return {
        day: `${m.label} ${String(m.year).substring(2)}`,
        thisWeek: thisPeriod.count,
        lastWeek: lastPeriod.count,
      };
    });
  }

  const currentPeriodRevenue = revenueData.reduce((s, d) => s + d.thisWeek, 0);
  const lastPeriodRevenue = revenueData.reduce((s, d) => s + d.lastWeek, 0);
  const revenueDiff = lastPeriodRevenue ? ((currentPeriodRevenue - lastPeriodRevenue) / lastPeriodRevenue) * 100 : 0;

  const currentPeriodOrders = orderTrendData.reduce((s, d) => s + d.thisWeek, 0);
  const lastPeriodOrders = orderTrendData.reduce((s, d) => s + d.lastWeek, 0);
  const ordersDiff = lastPeriodOrders ? ((currentPeriodOrders - lastPeriodOrders) / lastPeriodOrders) * 100 : 0;

  const serviceCounts = {};
  transactions.forEach(t => t.service && (serviceCounts[t.service] = (serviceCounts[t.service] || 0) + 1));
  const serviceData = Object.entries(serviceCounts).map(([name, count]) => ({
    name,
    value: Math.round((count / (transactions.length || 1)) * 100)
  })).sort((a, b) => b.value - a.value);

  const ratingData = ["Kebersihan", "Kecepatan", "Pelayanan"].map((cat, idx) => {
    const fbs = feedback.filter(f => f.category === cat);
    const avg = fbs.length ? fbs.reduce((s, f) => s + f.rating, 0) / fbs.length : 4;
    return { name: cat, value: Math.round((avg / 5) * 100), color: idx % 2 === 0 ? "#2940D3" : "#142297" };
  });

  const handleInputChange = (name, val) => {
    setLocalForm(prev => ({ ...prev, [name]: val }));
  };

  const handleCustomerSelect = (val) => {
    setSelectedCustomerId(val);
    const cust = val !== "new_customer" && customers.find(c => c.customerId === val);
    setLocalForm(prev => ({
      ...prev,
      customerName: cust ? cust.customerName : "",
      phone: cust ? cust.phone : "",
    }));
  };

  const seen = new Set();
  const customerOptions = [
    { label: "+ Tambah Pelanggan Baru", value: "new_customer" },
    ...customers.filter(c => c.customerName && !seen.has(c.customerName) && seen.add(c.customerName))
                .map(c => ({ label: `${c.customerName} (${c.phone})`, value: c.customerId }))
  ];

  const weight = parseFloat(localForm.weight) || 0;
  const service = localForm.service || SERVICES[0];
  const price = priceMap[service] || 8000;
  const baseTotal = Math.round(weight * price);

  const selectedCust = selectedCustomerId && selectedCustomerId !== "new_customer"
    ? customers.find(c => c.customerId === selectedCustomerId)
    : null;
  const points = selectedCust ? (selectedCust.points || 0) : 0;

  // 1. Promo berdasarkan nominal transaksi
  let promoNominalPct = 0;
  let promoNominalLabel = "";
  if (baseTotal >= 500000) {
    promoNominalPct = 0.15;
    promoNominalLabel = "Diskon Transaksi 15%";
  } else if (baseTotal >= 250000) {
    promoNominalPct = 0.10;
    promoNominalLabel = "Diskon Transaksi 10%";
  }

  // 2. Tentukan promo yang digunakan
  let appliedDiscountPct = 0;
  let appliedPromoLabel = "";
  let promoType = ""; // "VOUCHER" or "NOMINAL"

  if (activeVoucher) {
    appliedDiscountPct = activeVoucher.discount / 100;
    appliedPromoLabel = `Voucher: ${activeVoucher.name} (${activeVoucher.code})`;
    promoType = "VOUCHER";
  } else if (promoNominalPct > 0) {
    appliedDiscountPct = promoNominalPct;
    appliedPromoLabel = promoNominalLabel;
    promoType = "NOMINAL";
  }

  const discountAmount = Math.round(baseTotal * appliedDiscountPct);
  const total = baseTotal - discountAmount;

  const totalRevenue = transactions.reduce((s, t) => s + Number(t.total), 0);
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const avgRating = feedback.length ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : "5.0";
  const pendingOrders = transactions.filter((t) => t.status !== "selesai").length;

  // Verification helper functions for in-store voucher redemption
  const handleVerifyVoucher = async () => {
    if (!verifyCodeInput.trim()) return;
    setVerifyLoading(true);
    setVerifiedVoucher(null);
    try {
      const { data, error } = await supabase
        .from("loyalty_transactions")
        .select("id, description, customerId, points")
        .eq("type", "Tukar")
        .like("description", `%Code: ${verifyCodeInput.trim()}%`);

      if (error) throw error;

      if (!data || data.length === 0) {
        toast("error", "Voucher Tidak Ditemukan", "Tidak ada voucher dengan kode tersebut di database.");
        setVerifyLoading(false);
        return;
      }

      const record = data[0];
      const desc = record.description;
      const parts = desc.split(" | ");
      const name = parts[0].replace("Klaim Reward: ", "");
      const discount = parseInt(parts[1].replace("Discount: ", "").replace("%", ""), 10);
      const code = parts[2].replace("Code: ", "");
      const expiry = parts[3].replace("Expiry: ", "");
      const status = parts[4].replace("Status: ", "");

      const { data: cust, error: custErr } = await supabase
        .from("customers")
        .select("customerName, customerCode")
        .eq("id", record.customerId)
        .single();

      if (custErr) throw custErr;

      setVerifiedVoucher({
        id: record.id,
        customerId: record.customerId,
        customerName: cust?.customerName || "Member",
        customerCode: cust?.customerCode || "-",
        name,
        discount,
        code,
        expiry,
        status,
        raw: desc
      });
    } catch (err) {
      console.error("Verification error:", err);
      toast("error", "Gagal Memverifikasi", "Terjadi kesalahan saat memproses data voucher.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleUseVoucherInStore = async () => {
    if (!verifiedVoucher || verifiedVoucher.status !== "Ready to Use") return;
    setVerifyLoading(true);
    try {
      const updatedDesc = verifiedVoucher.raw.replace("Status: Ready to Use", "Status: Used");
      const { error } = await supabase
        .from("loyalty_transactions")
        .update({ description: updatedDesc })
        .eq("id", verifiedVoucher.id);

      if (error) throw error;

      await syncCustomerStats(verifiedVoucher.customerId);

      const custs = await getCustomers();
      setCustomers(custs);

      toast("success", "Voucher Berhasil Digunakan", `Voucher ${verifiedVoucher.code} telah ditandai sebagai Used.`);
      setVerifiedVoucher(prev => ({ ...prev, status: "Used", raw: updatedDesc }));
      setVerifyCodeInput("");
    } catch (err) {
      console.error("Error updating voucher status:", err);
      toast("error", "Gagal Menggunakan Voucher", "Terjadi kesalahan saat memperbarui database.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localForm.customerName || !localForm.phone || !localForm.weight) return;
    setSaved(true);

    try {
      let custId = selectedCustomerId;
      let targetCustomer = null;

      if (selectedCustomerId === "new_customer" || !selectedCustomerId) {
        const phoneKey = localForm.phone || "";
        const emailKey = localForm.email || "";

        // First find in local state
        targetCustomer = customers.find(c => (phoneKey && c.phone === phoneKey) || (emailKey && c.email === emailKey));

        if (!targetCustomer) {
          // Verify with database directly
          const { data: dbCust, error: dbCustErr } = await supabase
            .from("customers")
            .select("*")
            .or(`phone.eq.${phoneKey},email.eq.${emailKey}`)
            .maybeSingle();

          if (dbCustErr) throw dbCustErr;
          if (dbCust) {
            targetCustomer = {
              ...dbCust,
              customerId: dbCust.customerCode
            };
          }
        }

        if (targetCustomer) {
          custId = targetCustomer.customerId;
        } else {
          // Create new customer
          const newCustId = `CUST-${String(Math.floor(1000 + Math.random() * 9000))}`;
          const newCust = {
            customerId: newCustId,
            userId: null,
            customerName: localForm.customerName,
            phone: localForm.phone,
            email: localForm.email || null,
            address: localForm.address || null,
            customerType: localForm.customerType || "Umum",
            maritalStatus: null,
            joinDate: new Date().toISOString().split("T")[0],
            points: 0,
            totalTransactions: 0,
            totalSpent: 0,
            segment: "New",
            status: "active"
          };
          const created = await createCustomer(newCust);
          custId = created.customerId;
          targetCustomer = created;
          setCustomers([created, ...customers]);
        }
      } else {
        targetCustomer = customers.find(c => c.customerId === selectedCustomerId);
      }

      const trxId = `TRX-${String(Math.floor(100000 + Math.random() * 900000))}`;
      const service = localForm.service || SERVICES[0];
      const weight = parseFloat(localForm.weight);
      const price = priceMap[service] || 8000;
      const baseTotal = Math.round(weight * price);
      const paymentMethod = localForm.paymentMethod || PAYMENT_METHODS[0];

      // Calculate promo details for this customer using activeVoucher if available
      let finalDiscountPct = 0;
      let promoMetadata = "";

      if (activeVoucher) {
        finalDiscountPct = activeVoucher.discount / 100;
        promoMetadata = `[PROMO_VOUCHER_USED:${activeVoucher.code}] [PROMO_TYPE:VOUCHER] [PROMO_DISCOUNT:${activeVoucher.discount}]`;
      } else {
        let pNominalPct = 0;
        if (baseTotal >= 500000) pNominalPct = 0.15;
        else if (baseTotal >= 250000) pNominalPct = 0.10;

        if (pNominalPct > 0) {
          finalDiscountPct = pNominalPct;
          promoMetadata = `[PROMO_TYPE:NOMINAL] [PROMO_DISCOUNT:${pNominalPct * 100}]`;
        }
      }

      const discountAmt = Math.round(baseTotal * finalDiscountPct);
      const totalCost = baseTotal - discountAmt;

      const promoText = promoMetadata ? `\n${promoMetadata}` : "";
      const notes = localForm.notes ? `${localForm.notes}${promoText}` : promoMetadata;

      const newTrx = {
        transactionId: trxId,
        customerId: custId,
        customerName: localForm.customerName,
        service,
        weight,
        pricePerKg: price,
        total: totalCost,
        paymentMethod,
        receivedDate: new Date().toISOString().split("T")[0],
        estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        completedDate: null,
        status: "menunggu",
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.origin + '/tracking/' + trxId)}`,
        createdBy: user?.id || null,
        notes: notes
      };

      const createdTrx = await createTransaction(newTrx);

      // If activeVoucher was used, update the voucher status to Used in database
      if (activeVoucher) {
        const { data: voucherRecord, error: getVoucherErr } = await supabase
          .from("loyalty_transactions")
          .select("description")
          .eq("id", activeVoucher.id)
          .single();

        if (!getVoucherErr && voucherRecord) {
          const updatedDesc = voucherRecord.description.replace("Status: Ready to Use", "Status: Used");
          const { error: updVoucherErr } = await supabase
            .from("loyalty_transactions")
            .update({ description: updatedDesc })
            .eq("id", activeVoucher.id);

          if (updVoucherErr) {
            console.error("Failed to mark voucher as Used:", updVoucherErr.message);
          }
        }
        
        // Reset active voucher state
        setActiveVoucher(null);
      }

      // Create notification
      if (targetCustomer) {
        try {
          await createNotification({
            customerId: targetCustomer.id,
            transactionId: createdTrx.id,
            title: "Pesanan Berhasil Dibuat",
            message: "Pesanan laundry Anda telah diterima dan sedang menunggu proses.",
            type: "Tracking"
          });
        } catch (notifErr) {
          console.error("Failed to create notification:", notifErr);
        }
      }

      // Reload customers to get fresh points/stats
      const custs = await getCustomers();
      setCustomers(custs);

      toast("laundry", "Cucian Baru Ditambahkan!", `${localForm.customerName} · ${service} · ${weight} kg · Rp ${totalCost.toLocaleString("id-ID")}`, 6000);
      
      // Update local state instantly without full reload
      setTransactions([createdTrx, ...transactions]);
      setCreatedTransaction(createdTrx);
      
      // Close forms and open success modal
      setShowTambah(false);
      setSaved(false);
      setLocalForm({});
      setSelectedCustomerId("");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to add transaction:", err);
      setSaved(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-28 bg-gray-200 rounded-2xl"></div>
          <div className="h-28 bg-gray-200 rounded-2xl"></div>
          <div className="h-28 bg-gray-200 rounded-2xl"></div>
          <div className="h-28 bg-gray-200 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[350px] bg-gray-200 rounded-2xl"></div>
          <div className="h-[350px] bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Selamat datang kembali, Admin">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {["hari", "minggu", "bulan"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? "bg-white text-[#2940D3] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{p}</button>
            ))}
          </div>
          <button onClick={() => { setShowTambah(true); setSelectedCustomerId(""); setLocalForm({ service: SERVICES[0], paymentMethod: PAYMENT_METHODS[0] }); }} className="flex items-center gap-1.5 px-4 py-2 bg-[#142297] text-white rounded-xl text-sm font-semibold hover:bg-[#155a6b] transition-colors shadow-sm">
            <Plus size={15} /> Tambah Cucian
          </button>
        </div>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard Icon={DollarSign} iconBg="bg-[#2940D3]/10" label="Total Pendapatan" value={`Rp ${totalRevenue.toLocaleString("id-ID")}`} sub="↑ 2.1% vs minggu lalu" subColor="text-green-500" />
        <StatCard Icon={Users} iconBg="bg-[#142297]/10" iconColor="text-[#142297]" label="Pelanggan Aktif" value={activeCustomers} sub="↑ 3 pelanggan baru" subColor="text-green-500" />
        <StatCard Icon={ClipboardList} iconBg="bg-orange-50" iconColor="text-orange-500" label="Order Pending" value={pendingOrders} sub="Perlu diproses" subColor="text-orange-500" />
        <StatCard Icon={Star} iconBg="bg-yellow-50" iconColor="text-yellow-500" label="Rata-rata Rating" value={`${avgRating}/5`} sub="Dari pelanggan" subColor="text-yellow-500" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Pendapatan ({period === "hari" ? "7 Hari Ini" : period === "minggu" ? "4 Minggu Ini" : "6 Bulan Ini"})</p>
              <p className="text-2xl font-bold text-gray-800">Rp {currentPeriodRevenue.toLocaleString("id-ID")}</p>
              <p className={`text-xs font-medium mt-0.5 ${revenueDiff >= 0 ? "text-green-500" : "text-red-500"}`}>
                {revenueDiff >= 0 ? "↑" : "↓"} {Math.abs(revenueDiff).toFixed(1)}% vs {period === "hari" ? "7 hari lalu" : period === "minggu" ? "4 minggu lalu" : "tahun lalu"}
              </p>
            </div>
            <Link to="/reports" className="text-xs text-[#2940D3] font-semibold hover:underline">Lihat Laporan</Link>
          </div>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={revenueData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />} />
              <Bar dataKey="thisWeek" fill="var(--color-thisWeek)" radius={[4, 4, 0, 0]} name="Minggu Ini" />
              <Bar dataKey="lastWeek" fill="var(--color-lastWeek)" radius={[4, 4, 0, 0]} name="Minggu Lalu" />
            </BarChart>
          </ChartContainer>
          <Legend period={period} />
        </Card>

        {/* Service Pie */}
        <Card>
          <p className="text-xs text-gray-400 font-medium">Distribusi Layanan</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5 mb-4">Jenis Layanan</p>
          <ChartContainer config={pieChartConfig} className="h-[160px] w-full">
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {serviceData.map((s, i) => <Cell key={i} fill={pieChartConfig[s.name]?.color || PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
            </PieChart>
          </ChartContainer>
          <div className="space-y-2 mt-2">
            {serviceData.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieChartConfig[s.name]?.color || PIE_COLORS[i % PIE_COLORS.length] }}></span>
                  <span className="text-xs text-gray-500">{s.name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rating Bars */}
        <Card>
          <p className="text-xs text-gray-400 font-medium mb-1">Rating Layanan</p>
          <p className="text-sm font-bold text-gray-800 mb-4">Kepuasan Pelanggan</p>
          <div className="space-y-4">
            {ratingData.map((r, i) => <ProgressBar key={i} label={r.name} value={r.value} color={r.color} showLabel />)}
          </div>
        </Card>

        {/* Order Trend Line */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Tren Order ({period === "hari" ? "7 Hari Ini" : period === "minggu" ? "4 Minggu Ini" : "6 Bulan Ini"})</p>
              <p className="text-2xl font-bold text-gray-800">{currentPeriodOrders} Order</p>
              <p className={`text-xs font-medium mt-0.5 ${ordersDiff >= 0 ? "text-green-500" : "text-red-500"}`}>
                {ordersDiff >= 0 ? "↑" : "↓"} {Math.abs(ordersDiff).toFixed(1)}% vs {period === "hari" ? "7 hari lalu" : period === "minggu" ? "4 minggu lalu" : "tahun lalu"}
              </p>
            </div>
            <Link to="/reports" className="text-xs text-[#2940D3] font-semibold hover:underline">Lihat Laporan</Link>
          </div>
          <ChartContainer config={chartConfig} className="h-[160px] w-full">
            <LineChart data={orderTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="thisWeek" stroke="var(--color-thisWeek)" strokeWidth={2.5} dot={false} name="Minggu Ini" />
              <Line type="monotone" dataKey="lastWeek" stroke="var(--color-lastWeek)" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Minggu Lalu" />
            </LineChart>
          </ChartContainer>
          <Legend period={period} />
        </Card>
      </div>

      {/* Verifikasi Voucher Loyalty Card */}
      <Card className="mt-4 text-left">
        <p className="text-xs text-gray-400 font-medium mb-1 bg-white">Layanan Toko</p>
        <p className="text-sm font-bold text-gray-800 mb-4 bg-white font-Montserrat">Verifikasi & Validasi Voucher Loyalty</p>
        
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl bg-white">
          <Input
            placeholder="Masukkan Kode Voucher (contoh: LY-100-A4B9)..."
            value={verifyCodeInput}
            onChange={(e) => setVerifyCodeInput(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleVerifyVoucher}
            variant="primary"
            className="h-10 px-5 font-semibold cursor-pointer"
          >
            Cari & Verifikasi
          </Button>
        </div>

        {verifiedVoucher && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-150 rounded-2xl max-w-xl text-left text-xs animate-in fade-in duration-200">
            <h4 className="font-extrabold text-gray-800 text-sm mb-3 font-Montserrat">Informasi Voucher</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-450 font-bold uppercase text-[9px] tracking-wider">Nama Voucher</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{verifiedVoucher.name}</p>
              </div>
              <div>
                <p className="text-gray-450 font-bold uppercase text-[9px] tracking-wider">Potongan Diskon</p>
                <p className="font-bold text-indigo-650 text-sm mt-0.5">{verifiedVoucher.discount}%</p>
              </div>
              <div>
                <p className="text-gray-450 font-bold uppercase text-[9px] tracking-wider">Nama Pelanggan</p>
                <p className="font-bold text-gray-750 text-sm mt-0.5">{verifiedVoucher.customerName}</p>
              </div>
              <div>
                <p className="text-gray-450 font-bold uppercase text-[9px] tracking-wider">Kode Pelanggan</p>
                <p className="font-bold text-gray-750 font-mono text-sm mt-0.5">{verifiedVoucher.customerCode}</p>
              </div>
              <div>
                <p className="text-gray-450 font-bold uppercase text-[9px] tracking-wider">Tanggal Kedaluwarsa</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{verifiedVoucher.expiry}</p>
              </div>
              <div>
                <p className="text-gray-450 font-bold uppercase text-[9px] tracking-wider">Status</p>
                <div className="mt-0.5">
                  <Badge variant={verifiedVoucher.status === "Ready to Use" ? "green" : "red"}>
                    {verifiedVoucher.status === "Ready to Use" ? "SIAP DIGUNAKAN (READY)" : "SUDAH DIGUNAKAN (USED)"}
                  </Badge>
                </div>
              </div>
            </div>

            {verifiedVoucher.status === "Ready to Use" ? (
              <Button
                onClick={handleUseVoucherInStore}
                variant="primary"
                className="w-full font-bold h-9 text-xs cursor-pointer"
                loading={verifyLoading}
              >
                Gunakan Voucher Sekarang
              </Button>
            ) : (
              <p className="text-red-500 font-bold text-center mt-2">Voucher ini sudah tidak berlaku atau telah digunakan.</p>
            )}
          </div>
        )}
      </Card>

      {/* Recent Transactions Table */}
      <Card className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-800">Transaksi Terbaru</p>
          <Link to="/transactions" className="text-xs text-[#2940D3] font-semibold hover:underline">Lihat Semua</Link>
        </div>
        <Table headers={["ID", "Pelanggan", "Layanan", "Total", "Status"]}>
          {transactions.slice(0, 5).map((t) => (
            <tr key={t.transactionId} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3 text-xs text-gray-400 font-mono">{t.transactionId}</td>
              <td className="px-5 py-3 font-medium text-gray-700">{t.customerName || t.customerId}</td>
              <td className="px-5 py-3 text-gray-500 text-xs">{t.service}</td>
              <td className="px-5 py-3 font-semibold text-gray-800">Rp {Number(t.total).toLocaleString("id-ID")}</td>
              <td className="px-5 py-3"><Badge variant={statusMap[t.status] || "gray"} className="capitalize">{t.status}</Badge></td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Tambah Cucian Modal */}
      <Dialog open={showTambah} onOpenChange={(openState) => { if (!openState) { setShowTambah(false); setLocalForm({}); setSelectedCustomerId(""); } }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-Montserrat p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left">
            <DialogTitle className="text-base font-bold text-gray-800">Tambah Cucian Baru</DialogTitle>
            <DialogDescription className="text-xs text-gray-400 mt-0.5">Isi data pelanggan dan detail cucian</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-700">
            {saved ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Check size={26} className="text-green-500" /></div>
                <p className="font-bold text-gray-800 mb-1">Cucian Berhasil Ditambahkan!</p>
                <p className="text-sm text-gray-500">Mengarahkan ke halaman tracking...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Pilih Pelanggan</label>
                    <Combobox
                      options={customerOptions}
                      value={selectedCustomerId}
                      onChange={handleCustomerSelect}
                      placeholder="Pilih pelanggan atau tambah baru..."
                      emptyMessage="Pelanggan tidak ditemukan."
                    />
                  </div>

                  {/* Show text inputs if new_customer or custom customer is being filled */}
                  {(selectedCustomerId === "new_customer" || !selectedCustomerId) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 bg-white">
                      <Input
                        label="Nama Pelanggan"
                        name="customerName"
                        value={localForm.customerName || ""}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        placeholder="Nama lengkap"
                        required
                      />
                      <Input
                        label="No. Telepon"
                        name="phone"
                        type="tel"
                        value={localForm.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                      <Input
                        label="Email (opsional)"
                        name="email"
                        type="email"
                        value={localForm.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@contoh.com"
                      />
                      <Select
                        label="Jenis Pelanggan (opsional)"
                        name="customerType"
                        value={localForm.customerType || "Umum"}
                        onChange={(val) => handleInputChange("customerType", val)}
                        options={["Umum", "Pelajar", "Pekerja", "Ibu Rumah Tangga"]}
                      />
                      <div className="sm:col-span-2">
                        <TextArea
                          label="Alamat (opsional)"
                          name="address"
                          value={localForm.address || ""}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Alamat lengkap tempat tinggal..."
                          rows={2}
                        />
                      </div>
                    </div>
                  )}

                  {/* Show read-only details if existing customer selected */}
                  {selectedCustomerId && selectedCustomerId !== "new_customer" && (
                    <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 flex justify-between items-center text-xs text-left">
                      <div>
                        <p className="font-bold text-gray-700">{localForm.customerName}</p>
                        <p className="text-gray-400 mt-0.5">{localForm.phone}</p>
                      </div>
                      <Badge variant="blue">Pelanggan Terdaftar</Badge>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Berat (kg)"
                      name="weight"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={localForm.weight || ""}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="Contoh: 3.5"
                      required
                    />
                    <Select
                      label="Metode Pembayaran"
                      name="paymentMethod"
                      value={localForm.paymentMethod || PAYMENT_METHODS[0]}
                      onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                      options={PAYMENT_METHODS}
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jenis Layanan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SERVICES.map((s) => {
                        const isActive = (localForm.service || SERVICES[0]) === s;
                        return (
                          <label key={s} className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${isActive ? "border-[#2940D3] bg-[#2940D3]/5" : "border-gray-200 hover:border-gray-300"}`}>
                            <input type="radio" name="service" checked={isActive} onChange={() => handleInputChange("service", s)} className="sr-only" />
                            <span className={`text-xs font-semibold leading-tight ${isActive ? "text-[#2940D3]" : "text-gray-600"}`}>{s}</span>
                            <span className="text-xs text-gray-400">Rp {priceMap[s].toLocaleString("id-ID")}/kg</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <TextArea
                    label="Catatan (opsional)"
                    name="notes"
                    value={localForm.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Contoh: ada noda membandel..."
                    rows={2}
                  />
                </div>

                 {baseTotal > 0 && (
                  <div className="space-y-2 bg-[#2940D3]/5 border border-[#2940D3]/20 rounded-xl px-4 py-3 text-left">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Harga Awal</span>
                      <span>Rp {baseTotal.toLocaleString("id-ID")}</span>
                    </div>
                    {appliedDiscountPct > 0 && (
                      <div className="flex items-center justify-between text-xs text-green-600 font-bold animate-in fade-in duration-200">
                        <span>Promo Otomatis: {appliedPromoLabel}</span>
                        <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/30">
                      <span className="text-sm font-bold text-gray-700">Total Pembayaran</span>
                      <span className="text-base font-bold text-[#2940D3]">Rp {total.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowTambah(false); setLocalForm({}); setSelectedCustomerId(""); }}>Batal</Button>
                  <Button type="submit" variant="primary" icon={<Plus size={15} />} className="flex-1">Tambah Cucian</Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Berhasil (Quick Order Details) */}
      <Dialog open={showSuccessModal} onOpenChange={(openState) => { if (!openState) { setShowSuccessModal(false); setCreatedTransaction(null); } }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-Montserrat p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left bg-white">
            <DialogTitle className="text-base font-bold text-gray-800">Detail Transaksi Baru</DialogTitle>
            <DialogDescription className="text-xs text-gray-400 mt-0.5">Pesanan laundry berhasil disimpan di database</DialogDescription>
          </DialogHeader>

          {createdTransaction && (
            <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-750 text-left bg-white">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl mb-4 border border-gray-100">
                <img src={createdTransaction.qrCode} alt="QR Code Tracking" className="w-40 h-40 shadow rounded-xl border-2 border-white mb-2" />
                <p className="font-mono font-bold text-gray-800 text-sm tracking-wide">{createdTransaction.transactionId}</p>
                <Badge variant="yellow" className="mt-1.5 capitalize">{createdTransaction.status}</Badge>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 mb-5">
                {[
                  { label: "Nomor Transaksi", value: createdTransaction.transactionId, font: "font-mono" },
                  { label: "Nama Pelanggan", value: createdTransaction.customerName },
                  { label: "Estimasi Selesai", value: createdTransaction.estimatedDate },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-xs">
                    <span className="text-gray-500">{item.label}</span>
                    <span className={`font-semibold text-gray-800 ${item.font || ""}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2 bg-white">
                <Button variant="outline" className="text-xs font-bold" onClick={() => {
                  const w = window.open();
                  w.document.write(`<div style="text-align:center;padding:50px;"><img src="${createdTransaction.qrCode}" width="200" /><p style="font-family:sans-serif;font-weight:bold;margin-top:10px;">${createdTransaction.transactionId}</p><p style="font-family:sans-serif;font-size:12px;color:#666;">Pelanggan: ${createdTransaction.customerName}</p></div>`);
                  w.document.close();
                  w.print();
                  w.close();
                }}>Cetak QR</Button>
                <Button variant="outline" className="text-xs font-bold" onClick={() => {
                  const a = document.createElement("a");
                  a.href = createdTransaction.qrCode;
                  a.download = `QR_${createdTransaction.transactionId}.png`;
                  a.target = "_blank";
                  a.click();
                }}>Download QR</Button>
              </div>

              <Button variant="primary" className="w-full text-xs font-bold bg-[#25D366] hover:bg-[#20BA5A] border-none text-white mb-2" onClick={() => {
                const msg = `Halo ${createdTransaction.customerName}, pesanan laundry Anda dengan kode ${createdTransaction.transactionId} telah kami terima. Lacak status cucian Anda di: ${window.location.origin}/tracking/${createdTransaction.transactionId}`;
                window.open(`https://api.whatsapp.com/send?phone=${createdTransaction.phone || ""}&text=${encodeURIComponent(msg)}`);
              }}>Bagikan WhatsApp</Button>
            </div>
          )}

          <div className="px-6 pb-6 flex-shrink-0 bg-white">
            <Button variant="outline" className="w-full text-xs font-bold" onClick={() => { setShowSuccessModal(false); setCreatedTransaction(null); }}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}