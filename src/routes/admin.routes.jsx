import { Route } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminLayout from "../layout/AdminLayout";
import Lead from "../admin/pages/Lead";
import Employees from "../admin/pages/Employees";

const AdminRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="leads" element={<Lead />} />
      <Route path="employees" element={<Employees />} />
      {/* Add more admin routes here */}
    </Route>
  </Route>
);

export default AdminRoutes;