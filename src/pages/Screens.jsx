import { useEffect, useState } from "react";
import api from "../api/services";

export default function Screens() {
  const [screens, setScreens] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [assign, setAssign] = useState({});

  async function load() {
    const [s, p] = await Promise.all([
      api.get("/screens"),
      api.get("/playlists")
    ]);
    setScreens(s.data);
    setPlaylists(p.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createScreen() {
    if (!name) return alert("Screen name required");
    await api.post("/screens", { name, location });
    setName("");
    setLocation("");
    load();
  }

  async function assignPlaylist(screenId, playlistId) {
    await api.post("/screens/assign", {
      screenId,
      playlistId
    });
    alert("Playlist assigned");
  }

  return (
    <div className="space-y-6">
      {/* Create Screen */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold">Create Screen</h2>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded"
            placeholder="Screen name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <button
            onClick={createScreen}
            className="bg-indigo-600 text-white px-4 rounded"
          >
            Create
          </button>
        </div>
      </div>

      {/* Screen List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Screens</h2>

        <div className="space-y-3">
          {screens.map(screen => (
            <div
              key={screen._id}
              className="flex items-center justify-between border p-3 rounded"
            >
              <div>
                <div className="font-medium">{screen.name}</div>
                <div className="text-xs text-gray-500">
                  {screen.location || "No location"}
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  className="border p-1 rounded"
                  onChange={e =>
                    setAssign({ ...assign, [screen._id]: e.target.value })
                  }
                >
                  <option value="">Select Playlist</option>
                  {playlists.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => assignPlaylist(screen._id)}
                  className="bg-green-600 text-white px-3 rounded"
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
