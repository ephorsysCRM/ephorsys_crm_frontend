import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../auth/LoginPage";
import AdminRoutes from "./admin.routes";
import BdeRoutes from "./bde.routes";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Only defined once */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin Routes */}
        {AdminRoutes}

        {/* BDE Routes */}
        {BdeRoutes}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;