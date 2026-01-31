import { useEffect, useState } from "react";
import api from "../../api/services";
import { debounce } from "../../utils/useDebounce";
import Zone from "../../components/screens/Zone";

function ZoneEditor({ zones = [], setZones, containerRef, screenId, mode }) {
  const [media, setMedia] = useState([]);

  /* ---------- LOAD MEDIA ---------- */
  useEffect(() => {
    api.get("/media").then(res => {
      setMedia(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  /* ---------- UPDATE ZONE ---------- */
  function updateZone(id, changes) {
    setZones(prev =>
      prev.map(z =>
        (z._id === id || z.tempId === id)
          ? { ...z, ...changes }
          : z
      )
    );
  }

  /* ---------- SAVE ZONES (DEBOUNCED) ---------- */
  const saveZones = debounce(zonesToSave => {
    if (!screenId) return;
    
    const cleaned = zonesToSave.map(({ tempId, ...z }) => z);

    api.put(`/screens/${screenId}/zones`, {
      zones: cleaned
    });
  }, 800);

  useEffect(() => {
    if (zones.length) saveZones(zones);
  }, [zones]);

  /* ---------- RENDER ---------- */
  return (
    <>
      {zones.map(zone => {
        const key = zone._id || zone.tempId;
        if (!key) return null;

        return (
          <Zone
            key={key}
            zone={zone}
            mode={mode}
            containerRef={containerRef}
            media={media}
            updateZone={updateZone}
            onChange={updated =>
              updateZone(updated._id || updated.tempId, updated)
            }
          />
        );
      })}
    </>
  );
}

export default ZoneEditor;
