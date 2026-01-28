import { useEffect, useRef } from "react";
import api from "../api/services";
import usePlaylistPlayer from "../hooks/usePlaylistPlayer";
import MediaPlayer from "./MediaPlayer";

export default function ZonePlayer({ screenId, zoneId, items }) {
  const { current } = usePlaylistPlayer(items);
  const loggedRef = useRef(null);

  /* ✅ ANALYTICS PER ZONE */
  useEffect(() => {
    if (!current?.mediaId?._id) return;

    // prevent duplicate logs
    if (loggedRef.current === current.mediaId._id) return;
    loggedRef.current = current.mediaId._id;

    api.post("/analytics/log", {
      screenId,
      mediaId: current.mediaId._id,
      zoneId
    }).catch(() => {});
  }, [current, screenId, zoneId]);

  if (!current?.mediaId) return null;

  return <MediaPlayer media={current.mediaId} />;
}
