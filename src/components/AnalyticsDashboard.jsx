import { useEffect, useState } from "react";
import api from "../api/services";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/analytics/summary").then(res => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-6 mt-6 mb-10">
      
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Plays</h3>
          <p className="text-3xl font-bold">{stats.totalPlays}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Screens</h3>
          <p className="text-3xl font-bold">{stats.totalScreens}</p>
        </div>
      </div>

      {/* TOP MEDIA */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="font-semibold mb-3">Top Media</h3>

        {stats.topMedia.length === 0 && (
          <p className="text-sm text-gray-400">No data yet</p>
        )}

        {stats.topMedia.map(m => (
          <div
            key={m._id}
            className="flex justify-between text-sm py-1"
          >
            <span>Media ID: {m._id}</span>
            <span className="font-medium">{m.plays} plays</span>
          </div>
        ))}
      </div>
    </div>
  );
}
