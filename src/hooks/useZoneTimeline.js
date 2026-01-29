import { useState, useEffect, useCallback } from "react";

/**
 * Timeline slot shape:
 * { id, start: "HH:mm", end: "HH:mm", playlistId }
 */
export default function useZoneTimeline(
  zone,
  updateZone
) {
  const [timeline, setTimeline] = useState(
    zone.timeline || []
  );
  const [error, setError] = useState(null);

  /* 🔄 Keep hook in sync when zone changes */
  useEffect(() => {
    setTimeline(zone.timeline || []);
  }, [zone.timeline]);

  /* ---------------- HELPERS ---------------- */

  const timeToMinutes = useCallback(time => {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }, []);

  const hasOverlap = useCallback(slots => {
    const ranges = slots
      .map(s => ({
        start: timeToMinutes(s.start),
        end: timeToMinutes(s.end)
      }))
      .sort((a, b) => a.start - b.start);

    for (let i = 0; i < ranges.length - 1; i++) {
      if (ranges[i].end > ranges[i + 1].start) {
        return true;
      }
    }
    return false;
  }, [timeToMinutes]);

  /* ---------------- CORE ---------------- */

  const saveTimeline = useCallback(
    newTimeline => {
      if (hasOverlap(newTimeline)) {
        setError("⛔ Time slots overlap");
        return false;
      }

      setError(null);
      setTimeline(newTimeline);
      updateZone(zone._id, { timeline: newTimeline });
      return true;
    },
    [hasOverlap, updateZone, zone._id]
  );

  /* ---------------- ACTIONS ---------------- */

  const addSlot = useCallback(() => {
    return saveTimeline([
      ...timeline,
      {
        id: crypto.randomUUID(),
        start: "00:00",
        end: "23:59",
        playlistId: ""
      }
    ]);
  }, [timeline, saveTimeline]);

  const updateSlot = useCallback(
    (id, changes) => {
      return saveTimeline(
        timeline.map(slot =>
          slot.id === id
            ? { ...slot, ...changes }
            : slot
        )
      );
    },
    [timeline, saveTimeline]
  );

  const removeSlot = useCallback(
    id => {
      return saveTimeline(
        timeline.filter(slot => slot.id !== id)
      );
    },
    [timeline, saveTimeline]
  );

  /* ---------------- PUBLIC API ---------------- */

  return {
    timeline,
    error,

    addSlot,
    updateSlot,
    removeSlot,

    hasOverlap
  };
}
