import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";

// Admin Layout & Pages
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminLead from "../admin/pages/Lead";
import AdminEmployees from "../admin/pages/Employees";

// BDE Layout & Pages
import BdeLayout from "../layout/BdeLayout";
import BdeDashboard from "../bde/pages/BdeDashboard";
import BdeLead from "../bde/pages/Lead";
  
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="leads" element={<AdminLead />} />
            <Route path="employees" element={<AdminEmployees />} />
          </Route>
        </Route>

        {/* BDE Routes */}
        <Route element={<ProtectedRoute allowedRole="employee" />}>
          <Route path="/bde" element={<BdeLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<BdeDashboard />} />
            <Route path="leads" element={<BdeLead />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;