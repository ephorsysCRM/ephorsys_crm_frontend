import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'employee') return <Navigate to="/bde/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;