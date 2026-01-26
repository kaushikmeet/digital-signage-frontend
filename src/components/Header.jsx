import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-gray-800">
          <Link to="/">Digital Signage</Link>
        </span>
      </div>
      <div className="flex gap-3">
        <Link
          to="/screens"
          className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          + Add Screen
        </Link>
        <Link
          to="/playlists"
          className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          + Add Playlist
        </Link>
      </div>
      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* USER INFO */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
          <User size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {user?.name || "User"}
          </span>

          {/* ROLE BADGE */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              user?.role === "Admin"
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {user?.role}
          </span>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
