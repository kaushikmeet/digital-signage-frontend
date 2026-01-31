import { useEffect, useState } from "react";
import api from "../api/services";
import ZoneContentResolver from "../components/screens/ZoneContentResolver";

export default function ZonePlayer({ zone }) {
  const [playlistItems, setPlaylistItems] = useState([]);
  const [fallbackMedia, setFallbackMedia] = useState(null);

  /* ---------- PLAYLIST ---------- */
  useEffect(() => {
    if (!zone?.playlistId) return;

    api
      .get(`/playlists/${zone.playlistId}/active-items`)
      .then(res => setPlaylistItems(res.data || []))
      .catch(() => setPlaylistItems([]));
  }, [zone?.playlistId]);

  /* ---------- FALLBACK ---------- */
  useEffect(() => {
    if (!zone?.fallbackMediaId) return;

    api
      .get(`/media/${zone.fallbackMediaId}`)
      .then(res => setFallbackMedia(res.data))
      .catch(() => setFallbackMedia(null));
  }, [zone?.fallbackMediaId]);

  return (
    <ZoneContentResolver
      zone={zone}
      playlistItems={playlistItems}
      fallbackMedia={fallbackMedia}
    />
  );
}
