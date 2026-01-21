import { useEffect, useState } from "react";
import api from "../api/services";

function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/analytics/summary")
      .then(res => setStats(res.data))
      .catch(err => {
        console.error(err);
        setError("Unauthorized or session expired");
      });
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return <p>Loading analytics…</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">
        Total Plays: {stats.totalPlays}
      </h2>

      <h3 className="mt-3 font-medium">Top Media</h3>

      {stats.topMedia.map(m => (
        <div key={m._id} className="text-sm text-gray-700">
          {m._id} — {m.plays} plays
        </div>
      ))}
    </div>
  );
}

export default AnalyticsDashboard;
