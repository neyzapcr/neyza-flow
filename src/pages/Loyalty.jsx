import { useState } from "react";
import { Medal, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";

const tiers = [
  { name: "Bronze", min: 0, max: 99, color: "bg-orange-100 text-orange-700", barColor: "#F97316" },
  { name: "Silver", min: 100, max: 299, color: "bg-gray-100 text-gray-700", barColor: "#6B7280" },
  { name: "Gold", min: 300, max: 499, color: "bg-yellow-100 text-yellow-700", barColor: "#EAB308" },
  { name: "Platinum", min: 500, max: Infinity, color: "bg-purple-100 text-purple-700", barColor: "#8B5CF6" },
];

function getTier(points) {
  return tiers.find((t) => points >= t.min && points <= t.max) || tiers[0];
}

export default function Loyalty() {
  const [customers] = useState(customersData);
  const [selected, setSelected] = useState(null);

  const totalPoints = customers.reduce((s, c) => s + c.points, 0);

  return (
    <div>
      <PageHeader title="Program Loyalitas" subtitle="Kelola poin dan reward pelanggan setia" />

      {/* Tier Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {tiers.map((tier) => {
          const count = customers.filter((c) => getTier(c.points).name === tier.name).length;
          return (
            <div key={tier.name} className={`${tier.color} rounded-2xl p-4 border border-white`}>
              <Medal size={20} className="mb-2" style={{ color: tier.barColor }} />
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-xs font-semibold mt-0.5">{tier.name}</p>
              <p className="text-xs opacity-70">{tier.min}–{tier.max === Infinity ? "∞" : tier.max} poin</p>
            </div>
          );
        })}
      </div>

      {/* Rules Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-bold text-gray-800 mb-3">Aturan Program</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Poin per Transaksi", value: "1 poin / Rp 2.000" },
            { label: "Penukaran Poin", value: "100 poin = Rp 5.000 diskon" },
            { label: "Bonus Tier Platinum", value: "2x poin setiap transaksi" },
          ].map((r) => (
            <div key={r.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">{r.label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{r.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Points Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-bold text-gray-800">Daftar Poin Pelanggan</p>
          <p className="text-sm text-gray-500">Total: <span className="font-bold text-[#2940D3]">{totalPoints.toLocaleString("id-ID")} poin</span></p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-5 py-3.5 font-semibold">Pelanggan</th>
                <th className="px-5 py-3.5 font-semibold">Tier</th>
                <th className="px-5 py-3.5 font-semibold">Poin</th>
                <th className="px-5 py-3.5 font-semibold">Progress ke Tier Berikutnya</th>
                <th className="px-5 py-3.5 font-semibold">Total Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...customers].sort((a, b) => b.points - a.points).map((c) => {
                const tier = getTier(c.points);
                const nextTier = tiers[tiers.indexOf(tier) + 1];
                const progress = nextTier ? Math.round(((c.points - tier.min) / (nextTier.min - tier.min)) * 100) : 100;
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#2940D3]/10 flex items-center justify-center text-[#2940D3] font-bold text-sm">
                          {c.name.charAt(0)}
                        </div>
                        <p className="font-semibold text-gray-800">{c.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tier.color}`}>{tier.name}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#2940D3]">{c.points}</td>
                    <td className="px-5 py-4 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: tier.barColor }}></div>
                        </div>
                        <span className="text-xs text-gray-400">{progress}%</span>
                      </div>
                      {nextTier && <p className="text-xs text-gray-400 mt-0.5">{nextTier.min - c.points} poin lagi ke {nextTier.name}</p>}
                    </td>
                    <td className="px-5 py-4 text-gray-700">{c.totalTransactions}x</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Detail Poin</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500">
                <X size={14} />
              </button>
            </div>
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-[#2940D3] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-2 shadow">
                {selected.name.charAt(0)}
              </div>
              <p className="font-bold text-gray-800">{selected.name}</p>
              <p className="text-3xl font-bold text-[#2940D3] mt-2">{selected.points} <span className="text-sm text-gray-400 font-normal">poin</span></p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getTier(selected.points).color}`}>
                {getTier(selected.points).name}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Total Transaksi", value: `${selected.totalTransactions}x` },
                { label: "Total Belanja", value: `Rp ${selected.totalSpent.toLocaleString("id-ID")}` },
                { label: "Nilai Poin", value: `Rp ${(Math.floor(selected.points / 100) * 5000).toLocaleString("id-ID")}`, color: "text-green-600" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={`font-semibold ${item.color || "text-gray-800"}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-4 py-2.5 rounded-xl bg-[#2940D3] text-white text-sm font-semibold hover:bg-[#5A6FE4] transition-colors">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
