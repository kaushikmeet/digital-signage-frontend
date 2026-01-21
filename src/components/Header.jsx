import { MonitorPlay } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ onAddScreen, onAddPlaylist }) {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-2 font-bold text-lg">
        <MonitorPlay className="text-blue-600" />
        <Link to="/">Digital Signage Admin</Link>
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
    </header>
  );
}
