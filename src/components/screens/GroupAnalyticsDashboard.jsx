import { useEffect, useState } from "react";
import api from "../../api/services";

export default function GroupAnalyticsDashboard({ groupId }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.get(`/analytics/group/${groupId}`);
        setStats(res.data);
      } catch (err) {
        console.error("Analytics load failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [groupId]);

  if (!groupId) {
    return (
      <div className="text-xs text-gray-400">
        Select a group to view analytics
      </div>
    );
  }

  if (loading) {
    return <div className="text-xs">Loading analytics…</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-xl text-xs">
      <div className="font-semibold mb-3">📊 Group Analytics</div>

      {stats.length === 0 && (
        <div className="text-gray-400">No analytics data</div>
      )}

      {stats.map((row, i) => (
        <div
          key={i}
          className="flex justify-between border-b border-gray-700 py-1"
        >
          <div>
            <div className="font-medium">
              {row.media?.filename || "Deleted media"}
            </div>
            <div className="text-gray-400">
              Zone: {row.zoneId}
            </div>
          </div>

          <div className="text-right">
            <div>{row.impressions} plays</div>
            <div className="text-gray-400 text-[10px]">
              {row.lastPlayedAt
                ? new Date(row.lastPlayedAt).toLocaleString()
                : "-"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
