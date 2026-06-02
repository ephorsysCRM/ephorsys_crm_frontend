import { Route } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import BdeLayout from "../layout/BdeLayout";
import BdeDashboard from "../bde/pages/BdeDashboard";
import Lead from "../bde/pages/Lead";

const BdeRoutes = (
  <Route element={<ProtectedRoute allowedRole="employee" />}>
    <Route path="/bde" element={<BdeLayout />}>
      <Route path="dashboard" element={<BdeDashboard />} />
      <Route path="leads" element={<Lead />} />
      {/* Add more BDE routes here */}
    </Route>
  </Route>
);

export default BdeRoutes;