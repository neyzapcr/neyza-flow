import { useState, useEffect } from "react";
import { CheckCircle, Circle, Package } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import Badge from "../components/Badge";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabaseClient";
import { getTransactions, updateTransaction } from "../services/TransactionApi";
import { getTrackingHistory, updateTracking } from "../services/TrackingApi";

const statusConfig = {
  menunggu: { variant: "yellow", label: "Menunggu" },
  diproses: { variant: "blue",   label: "Diproses" },
  selesai:  { variant: "green",  label: "Selesai" },
};

const statusColorClass = {
  menunggu: "bg-yellow-100 text-yellow-700",
  diproses: "bg-blue-100 text-[#2940D3]",
  selesai:  "bg-green-100 text-green-700",
};

const constantSteps = [
  "Pesanan Diterima",
  "Sedang Dicuci",
  "Sedang Dikeringkan",
  "Sedang Disetrika",
  "Quality Check",
  "Siap Diambil",
  "Selesai"
];

export default function Tracking() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getTransactions();

      // Fetch all tracking records to map currentStatus accurately
      const { data: trackingList, error: trackErr } = await supabase
        .from("tracking")
        .select("transactionId, currentStatus");
        
      if (trackErr) console.error("Error fetching tracking statuses:", trackErr.message);
      
      const trackingMap = {};
      if (trackingList) {
        trackingList.forEach(t => {
          trackingMap[t.transactionId] = t.currentStatus;
        });
      }

      // Map base steps for each transaction list item based on status
      const mapped = data.map(o => {
        const lowerStatus = (o.status || "").toLowerCase();
        
        // Use currentStatus from tracking if available, fallback to status mapping
        const currentTrackingStatus = trackingMap[o.id] || (lowerStatus === "selesai" ? "Selesai" : "Pesanan Diterima");
        
        const lastDoneIdx = constantSteps.indexOf(currentTrackingStatus);
        
        return {
          ...o,
          id: o.id, // Supabase UUID
          currentStatus: lowerStatus,
          steps: constantSteps.map((step, i) => ({
            step,
            done: i <= lastDoneIdx && lastDoneIdx !== -1
          }))
        };
      });
      setOrders(mapped);
      
      // If there is currently a selected order, refresh its details
      if (selected) {
        const freshSelected = mapped.find(o => o.id === selected.id);
        if (freshSelected) {
          await fetchSelectedHistory(freshSelected);
        }
      }
    } catch (err) {
      console.error("Failed to load tracking list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchSelectedHistory = async (transaction) => {
    try {
      const history = await getTrackingHistory(transaction.id);
      const steps = constantSteps.map(step => {
        const matched = history.find(h => h.step === step);
        return {
          step,
          done: !!matched,
          time: matched ? new Date(matched.time).toLocaleString("id-ID") : null
        };
      });

      const lastDone = steps.filter(s => s.done).length;
      const currentStatus = lastDone === 0 ? "menunggu" : lastDone === steps.length ? "selesai" : "diproses";

      setSelected({
        ...transaction,
        steps,
        currentStatus
      });
    } catch (err) {
      console.error("Failed to fetch selected tracking history:", err);
    }
  };

  const handleSelectOrder = async (order) => {
    setSelected(order);
    await fetchSelectedHistory(order);
  };

  const updateStep = async (transactionId, stepIndex) => {
    if (!selected) return;
    try {
      setLoading(true);
      const stepName = constantSteps[stepIndex];
      const updatedBy = user?.id || null;

      // 1. Update tracking progress and insert into history
      await updateTracking(transactionId, stepName, updatedBy);

      // 2. Compute overall status and update transactions table if necessary
      let newStatus = "diproses";
      if (stepName === "Selesai") {
        newStatus = "selesai";
      } else if (stepName === "Pesanan Diterima" && stepIndex === 0) {
        newStatus = "menunggu";
      }

      await updateTransaction(transactionId, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update tracking step:", err);
      setLoading(false);
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.transactionId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 w-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Tracking Status Laundry" subtitle="Pantau dan perbarui status pengerjaan cucian">
        <div className="flex gap-2">
          {Object.entries(statusConfig).map(([key, val]) => (
            <span key={key} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${statusColorClass[key]}`}>
              {val.label}: {orders.filter((o) => o.currentStatus === key).length}
            </span>
          ))}
        </div>
      </PageHeader>

      <Card className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari ID transaksi atau nama pelanggan..."
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-left">
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} onClick={() => handleSelectOrder(order)}
              className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${selected?.id === order.id ? "border-[#2940D3] ring-2 ring-[#2940D3]/20" : "border-gray-100"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">{order.customerName}</p>
                  <p className="text-xs text-gray-400 font-mono">{order.transactionId}</p>
                </div>
                <Badge variant={statusConfig[order.currentStatus]?.variant || "gray"}>
                  {statusConfig[order.currentStatus]?.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span>{order.service}</span>
                <span>{order.weight} kg</span>
              </div>
              <div className="flex items-center gap-1">
                {order.steps.map((step, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${step.done ? "bg-[#2940D3]" : "bg-gray-200"}`}></div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">Diterima {order.receivedDate}</span>
                <span className="text-xs text-gray-400">Est. {order.estimatedDate}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <Card>
              <EmptyState icon={<Package size={32} />} message="Tidak ada order ditemukan" />
            </Card>
          )}
        </div>

        <Card className="h-fit sticky top-24">
          {selected ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Detail Tracking</h3>
                <Badge variant={statusConfig[selected.currentStatus]?.variant || "gray"}>
                  {statusConfig[selected.currentStatus]?.label}
                </Badge>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5">
                {[
                  { label: "Pelanggan", value: selected.customerName },
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
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${step.done ? "bg-[#2940D3]" : "bg-gray-100"}`}>
                      {step.done
                        ? <CheckCircle size={16} className="text-white" />
                        : <Circle size={16} className="text-gray-400" />
                      }
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${step.done ? "text-gray-800" : "text-gray-400"}`}>{step.step}</p>
                        <button onClick={() => updateStep(selected.id, i)}
                          disabled={step.done || (i > 0 && !selected.steps[i-1].done)}
                          className={`text-xs px-2.5 py-1 rounded-lg transition-all ${step.done ? "bg-green-50 text-green-600 cursor-default" : (i > 0 && !selected.steps[i-1].done) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#2940D3]/10 text-[#2940D3] hover:bg-[#2940D3]/20"}`}>
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
            <EmptyState icon={<Package size={40} />} message="Pilih order untuk melihat detail tracking" />
          )}
        </Card>
      </div>
    </div>
  );
}