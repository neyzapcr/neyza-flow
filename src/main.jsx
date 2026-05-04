import { StrictMode, useState, useCallback, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './assets/tailwind.css'
import App from './App.jsx'

// ── Konfigurasi tampilan per tipe ─────────────────────────────────────────
const typeConfig = {
  success: { bar: "bg-green-500",    icon: "✓", iconBg: "bg-green-100",      iconText: "text-green-600" },
  info:    { bar: "bg-[#3ABDE8]",    icon: "i", iconBg: "bg-[#3ABDE8]/10",   iconText: "text-[#3ABDE8]" },
  warning: { bar: "bg-yellow-400",   icon: "!", iconBg: "bg-yellow-100",      iconText: "text-yellow-600" },
  error:   { bar: "bg-red-500",      icon: "✕", iconBg: "bg-red-100",         iconText: "text-red-600" },
  laundry: { bar: "bg-[#1A667A]",    icon: "🧺", iconBg: "bg-[#1A667A]/10",  iconText: "text-[#1A667A]", isEmoji: true },
}

// ── Item toast tunggal ────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }) {
  const cfg = typeConfig[toast.type] || typeConfig.info
  return (
    <div
      className="pointer-events-auto w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden font-lagusans"
      style={{ animation: "slideInRight 0.35s ease-out" }}
    >
      <div className={`h-1 w-full ${cfg.bar}`} />
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
          {cfg.isEmoji
            ? <span className="text-base leading-none">{cfg.icon}</span>
            : <span className={`text-sm font-bold ${cfg.iconText}`}>{cfg.icon}</span>
          }
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{toast.title}</p>
          {toast.desc && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{toast.desc}</p>}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5"
        >
          <span className="text-xs font-bold">✕</span>
        </button>
      </div>
    </div>
  )
}

// ── Root app dengan toast state ───────────────────────────────────────────
function Root() {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Dengarkan custom event "addToast" dari manapun di app
  useEffect(() => {
    const handler = (e) => {
      const { type = "info", title, desc, duration = 5000 } = e.detail
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, type, title, desc }])
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration)
    }
    window.addEventListener("addToast", handler)
    return () => window.removeEventListener("addToast", handler)
  }, [])

  return (
    <>
      <App />

      {/* Toast container — pojok kanan bawah */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
)
