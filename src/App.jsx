import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/Loading";

// Layouts — tidak di-lazy karena ringan dan selalu dibutuhkan
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Lazy-loaded pages — Auth
const Login    = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot   = lazy(() => import("./pages/auth/Forgot"));

// Lazy-loaded pages — Admin (sesuai modul: hanya /pages yang di-lazy)
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

export default function App() {
  return (
    // Suspense membungkus Routes — fallback Loading tampil saat lazy load
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* ── Auth Routes (dibungkus AuthLayout) ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />} />
        </Route>

        {/* ── Admin Routes (dibungkus MainLayout) ── */}
        <Route element={<MainLayout />}>
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

        {/* ── Default & 404 ── */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
