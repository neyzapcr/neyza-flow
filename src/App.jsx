import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "./components/Loading";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Customers = lazy(() => import("./pages/Customers"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Tracking = lazy(() => import("./pages/Tracking"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Loyalty = lazy(() => import("./pages/Loyalty"));
const Segmentation = lazy(() => import("./pages/Segmentation"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CustomerDetail = lazy(() => import("./pages/CustomerDetail"));

const isLoggedIn = () => localStorage.getItem("netto_auth") === "true";

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        <Route
          path="/"
          element={isLoggedIn()
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
          }
        />

        <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/segmentation" element={<Segmentation />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}
