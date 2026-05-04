import { useState } from "react";
import { Search, CheckCircle, Circle, Package } from "lucide-react";
import PageHeader from "../components/PageHeader";
import laundryData from "../data/laundryStatus.json";

const statusConfig = {
  menunggu: { color: "bg-yellow-100 text-yellow-700", label: "Menunggu" },
  diproses: { color: "bg-blue-100 text-[#3ABDE8]", label: "Diproses" },
  selesai: { color: "bg-green-100 text-green-700", label: "Selesai" },
};

const stepLabels = ["Diterima", "Dicuci", "Dikeringkan", "Disetrika", "Selesai"];

export default function Tracking() {
  const [orders, setOrders] = useState(laundryData);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  const updateStep = (orderId, stepIndex) => {
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      const newSteps = o.steps.map((s, i) => ({
        ...s,
        done: i <= stepIndex,
        time: i <= stepIndex && !s.time ? new Date().toLocaleString("id-ID") : s.time,
      }));
      const lastDone = newSteps.filter((s) => s.done).length;
      const currentStatus = lastDone === 0 ? "menunggu" : lastDone === newSteps.length ? "selesai" : "diproses";
      return { ...o, steps: newSteps, currentStatus };
    });
    setOrders(updated);
    setSelected(updated.find((o) => o.id === orderId));
  };

  return (
    <div>
      <PageHeader title="Tracking Status Laundry" subtitle="Pantau dan perbarui status pengerjaan cucian">
        <div className="flex gap-2">
          {Object.entries(statusConfig).map(([key, val]) => (
            <span key={key} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${val.color}`}>
              {val.label}: {orders.filter((o) => o.currentStatus === key).length}
            </span>
          ))}
        </div>
      </PageHeader>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Cari ID transaksi atau nama pelanggan..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-600 placeholder-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Order List */}
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} onClick={() => setSelected(order)}
              className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${selected?.id === order.id ? "border-[#3ABDE8] ring-2 ring-[#3ABDE8]/20" : "border-gray-100"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">{order.customerName}</p>
                  <p className="text-xs text-gray-400 font-mono">{order.id}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[order.currentStatus]?.color}`}>
                  {statusConfig[order.currentStatus]?.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span>{order.service}</span>
                <span>{order.weight} kg</span>
              </div>
              <div className="flex items-center gap-1">
                {order.steps.map((step, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${step.done ? "bg-[#3ABDE8]" : "bg-gray-200"}`}></div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">Diterima {order.receivedDate}</span>
                <span className="text-xs text-gray-400">Est. {order.estimatedDate}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Tidak ada order ditemukan</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit sticky top-24">
          {selected ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Detail Tracking</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[selected.currentStatus]?.color}`}>
                  {statusConfig[selected.currentStatus]?.label}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5">
                {[
                  { label: "Pelanggan", value: selected.customerName },
                  { label: "No. HP", value: selected.phone },
                  { label: "Layanan", value: selected.service },
                  { label: "Berat", value: `${selected.weight} kg` },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-800 text-right text-xs max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Progress Pengerjaan</p>
              <div className="space-y-3">
                {selected.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${step.done ? "bg-[#3ABDE8]" : "bg-gray-100"}`}>
                      {step.done
                        ? <CheckCircle size={16} className="text-white" />
                        : <Circle size={16} className="text-gray-400" />
                      }
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${step.done ? "text-gray-800" : "text-gray-400"}`}>{step.step}</p>
                        <button onClick={() => updateStep(selected.id, i)}
                          className={`text-xs px-2.5 py-1 rounded-lg transition-all ${step.done ? "bg-green-100 text-green-600 cursor-default" : "bg-[#3ABDE8]/10 text-[#3ABDE8] hover:bg-[#3ABDE8]/20"}`}>
                          {step.done ? "Selesai" : "Tandai"}
                        </button>
                      </div>
                      {step.time && <p className="text-xs text-gray-400 mt-0.5">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Package size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Pilih order untuk melihat detail tracking</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
