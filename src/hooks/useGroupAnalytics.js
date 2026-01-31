import { useEffect, useState } from "react";
import api from "../api/services";

export default function useGroupAnalytics(groupId) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!groupId) return;
    api.get(`/analytics/group/${groupId}`)
      .then(res => setStats(res.data));
  }, [groupId]);

  return stats;
}
