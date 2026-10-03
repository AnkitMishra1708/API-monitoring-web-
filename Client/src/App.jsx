import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Monitors from "./pages/Monitors";
import JobDetail from "./pages/JobDetail";
import JobEditor from "./pages/JobEditor";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Protected><DashboardLayout /></Protected>}>
        <Route path="/" element={<Monitors />} />
        <Route path="/jobs/new" element={<JobEditor />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/jobs/:id/edit" element={<JobEditor />} />
      </Route>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
