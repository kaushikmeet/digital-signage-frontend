import { useEffect, useState } from "react";
import api from "../api/services";
import StatCard from "../components/StatCard";
import PlayerCard from "../components/PlayerCard";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
// import AnalyticsDashboard from "../components/AnalyticsDashboard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    screens: 0,
    playlists: 0,
    media: 0
  });
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    async function load() {
      const [screensRes, playlistsRes, mediaRes] = await Promise.all([
        api.get("/screens"),
        api.get("/playlists"),
        api.get("/media")
      ]);

      setStats({
        screens: screensRes.data.length,
        playlists: playlistsRes.data.length,
        media: mediaRes.data.length
      });

      setScreens(screensRes.data);
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Screens" value={stats.screens} />
        <StatCard title="Playlists" value={stats.playlists} />
        <StatCard title="Media Files" value={stats.media} />
      </div>

      {/* Screens */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Screens</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {screens.map(screen => (
            <PlayerCard key={screen._id} screen={screen} />
          ))}
        </div>
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
