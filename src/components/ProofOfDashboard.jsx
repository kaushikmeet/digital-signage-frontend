import { useEffect, useState } from "react";
import api from "../api/services";
import KpiCard from "../components/analytics/KPICards";
import DailyTrendChart from "./analytics/DailyTrends";
import socket from "../utils/socket";

export default function ProofPlayDashboard() {
  const [kpis, setKpis] = useState({});
  const [daily, setDaily] = useState([]);
  const [stats, setStats] = useState({
    totalPlays: 0,
    totalDuration: 0
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get("/analytics/kpis").then(res => setKpis(res.data));
    api.get("/analytics/daily").then(res => setDaily(res.data));
  }, []);

  const loadStats = async () => {
    const res = await api.get("/analytics/kpis");
    setStats(res.data);
  };

  useEffect(() => {
    loadStats(); // initial load

    socket.on("analytics-update", () => {
      loadStats(); // 🔴 refresh on live event
    });

    return () => socket.off("analytics-update");
  }, []);

   const exportCsv = () => {
    const res = window.open(`http://localhost:8080/analytics/export/csv?token=${token}`, "_blank");
    console.log(res);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between item-center mb-4">
          <h1 className="text-2xl font-bold">Proof of Play Analytics</h1>
          <button onClick={exportCsv} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Export CSV
          </button>
      </div>
     

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Total Plays" value={stats.totalPlays} />
        <KpiCard label="Total Duration" value={stats.totalDuration} />
        <KpiCard label="Avg Duration (sec)" value={
          kpis.totalPlays
            ? Math.floor(kpis.totalDuration / kpis.totalPlays)
            : 0
        } />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Daily Plays</h2>
        <ul className="space-y-1">
          <DailyTrendChart data={daily}/>
        </ul>
      </div>
    </div>
  );
}
