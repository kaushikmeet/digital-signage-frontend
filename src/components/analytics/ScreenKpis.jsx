import { useEffect, useState } from "react";
import api from "../../api/services";
import KpiCard from "./KpiCard";

export default function ScreenKpis({ screenId }) {
  const [stats, setStats] = useState({
    totalPlays: 0,
    totalDuration: 0
  });

  useEffect(() => {
    if (!screenId) return;

    api
      .get(`/analytics/screen/${screenId}`)
      .then(res => setStats(res.data))
      .catch(() => {});
  }, [screenId]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <KpiCard label="Total Plays" value={stats.totalPlays} />
      <KpiCard label="Total Duration (sec)" value={stats.totalDuration} />
    </div>
  );
}
