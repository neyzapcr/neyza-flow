import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/Loading";
import { applyTheme } from "./utils/theme";

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
const CustomerDetail = lazy(() => import("./pages/CustomerDetail"));
const Landing       = lazy(() => import("./pages/guest/Landing"));
const Users         = lazy(() => import("./pages/Users"));

// ── Cek status login dari localStorage ───────────────────────────────────
const getUserSession = () => {
  try {
    return JSON.parse(localStorage.getItem("netto_user"));
  } catch (e) {
    return null;
  }
};

const isLoggedIn = () => getUserSession() !== null;

// ── Guard: halaman admin — khusus admin, redirect ke / jika member ───────────
function AdminRoute({ children }) {
  const user = getUserSession();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ── Guard: halaman auth — redirect ke dashboard/landing page kalau sudah login ────────
function GuestRoute({ children }) {
  const user = getUserSession();
  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ── Root: Landing Page Publik ── */}
        <Route path="/" element={<Landing />} />

        {/* ── Auth Routes — tidak bisa diakses kalau sudah login ── */}
        <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />} />
        </Route>

        {/* ── Admin Routes — harus login dulu ── */}
        <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/customers"     element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/transactions"  element={<Transactions />} />
          <Route path="/tracking"      element={<Tracking />} />
          <Route path="/feedback"      element={<Feedback />} />
          <Route path="/loyalty"       element={<Loyalty />} />
          <Route path="/segmentation"  element={<Segmentation />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports"       element={<Reports />} />
          <Route path="/settings"      element={<Settings />} />
          <Route path="/users"         element={<Users />} />
        </Route>

        {/* ── 404 — URL tidak dikenal ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}
