import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layout
import DashboardLayout from "../layout/DashboardLayout";

// Pages
import Login from "../pages/auth/Login";
// Dashboard
import EmployeeDashboard from "../pages/dashboard/EmployeeDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
// Leads
import LeadsList from "../pages/leads/LeadsList";
import CreateLead from "../pages/leads/CreateLead";
import PipelineView from "../pages/leads/PipelineView";
import HotlistView from "../pages/leads/HotlistView";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - require login */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Route redirects to dashboard based on role inside Dashboard component, or we can use a redirect */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard Route handles showing Admin vs Employee internally */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          } />

          {/* Lead Routes */}
          <Route path="leads" element={<LeadsList />} />
          <Route path="leads/create" element={<CreateLead />} />
          <Route path="leads/pipeline" element={<PipelineView />} />
          <Route path="leads/hotlist" element={<HotlistView />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Simple wrapper to render correct dashboard based on role
import { useSelector } from "react-redux";
const RoleBasedDashboard = () => {
  const { role } = useSelector((state) => state.auth);
  return role === "admin" ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default AppRoutes;
