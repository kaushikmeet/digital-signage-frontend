import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Screens from "./pages/Screens";
import Playlists from "./pages/Playlists";
import PlayerPage from "./pages/PlayerPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/player/:screenId" element={<PlayerPage />} />

        {/* AUTH REQUIRED */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/screens" element={<Screens />} />
              <Route path="/playlists" element={<Playlists />} />
            </Route>
          </Route>
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
