import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Screens from "./pages/Screens";
import Playlists from "./pages/Playlists";
import PlayerPage from "./pages/PlayerPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/player/:screenId" element={<PlayerPage />} />
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/screens" element={<Screens />} />
          <Route path="/playlists" element={<Playlists />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
