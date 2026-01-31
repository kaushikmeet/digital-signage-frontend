import { useEffect, useState } from "react";
import api from "../api/services";

export default function ZoneAnalyticsOverlay({ zoneId, impressions,zoneStats }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get(`/analytics/zone/${zoneId}`)
      .then(res => setStats(res.data));
  }, [zoneId]);

  if (!stats) return null;

  return (
    <>
    <div className="absolute bottom-1 right-1 bg-black/70 text-xs px-2 py-1 rounded">
      ▶ {stats.plays} | ⏱ {stats.duration}s
    </div>
     <div className="absolute bottom-1 right-1 text-xs bg-black/70 px-2 py-1 rounded">
      👁 {zoneStats.impressions}
    </div>
    </>
  );
}
