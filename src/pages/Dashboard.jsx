import { useEffect, useState } from "react";
import api from "../api/services";
import StatCard from "../components/StatCard";
import PlayerCard from "../components/PlayerCard";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { Monitor, ListVideo, Image } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    screens: 0,
    playlists: 0,
    media: 0,
  });
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    async function load() {
      const [screensRes, playlistsRes, mediaRes] = await Promise.all([
        api.get("/screens"),
        api.get("/playlists"),
        api.get("/media"),
      ]);

      setStats({
        screens: screensRes.data.length,
        playlists: playlistsRes.data.length,
        media: mediaRes.data.length,
      });

      setScreens(screensRes.data);
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Screens"
          value={stats.screens}
          icon={<Monitor size={28} />}
          gradient="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Playlists"
          value={stats.playlists}
          icon={<ListVideo size={28} />}
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Media Files"
          value={stats.media}
          icon={<Image size={28} />}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Screens */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Screens</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {screens.map((screen) => (
            <PlayerCard key={screen._id} screen={screen} />
          ))}
        </div>
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
