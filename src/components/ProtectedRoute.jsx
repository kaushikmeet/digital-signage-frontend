import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
