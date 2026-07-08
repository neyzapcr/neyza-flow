import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/Loading";
import { useAuth } from "./hooks/useAuth";
import { applyTheme } from "./utils/theme";
import { useEffect } from "react";

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
const Users         = lazy(() => import("./pages/Users"));

// Lazy-loaded pages — Member
const MemberLayout       = lazy(() => import("./layouts/MemberLayout"));
const MemberDashboard    = lazy(() => import("./pages/member/MemberDashboard"));
const MemberTracking     = lazy(() => import("./pages/member/MemberTracking"));
const MemberTransactions = lazy(() => import("./pages/member/MemberTransactions"));
const MemberLoyalty      = lazy(() => import("./pages/member/MemberLoyalty"));
const MemberPromos       = lazy(() => import("./pages/member/MemberPromos"));
const MemberProfile      = lazy(() => import("./pages/member/MemberProfile"));
const MemberNotifications = lazy(() => import("./pages/member/MemberNotifications"));

// Lazy-loaded pages — Guest / Public
const Landing       = lazy(() => import("./pages/guest/Landing"));
const PublicTracking = lazy(() => import("./pages/PublicTracking"));

// ── Route guards ─────────────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/member/dashboard" replace />;
  return children;
}

function MemberRoute({ children }) {
  const { isAuthenticated, isMember, loading } = useAuth();
  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isMember) return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <Loading />;
  if (isAuthenticated) {
    if (role === "Member") return <Navigate to="/member/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
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

        {/* ── Public Tracking via QR Code ── */}
        <Route path="/tracking/:transactionId" element={<PublicTracking />} />

        {/* ── Auth Routes — tidak bisa diakses kalau sudah login ── */}
        <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />} />
        </Route>

        {/* ── Admin Routes ── */}
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

        {/* ── Member Routes ── */}
        <Route element={<MemberRoute><MemberLayout /></MemberRoute>}>
          <Route path="/member/dashboard"     element={<MemberDashboard />} />
          <Route path="/member/tracking"      element={<MemberTracking />} />
          <Route path="/member/transactions"  element={<MemberTransactions />} />
          <Route path="/member/loyalty"       element={<MemberLoyalty />} />
          <Route path="/member/promos"        element={<MemberPromos />} />
          <Route path="/member/profile"       element={<MemberProfile />} />
          <Route path="/member/notifications" element={<MemberNotifications />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}
