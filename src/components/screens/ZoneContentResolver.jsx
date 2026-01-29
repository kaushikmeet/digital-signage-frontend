import usePlaylistPlayer from "../../hooks/usePlaylistPlayer";
import LiveWidgetRenderer from "../LiveWidgetRenderer";
import MediaPlayer from "../MediaPlayer";

/**
 * Props:
 * zone
 * screenId
 * playlistItemsMap { playlistId: [] }
 */
export default function ZoneContentResolver({
  zone,
  playlistItems = []
}) {
  /* ---------------- TIMELINE RESOLUTION ---------------- */

  function getActiveTimelineSlot() {
    if (!zone.timeline?.length) return null;

    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();

    return zone.timeline.find(slot => {
      const [sh, sm] = slot.start.split(":").map(Number);
      const [eh, em] = slot.end.split(":").map(Number);

      const start = sh * 60 + sm;
      const end = eh * 60 + em;

      return mins >= start && mins < end;
    });
  }

  const activeSlot = getActiveTimelineSlot();
  const activePlaylistId =
    activeSlot?.playlistId || zone.playlistId;

  /* ---------------- PLAYLIST PLAYER ---------------- */

  const items = playlistItems || [];
  const { current } = usePlaylistPlayer(items);

  /* ---------------- RENDER PRIORITY ---------------- */

  // 1️⃣ Live widget
  if (zone.widget) {
    return <LiveWidgetRenderer widget={zone.widget} />;
  }

  // 2️⃣ Playlist content
  if (current?.mediaId) {
    return <MediaPlayer media={current.mediaId} />;
  }

  // 3️⃣ Fallback media
  if (zone.fallbackMedia) {
    return <MediaPlayer media={zone.fallbackMedia} />;
  }

  // 4️⃣ Empty state
  return (
    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
      No content
    </div>
  );
}
