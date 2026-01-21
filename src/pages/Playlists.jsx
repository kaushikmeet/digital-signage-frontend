import { useEffect, useState } from "react";
import api from "../api/services";
import PlaylistBuilder from "../components/PlaylistBuilder";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [active, setActive] = useState(null);

  async function load() {
    const res = await api.get("/playlists");
    setPlaylists(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createPlaylist() {
    if (!name) return alert("Enter playlist name");
    await api.post("/playlists", { name });
    setName("");
    load();
  }

  return (
    <div className="space-y-6">
      {/* Create Playlist */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold">Create Playlist</h2>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Playlist name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            onClick={createPlaylist}
            className="bg-indigo-600 text-white px-4 rounded"
          >
            Create
          </button>
        </div>
      </div>

      {/* Playlist List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Playlists</h2>

        <div className="space-y-4">
          {playlists.map(p => (
            <div key={p._id} className="border rounded p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{p.name}</span>
                <button
                  onClick={() =>
                    setActive(active === p._id ? null : p._id)
                  }
                  className="text-sm text-blue-600"
                >
                  {active === p._id ? "Close" : "Edit"}
                </button>
              </div>

              {active === p._id && (
                <div className="mt-3">
                  <PlaylistBuilder playlistId={p._id} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
