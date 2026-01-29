import { useEffect, useState } from "react";
import api from "../../api/services";
import { debounce } from "../../utils/useDebounce";
import Zone from "../../components/screens/Zone";

function ZoneEditor({ zones, setZones, containerRef, screenId }) {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    api.get("/media").then(res => setMedia(res.data));
  }, []);

  function updateZone(id, changes) {
    setZones(prev =>
      prev.map(z =>
        z._id === id ? { ...z, ...changes } : z
      )
    );
  }

  const saveZones = debounce(zones => {
    if (!screenId) return;
    api.put(`/screens/${screenId}/zones`, { zones });
  }, 800);

  useEffect(() => {
    if (zones.length) saveZones(zones);
  }, [zones]);

  return (
    <>
      {zones.map(zone => (
         <Zone
          key={zone._id || zone.tempId}
          zone={zone}
          containerRef={containerRef}
          media={media}
          updateZone={updateZone}
          onChange={updated => updateZone(updated._id || updated.tempId, updated)}
        />
      ))}
    </>
  );
};

export default ZoneEditor;
