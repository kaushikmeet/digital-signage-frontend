import { useState, useEffect } from "react";
import PlaylistBuilder from "./PlaylistBuilder";
import api from "../api/services";

export default function ScreenTree() {
  const [screens, setScreens] = useState([]);
  const [openPlaylistId, setOpenPlaylistId] = useState(null);

  useEffect(() => {
    api.get("/screens")
      .then(res => {
        console.log("SCREENS API:", res.data);
        setScreens(res.data || []);
      })
      .catch(err => {
        console.error("Failed to load screens", err);
        setScreens([]);
      });
  }, []);

  if (!screens.length) {
    return <p className="text-gray-500">No screens found</p>;
  }

  return (
    <div className="space-y-2">
      {screens.map(screen => {
        const playlist = screen.playlistId; // populated object

        return (
          <div key={screen._id} className="border p-3 rounded">
            <p className="font-semibold">{screen.name}</p>

            {playlist ? (
              <>
                {/* ✅ SHOW PLAYLIST NAME */}
                <p className="text-sm text-gray-600">
                  Playlist: <b>{playlist.name}</b>
                </p>

                <button
                  className="text-blue-600 text-sm mt-1"
                  onClick={() =>
                    setOpenPlaylistId(
                      openPlaylistId === playlist._id
                        ? null
                        : playlist._id
                    )
                  }
                >
                  {openPlaylistId === playlist._id
                    ? "Close Playlist"
                    : "Open Playlist"}
                </button>

                {openPlaylistId === playlist._id && (
                  <div className="mt-2">
                    <PlaylistBuilder playlistId={screen.playlistId._id || screen.playlistId} />
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">No playlist assigned</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
