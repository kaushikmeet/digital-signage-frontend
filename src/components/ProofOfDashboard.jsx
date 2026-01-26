import { useEffect, useState } from "react";
import api from "../api/services";
import KpiCard from "./KPICards";

export default function ProofPlayDashboard() {
  const [kpis, setKpis] = useState({});
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    api.get("/analytics/kpis").then(res => setKpis(res.data));
    api.get("/analytics/daily").then(res => setDaily(res.data));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Proof of Play Analytics</h1>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Total Plays" value={kpis.totalPlays} />
        <KpiCard
          label="Total Play Time (min)"
          value={Math.floor((kpis.totalDuration || 0) / 60)}
        />
        <KpiCard label="Avg Duration (sec)" value={
          kpis.totalPlays
            ? Math.floor(kpis.totalDuration / kpis.totalPlays)
            : 0
        } />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Daily Plays</h2>
        <ul className="space-y-1">
          {daily.map(d => (
            <li key={d._id.day}>
              {d._id.day} — {d.plays} plays
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
