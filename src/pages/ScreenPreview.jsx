import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/services";
import socket from "../utils/socket";
import usePlaylistPlayer from "../hooks/usePlaylistPlayer";

import ScreenControls from "../components/ScreenControls";
import MediaPlayer from "../components/MediaPlayer";
import MultiZoneScreen from "../components/MultiZoneScreen";
import ZoneEditor from "../components/screens/ZoneEditor";
import ZonePresetSelector from "../components/screens/ZonePresetPicker";
import ScreenGroupManager from "../components/screens/ScreenGroupManager";

import { v4 as uuid } from "uuid";
import { useScreenMode } from "../context/ScreenModeContext";
import CreateGroupModal from "../components/screens/CreateGroupModal";
import { normalizeZones } from "../utils/normalizeZones";

export default function ScreenPreview() {
  const { screenId } = useParams();

  /* ---------------- STATE ---------------- */
  const [screen, setScreen] = useState(null);
  const [orientation, setOrientation] = useState("horizontal");
  const [playlistId, setPlaylistId] = useState(null);
  const [items, setItems] = useState([]);
  const [emergency, setEmergency] = useState(null);
  const [zones, setZones] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const { mode: screenMode, toggleMode } = useScreenMode();
  const isLive = screenMode === "live";

  const containerRef = useRef(null);

  /* ---------------- PLAYER ---------------- */
  const { current, remaining, skip, setPaused } =
    usePlaylistPlayer(items);

  /* ---------------- EMERGENCY ---------------- */
  const isEmergencyActive =
    emergency?.mediaId &&
    new Date(emergency.expiresAt).getTime() > Date.now();

  /* ---------------- LOAD SCREEN ---------------- */
  useEffect(() => {
    api.get(`/screens/${screenId}`).then(res => {
      setScreen(res.data);
      setPlaylistId(res.data.playlistId || null);
      setZones(normalizeZones(res.data.zones || []));
    });
  }, [screenId]);

  /* ---------------- LOAD PLAYLIST ---------------- */
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

  /* ---------------- HEARTBEAT ---------------- */
  useEffect(() => {
    socket.emit("register-screen", screenId);
    const i = setInterval(() => {
      socket.emit("screen-heartbeat", screenId);
    }, 5000);
    return () => clearInterval(i);
  }, [screenId]);

  /* ---------------- APPLY PRESET ---------------- */
  function applyPreset(preset) {
    const preparedZones = preset.zones.map(z => ({
      _id: uuid(),
      name: z.name,
      x: z.x,
      y: z.y,
      w: z.w,
      h: z.h,
      zIndex: z.zIndex || 1,
      playlistId: null,
      fallbackMediaId: null,
      locked: false
    }));

    setZones(preparedZones);

    api.put(`/screens/${screenId}/zones`, {
      zones: preparedZones.map(({id, ...z})=> z)
    });
  }

  useEffect(() => {
  if (!screen?.groupId) return;

  socket.emit("join-group", screen.groupId);

  socket.on("group-layout-updated", ({ layout }) => {
    setZones(layout);
  });

  return () => {
    socket.off("group-layout-updated");
  };
}, [screen?.groupId]);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">

      {/* HEADER */}
      {screen && (
        <div className="flex justify-between items-center">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="font-semibold text-lg">{screen.name}</div>
            <div className="text-xs text-gray-400">
              {screen.location || "No location"}
            </div>
          </div>

          <div className="flex bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setOrientation("horizontal")}
              className={`px-4 py-2 ${
                orientation === "horizontal" ? "bg-indigo-600" : ""
              }`}
            >
              Horizontal
            </button>
            <button
              onClick={() => setOrientation("vertical")}
              className={`px-4 py-2 ${
                orientation === "vertical" ? "bg-indigo-600" : ""
              }`}
            >
              Vertical
            </button>
          </div>
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT PANEL */}
        <div className="col-span-4 space-y-4">

          <button onClick={()=> setShowGroupModal(true)} className="px-3 py-1 bg-green-600 rounded">
            Create Group
          </button>

          <CreateGroupModal
            open={showGroupModal}
            onClose={() => setShowGroupModal(false)}
            onCreated={() => {}}
          />

          {/* GROUP MANAGER */}
          <ScreenGroupManager
            screenId={screenId}
            onApplyLayout={setZones}
          />

          {/* MODE + CONTROLS */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-3">
            <button
              onClick={toggleMode}
              className="w-full px-3 py-2 bg-indigo-600 rounded"
            >
              {screenMode === "preview"
                ? "🔴 Go Live"
                : "🧪 Preview Mode"}
            </button>

            <ScreenControls
              mode={orientation}
              setMode={setOrientation}
              skip={skip}
              setPaused={setPaused}
            />
          </div>

          {/* PRESETS */}
          {!isLive && (
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="font-semibold mb-2">
                🎨 Layout Presets
              </div>
              <ZonePresetSelector onApply={applyPreset} />
            </div>
          )}
        </div>

        {/* PREVIEW AREA */}
        <div className="col-span-8 flex justify-center">
          <div
            ref={containerRef}
            className={`relative bg-black rounded-xl overflow-hidden ${
              orientation === "horizontal"
                ? "aspect-video w-full"
                : "aspect-[9/16] w-[360px]"
            }`}
          >
            {isEmergencyActive ? (
              <MediaPlayer media={emergency.mediaId} />
            ) : zones.length ? (
              <>
                <MultiZoneScreen zones={zones} />
                {!isLive && (
                  <ZoneEditor
                    zones={zones}
                    setZones={setZones}
                    containerRef={containerRef}
                  />
                )}
              </>
            ) : current?.mediaId ? (
              <MediaPlayer media={current.mediaId} />
            ) : (
              <div className="text-gray-400 flex items-center justify-center h-full">
                No active media
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
    </div>
  );
}
