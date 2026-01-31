import { useState } from "react";
import api from "../../api/services";

export default function ApplyGroupLayoutButton({
  screenId,
  layout = [],
  onApply
}) {
  const [loading, setLoading] = useState(false);

  async function applyLayout() {
    if (!screenId || !layout.length) return;

    try {
      setLoading(true);

      const preparedZones = layout.map(z => ({
        name: z.name,
        x: z.x,
        y: z.y,
        w: z.w,
        h: z.h,
        zIndex: z.zIndex || 1,
        playlistId: z.playlistId ?? null,
        fallbackMediaId: z.fallbackMediaId ?? null,
        timeline: z.timeline ?? [],
        widget: z.widget ?? null,
        locked: z.locked ?? false
      }));

      const res = await api.put(`/screens/${screenId}/zones`, {
        zones: preparedZones
      });

      onApply?.(res.data.zones || preparedZones);

    } catch (err) {
      console.error("Apply group layout error:", err.response?.data || err);
      alert("❌ Failed to apply group layout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      disabled={loading}
      onClick={applyLayout}
      className={`w-full mt-2 px-3 py-1 rounded
        ${loading ? "bg-gray-600" : "bg-indigo-700 hover:bg-indigo-600"}
      `}
    >
      {loading ? "Applying..." : "Apply Group Layout"}
    </button>
  );
}
