import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "../../api/services";

export default function DailyTrendChart() {
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get("/analytics/daily")
      .then((res) => {
        if (mounted) setDaily(res.data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        Loading analytics…
      </div>
    );
  }

  if (!daily.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={daily}>
        <Line dataKey="plays" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="plays"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
