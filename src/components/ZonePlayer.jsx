import { useEffect, useState } from "react";
import api from "../api/services";
import usePlaylistPlayer from "../hooks/usePlaylistPlayer";
import MediaPlayer from "./MediaPlayer";
// import ZoneContentResolver from "./ZoneContentResolver";
import LiveWidgetRenderer from "./LiveWidgetRenderer";

export default function ZonePlayer({
  screenId,
  zone,
  activeTimelinePlaylist
}) {
  const [playlistItems, setPlaylistItems] = useState([]);
  const [fallback, setFallback] = useState(null);

  const playlistId =
    activeTimelinePlaylist ??
    zone?.playlistId ??
    null;

  useEffect(() => {
    if (!playlistId) return;
    api
      .get(`/playlists/${playlistId}/active-items`)
      .then(res => setPlaylistItems(res.data || []));
  }, [playlistId]);

  useEffect(() => {
    if (!zone?.fallbackMediaId) return;
    api
      .get(`/media/${zone.fallbackMediaId}`)
      .then(res => setFallback(res.data));
  }, [zone?.fallbackMediaId]);

  const itemsToPlay =
    playlistItems.length
      ? playlistItems
      : fallback
      ? [{ mediaId: fallback }]
      : [];

  const { current } = usePlaylistPlayer(itemsToPlay);

  if (!current?.mediaId && !zone?.widget) return null;

  return (
    <>
      {zone?.widget && (
        <LiveWidgetRenderer widget={zone.widget} />
      )}

      {current?.mediaId && (
        <MediaPlayer media={current.mediaId} />
      )}
    </>
  );
}
