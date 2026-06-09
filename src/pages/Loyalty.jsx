import { useState } from "react";
import { Medal } from "lucide-react";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Table from "../components/Table";
import Avatar from "../components/Avatar";

const tiers = [
  { name: "Bronze",   min: 0,   max: 99,       barColor: "#F97316" },
  { name: "Silver",   min: 100, max: 299,       barColor: "#6B7280" },
  { name: "Gold",     min: 300, max: 499,       barColor: "#EAB308" },
  { name: "Platinum", min: 500, max: Infinity,  barColor: "#8B5CF6" },
];

const getTier = (pts) => tiers.find((t) => pts >= t.min && pts <= t.max) || tiers[0];

export default function Loyalty() {
  const [customers] = useState(() => {
    return customersData.flatMap((c) => {
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
  });
  const [selected, setSelected] = useState(null);
  const totalPoints = customers.reduce((s, c) => s + c.points, 0);

  return (
    <div>
      <PageHeader title="Program Loyalitas" subtitle="Kelola poin dan reward pelanggan setia" />

      {/* Tier Overview Cards — Berubah Putih Bersih & Menggunakan Fitur Otomatis Badge */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {tiers.map((t) => (
          <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-start text-left">
            <div className="flex items-center justify-between w-full mb-3">
              <Badge variant={t.name} icon={<Medal size={12} style={{ color: t.barColor }} />}>{t.name}</Badge>
              <span className="text-xs text-gray-400 font-medium">{t.min}–{t.max === Infinity ? "∞" : t.max} pts</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-800 leading-none">{customers.filter(c => getTier(c.points).name === t.name).length}</p>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">Pelanggan terdaftar</p>
          </div>
        ))}
      </div>

      {/* Rules Card */}
      <Card className="mb-4">
        <h3 className="font-bold text-gray-800 mb-3 text-sm text-left">Aturan Program</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[{ label: "Poin per Transaksi", value: "1 poin / Rp 2.000" }, { label: "Penukaran Poin", value: "100 poin = Rp 5.000 diskon" }, { label: "Bonus Tier Platinum", value: "2x poin setiap transaksi" }].map((r) => (
            <div key={r.label} className="bg-gray-50 rounded-xl p-3 text-left">
              <p className="text-xs text-gray-500">{r.label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{r.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Customer Points Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-bold text-gray-800">Daftar Poin Pelanggan</p>
          <p className="text-sm text-gray-500">Total: <span className="font-bold text-[#2940D3]">{totalPoints.toLocaleString("id-ID")} poin</span></p>
        </div>
        <Table headers={["Pelanggan", "Tier", "Poin", "Progress ke Tier Berikutnya", "Total Transaksi"]}>
          {[...customers].sort((a, b) => b.points - a.points).map((c) => {
            const tier = getTier(c.points);
            const nextTier = tiers[tiers.indexOf(tier) + 1];
            const progress = nextTier ? Math.round(((c.points - tier.min) / (nextTier.min - tier.min)) * 100) : 100;
            return (
              <tr key={c.customerId} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.customerName} size="md" shape="rounded" color="bg-[#2940D3]/10" className="text-[#2940D3]" />
                    <p className="font-semibold text-gray-800">{c.customerName}</p>
                  </div>
                </td>
                <td className="px-5 py-4"><Badge variant={tier.name} icon={<Medal size={11} style={{ color: tier.barColor }} />}>{tier.name}</Badge></td>
                <td className="px-5 py-4 font-bold text-[#2940D3]">{c.points}</td>
                <td className="px-5 py-4 w-48 text-left">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={progress} color={tier.barColor} height="md" className="flex-1" />
                    <span className="text-xs text-gray-400">{progress}%</span>
                  </div>
                  {nextTier && <p className="text-[11px] text-gray-400 mt-0.5">{nextTier.min - c.points} poin lagi ke {nextTier.name}</p>}
                </td>
                <td className="px-5 py-4 text-gray-700">{c.totalTransactions}x</td>
              </tr>
            );
          })}
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(openState) => { if (!openState) setSelected(null); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col font-lagusans p-0 gap-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0 text-left">
            <DialogTitle className="text-base font-bold text-gray-800">Detail Poin</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-700">
            {selected && (
              <>
                <div className="text-center mb-4">
                  <Avatar name={selected.customerName} size="xl" shape="rounded" color="bg-[#2940D3] mx-auto mb-2 shadow" />
                  <p className="font-bold text-gray-800">{selected.customerName}</p>
                  <p className="text-3xl font-bold text-[#2940D3] mt-2">{selected.points} <span className="text-sm text-gray-400 font-normal">poin</span></p>
                  <Badge variant={getTier(selected.points).name} icon={<Medal size={11} style={{ color: getTier(selected.points).barColor }} />} className="mt-1">{getTier(selected.points).name}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Total Transaksi", value: `${selected.totalTransactions}x` },
                    { label: "Total Belanja", value: `Rp ${selected.totalSpent.toLocaleString("id-ID")}` },
                    { label: "Nilai Poin", value: `Rp ${(Math.floor(selected.points / 100) * 5000).toLocaleString("id-ID")}`, color: "text-green-600" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 text-left">
                      <span className="text-gray-500">{item.label}</span>
                      <span className={`font-semibold ${item.color || "text-gray-800"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="px-6 pb-6 flex-shrink-0">
            <Button variant="primary" className="w-full" onClick={() => setSelected(null)}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}