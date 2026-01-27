import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/services";
import socket from "../utils/socket";
import usePlaylistPlayer from "../hooks/usePlaylistPlayer";
import ScreenControls from "../components/ScreenControls";
import MediaPlayer from "../components/MediaPlayer";

export default function ScreenPreview() {
  const { screenId } = useParams();

  const [screen, setScreen] = useState(null);
  const [mode, setMode] = useState("horizontal");
  const [items, setItems] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [fallback, setFallback] = useState(null);

  const videoRef = useRef(null);
  const loggedRef = useRef(null);

  /* PLAYER */
  const { current, remaining, skip, setPaused } =
    usePlaylistPlayer(items);

  /* EMERGENCY ACTIVE CHECK */
  const isEmergencyActive =
    emergency &&
    emergency.mediaId &&
    new Date(emergency.expiresAt).getTime() > Date.now();

  /* LOAD SCREEN */
  useEffect(() => {
    api.get(`/screens/${screenId}`).then((res) => {
      setScreen(res.data);
      setPlaylistId(res.data.playlistId);
    });
  }, [screenId]);

  /* LOAD PLAYLIST */
  useEffect(() => {
    if (!playlistId) return;

    const handler = ({ playlistId: id }) => {
      if (id === playlistId) loadPlaylist();
    };

    loadPlaylist();
    socket.emit("register-playlist", playlistId);
    socket.on("playlist-updated", handler);

    return () => socket.off("playlist-updated", handler);
  }, [playlistId]);

  async function loadPlaylist() {
    try {
      const res = await api.get(
        `/playlists/${playlistId}/active-items`
      );
      setItems(res.data || []);
    } catch {
      const cached = localStorage.getItem(
        `playlist-cache-${screenId}`
      );
      if (cached) setItems(JSON.parse(cached));
    }
  }

  /* CACHE */
  useEffect(() => {
    if (items.length) {
      localStorage.setItem(
        `playlist-cache-${screenId}`,
        JSON.stringify(items)
      );
    }
  }, [items, screenId]);

  /* ✅ ANALYTICS LOG (AUTO) */
  useEffect(() => {
    if (!screenId || !current?.mediaId?._id) return;

    if (loggedRef.current === current.mediaId._id) return;
    loggedRef.current = current.mediaId._id;

    api.post("/analytics/log", {
      screenId,
      mediaId: current.mediaId._id,
      duration: current.mediaId.duration || 0
    }).catch(() => {});
  }, [current, screenId]);

  /* HEARTBEAT */
  useEffect(() => {
    socket.emit("register-screen", screenId);

    const interval = setInterval(() => {
      socket.emit("screen-heartbeat", screenId);
    }, 5000);

    return () => clearInterval(interval);
  }, [screenId]);

  /* REMOTE CONTROLS */
  useEffect(() => {
    const handler = (action) => {
      if (action === "pause") {
        videoRef.current?.pause();
        setPaused(true);
      }
      if (action === "play") {
        videoRef.current?.play();
        setPaused(false);
      }
      if (action === "skip") skip();
    };

    socket.on("player-control", handler);
    return () => socket.off("player-control", handler);
  }, [skip, setPaused]);

  /* EMERGENCY EVENTS */
  useEffect(() => {
    socket.on("emergency-on", (data) => {
      setEmergency(data);
      setPaused(true);
      videoRef.current?.pause();
    });

    socket.on("emergency-off", () => {
      setEmergency(null);
      setPaused(false);
    });

    return () => {
      socket.off("emergency-on");
      socket.off("emergency-off");
    };
  }, [setPaused]);

  /* FALLBACK MEDIA */
  useEffect(() => {
    api
      .get(`/screens/${screenId}/fallback-media`)
      .then((res) => setFallback(res.data))
      .catch(() => {});
  }, [screenId]);

 

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* HEADER */}
      {screen && (
        <div className="flex justify-between items-center mb-4">
          <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div>
              <div className="font-semibold">{screen.name}</div>
              <div className="text-xs text-gray-400">
                {screen.location || "No location"}
              </div>
            </div>
            <ScreenControls screenId={screen._id} />
          </div>

          <div className="flex bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setMode("horizontal")}
              className={`px-4 py-2 ${
                mode === "horizontal" ? "bg-indigo-600" : ""
              }`}
            >
              Horizontal
            </button>
            <button
              onClick={() => setMode("vertical")}
              className={`px-4 py-2 ${
                mode === "vertical" ? "bg-indigo-600" : ""
              }`}
            >
              Vertical
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      <div className="flex justify-center mt-6">
        <div
          className={`relative bg-black rounded-xl overflow-hidden ${
            mode === "horizontal"
              ? "aspect-video w-full max-w-5xl"
              : "aspect-[9/16] w-[360px]"
          }`}
        >
          {isEmergencyActive ? (
            <MediaPlayer media={emergency.mediaId} loop />
          ) : current?.mediaId ? (
            <MediaPlayer
              media={current.mediaId}
              ref={videoRef}
            />
          ) : (
            <div className="text-gray-400 flex items-center justify-center h-full">
              No active media scheduled
            </div>
          )}

          {current && !isEmergencyActive && (
            <div className="absolute top-3 right-3 bg-black/70 text-xs px-3 py-1 rounded-full">
              ⏱ {remaining}s
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
