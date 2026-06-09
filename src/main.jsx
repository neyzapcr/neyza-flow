import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import { TooltipProvider } from './components/ui/tooltip'
import './assets/tailwind.css'
import App from './App.jsx'

// ── Root app dengan toast & tooltip provider ──────────────────────────────
function Root() {
  // Dengarkan custom event "addToast" dari manapun di app
  useEffect(() => {
    const handler = (e) => {
      const { type = "info", title, desc, duration = 5000 } = e.detail
      const opts = { description: desc, duration }
      if (type === "success") {
        toast.success(title, opts)
      } else if (type === "warning") {
        toast.warning(title, opts)
      } else if (type === "error") {
        toast.error(title, opts)
      } else if (type === "laundry") {
        toast(title, { ...opts, icon: "🧺" })
      } else {
        toast.info(title, opts)
      }
    }
    window.addEventListener("addToast", handler)
    return () => window.removeEventListener("addToast", handler)
  }, [])

  return (
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
)
