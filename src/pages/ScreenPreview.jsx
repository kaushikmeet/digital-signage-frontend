import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/services";
import socket from "../utils/socket";
import usePlaylistPlayer from "../hooks/usePlaylistPlayer";
import ScreenControls from "../components/ScreenControls";
import MediaPlayer from "../components/MediaPlayer";
import MultiZoneScreen from "../components/MultiZoneScreen";
import ZoneEditor from "../components/screens/ZoneEditor";
import ZonePresetPicker from "../components/screens/ZonePresetPicker";

export default function ScreenPreview() {
  const { screenId } = useParams();

  const [screen, setScreen] = useState(null);
  const [mode, setMode] = useState("horizontal");
  const [items, setItems] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [zones, setZones] = useState([]);

  const containerRef = useRef(null);
  const loggedRef = useRef(null);

  /* PLAYER */
  const { current, remaining, skip, setPaused } =
    usePlaylistPlayer(items);

  /* EMERGENCY CHECK */
  const isEmergencyActive =
    emergency &&
    emergency.mediaId &&
    new Date(emergency.expiresAt).getTime() > Date.now();

  /* LOAD SCREEN (single source of truth) */
  useEffect(() => {
    api.get(`/screens/${screenId}`).then((res) => {
      setScreen(res.data);
      setPlaylistId(res.data.playlistId);
      setZones(res.data.zones || []);
    });
  }, [screenId]);

  /* LOAD PLAYLIST */
  useEffect(() => {
    if (!playlistId) return;

    loadPlaylist();
    socket.emit("register-playlist", playlistId);

    const handler = ({ playlistId: id }) => {
      if (id === playlistId) loadPlaylist();
    };

    socket.on("playlist-updated", handler);
    return () => socket.off("playlist-updated", handler);
  }, [playlistId]);

  async function loadPlaylist() {
    const res = await api.get(`/playlists/${playlistId}/active-items`);
    setItems(res.data || []);
  }

  /* HEARTBEAT */
  useEffect(() => {
    socket.emit("register-screen", screenId);
    const i = setInterval(() => {
      socket.emit("screen-heartbeat", screenId);
    }, 5000);
    return () => clearInterval(i);
  }, [screenId]);

function applyPreset(preset) {
  const zones = preset.zones.map(z => ({
    name: z.name,
    x: z.x,
    y: z.y,
    w: z.w,
    h: z.h,
    zIndex: z.zIndex ?? 1,
    playlistId: null,
    fallbackMediaId: null
  }));

  setZones(zones);

  api.put(`/screens/${screenId}/zones`, { zones });
}


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* HEADER */}
      {screen && (
        <div className="flex justify-between items-center mb-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="font-semibold">{screen.name}</div>
            <div className="text-xs text-gray-400">
              {screen.location || "No location"}
            </div>
          </div>
           <ZonePresetPicker onApply={applyPreset} />
          <div className="flex bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setMode("horizontal")}
              className={`px-4 py-2 ${mode === "horizontal" ? "bg-indigo-600" : ""}`}
            >
              Horizontal
            </button>
            <button
              onClick={() => setMode("vertical")}
              className={`px-4 py-2 ${mode === "vertical" ? "bg-indigo-600" : ""}`}
            >
              Vertical
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      <div className="flex justify-center mt-6">
        <div
          ref={containerRef}
          className={`relative bg-black rounded-xl overflow-hidden ${
            mode === "horizontal"
              ? "aspect-video w-full max-w-5xl"
              : "aspect-[9/16] w-[360px]"
          }`}
        >
          {isEmergencyActive ? (
            <MediaPlayer media={emergency.mediaId} />
          ) : zones.length ? (
            <>
              <MultiZoneScreen zones={zones} />
              <ZoneEditor
                zones={zones}
                setZones={setZones}
                containerRef={containerRef}
              />
            </>
          ) : current?.mediaId ? (
            <MediaPlayer media={current.mediaId} />
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
