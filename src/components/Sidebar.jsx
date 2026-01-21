import { useEffect, useState } from "react";
import api from "../api/services";
import socket from "../utils/socket";
import React from "react";
import { ChevronUp, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [screens, setScreens] = useState([]);
  const [openScreen, setOpenScreen] = useState(null);

  async function loadScreens() {
    const res = await api.get("/screens");
    setScreens(res.data || []);
  }

  /* initial load */
  useEffect(() => {
    loadScreens();
  }, []);

  /* socket auto refresh */
  useEffect(() => {
    function refresh() {
      console.log("🔄 Screens updated — reloading sidebar");
      loadScreens();
    }

    socket.on("screens-updated", refresh);

    return () => {
      socket.off("screens-updated", refresh);
    };
  }, []);


  return (
    <aside className="w-72 bg-gray-900 text-white h-screen p-3 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3">📺 Screens</h2>

      {screens.map((screen) => (
        <div key={screen._id} className="mb-3">
          {/* SCREEN HEADER */}
          <div
            className="cursor-pointer flex justify-between items-center bg-gray-800 px-3 py-2 rounded"
            onClick={() =>
              setOpenScreen(openScreen === screen._id ? null : screen._id)
            }
          >
            <span>{screen.name}</span>
            <span>
              {openScreen === screen._id ? <ChevronUp /> : <ChevronRight />}
            </span>
          </div>

          {/* PLAYLIST ITEMS */}
          {openScreen === screen._id && (
            <div className="ml-3 mt-2 space-y-2">
              {screen.playlist?.items?.length ? (
                screen.playlist.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    {/* MEDIA PREVIEW */}
                    {item.mediaId ? (
                      item.mediaId.type === "image" ? (
                        <img
                          src={item.mediaId.url}
                          alt={item.mediaId.filename}
                          className="w-12 h-8 object-cover rounded bg-black"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      ) : (
                        <video
                          src={item.mediaId.url}
                          className="w-12 h-8 rounded bg-black"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      )
                    ) : (
                      <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                        N/A
                      </div>
                    )}

                    {/* FILE NAME */}
                    <span className="truncate flex-1">
                      {item.mediaId?.filename || "Missing media"}
                    </span>

                    {/* DURATION */}
                    <span className="text-gray-400 whitespace-nowrap">
                      {item.duration}s
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No playlist assigned</p>
              )}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
