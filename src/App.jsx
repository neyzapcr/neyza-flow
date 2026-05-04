import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/Loading";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Lazy-loaded pages — Auth
const Login    = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot   = lazy(() => import("./pages/auth/Forgot"));

// Lazy-loaded pages — Admin
const Dashboard     = lazy(() => import("./pages/Dashboard"));
const Customers     = lazy(() => import("./pages/Customers"));
const Transactions  = lazy(() => import("./pages/Transactions"));
const Tracking      = lazy(() => import("./pages/Tracking"));
const Feedback      = lazy(() => import("./pages/Feedback"));
const Loyalty       = lazy(() => import("./pages/Loyalty"));
const Segmentation  = lazy(() => import("./pages/Segmentation"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Reports       = lazy(() => import("./pages/Reports"));
const Settings      = lazy(() => import("./pages/Settings"));
const NotFound      = lazy(() => import("./pages/NotFound"));

// ── Cek status login dari localStorage ───────────────────────────────────
const isLoggedIn = () => localStorage.getItem("netto_auth") === "true";

// ── Guard: halaman admin — redirect ke /login kalau belum login ───────────
function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

// ── Guard: halaman auth — redirect ke /dashboard kalau sudah login ────────
function GuestRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ── Root: / → dashboard kalau login, login kalau belum ── */}
        <Route
          path="/"
          element={isLoggedIn()
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
          }
        />

        {/* ── Auth Routes — tidak bisa diakses kalau sudah login ── */}
        <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />} />
        </Route>

        {/* ── Admin Routes — harus login dulu ── */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/customers"     element={<Customers />} />
          <Route path="/transactions"  element={<Transactions />} />
          <Route path="/tracking"      element={<Tracking />} />
          <Route path="/feedback"      element={<Feedback />} />
          <Route path="/loyalty"       element={<Loyalty />} />
          <Route path="/segmentation"  element={<Segmentation />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports"       element={<Reports />} />
          <Route path="/settings"      element={<Settings />} />
        </Route>

        {/* ── 404 — URL tidak dikenal ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}
