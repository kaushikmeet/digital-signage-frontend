import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function AdminRoute() {
  const user = getUser();

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
