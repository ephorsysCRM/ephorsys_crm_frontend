// import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  // const { isAuthenticated } = useSelector((state) => state.auth)
  const isAuthenticated = true
  return isAuthenticated ? (<Outlet />) : (<Navigate to="/" replace />)
}

export default ProtectedRoute 