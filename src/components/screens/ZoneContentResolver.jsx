import usePlaylistPlayer from "../../hooks/usePlaylistPlayer";
import MediaPlayer from "../MediaPlayer";
import LiveWidgetRenderer from "../LiveWidgetRenderer";

export default function ZoneContentResolver({
  zone,
  playlistItems = [],
  groupPlaylistItems = [],
  fallbackMedia
}) {
  /* ---------------- RESOLVE ITEMS (NO HOOKS HERE) ---------------- */

  const resolvedItems =
    playlistItems.length
      ? playlistItems
      : groupPlaylistItems.length
      ? groupPlaylistItems
      : fallbackMedia
      ? [{ mediaId: fallbackMedia }]
      : [];

  /* ---------------- HOOK (ALWAYS CALLED) ---------------- */

  const { current } = usePlaylistPlayer(resolvedItems);

  /* ---------------- RENDER PRIORITY ---------------- */

  // 1️⃣ Live widget (highest priority)
  if (zone?.widget) {
    return <LiveWidgetRenderer widget={zone.widget} />;
  }

  // 2️⃣ Playlist / fallback media
  if (current?.mediaId) {
    return <MediaPlayer media={current.mediaId} />;
  }

  // 3️⃣ Empty state
  return (
    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
      No content
    </div>
  );
}
