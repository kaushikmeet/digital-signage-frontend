import { useEffect, useState } from "react";
import api from "../api/services";
import socket from "../utils/socket";
import { Upload } from "lucide-react";

export default function PlaylistBuilder({ playlistId }) {
  const [media, setMedia] = useState([]);
  const [items, setItems] = useState([]);
  const [mediaId, setMediaId] = useState("");
  const [duration, setDuration] = useState(10);
  const [file, setFile] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  async function load() {
  const res = await api.get(`/playlists/${playlistId}/items`);
  const itemsWithMedia = await Promise.all(
    res.data.map(async (item) => {
      if (typeof item.mediaId === "string") {
        // fetch media object
        const mediaRes = await api.get(`/media/${item.mediaId}`);
        return { ...item, mediaId: mediaRes.data };
      }
      return item;
    })
  );
  setItems(itemsWithMedia);
}


  /* LOAD MEDIA LIBRARY */
  useEffect(() => {
    api.get("/media").then((res) => setMedia(res.data));
  }, []);

  useEffect(() => {
  if (!playlistId) return;

  socket.emit("register-playlist", playlistId);
  }, [playlistId]); // emit only

  useEffect(() => {
    if (!playlistId) return;
    load();
  }, [playlistId]);

  function moveItem(target) {
    if (dragIndex === null || dragIndex === target) return;

    const updated = [...items];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(target, 0, moved);

    setItems(updated);
    setDragIndex(null); // ✅ reset

    api.post("/playlists/reorder", {
      playlistId,
      items: updated.map((i, idx) => ({
        id: i._id,
        position: idx,
      })),
    });
  }

  /* UPLOAD MEDIA */
  async function uploadMedia() {
  if (!file) return alert("Select a file");

  try {
    const form = new FormData();
    form.append("file", file);

    const uploadRes = await api.post("/media/upload", form);

    // Add new media to the list for instant preview
    setMedia((prev) => [...prev, uploadRes.data]);

    setFile(null);
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
}


  async function addToPlaylist() {
    if (!mediaId) return alert("Select media");

    await api.post("/playlists/items", {
      playlistId,
      mediaId,
      duration: Number(duration),
      position: Date.now(),
    });

    setMediaId("");
    load();
  }

  async function deleteItem(id) {
    await api.delete(`/playlists/items/${id}`);
    load();
  }

  async function duplicateItem(item) {
    const mediaId =
      typeof item.mediaId === "string" ? item.mediaId : item.mediaId?._id;

    if (!mediaId) {
      alert("Media missing, cannot duplicate");
      return;
    }

    await api.post("/playlists/items", {
      playlistId,
      mediaId,
      duration: item.duration,
      position: Date.now(),
    });

    load();
  }

  return (
    <div className="space-y-3 bg-gray-50 p-3 rounded overflow-visible">
      <div className="font-semibold">Playlist Items</div>
      <div className="flex flex-col items-start gap-2">
        <label
          htmlFor="fileUpload"
          className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
        >
          <Upload />
          <span className="text-gray-600 text-sm text-center">
            Drag & drop your file here, or click to select
          </span>
          <input
            id="fileUpload"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        {/* Upload Button */}
        <button
          onClick={uploadMedia}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 transition"
          disabled={!file}
        >
          Upload
        </button>
      </div>
      <div className="flex gap-2">
        <select
          className="border p-2 rounded"
          value={mediaId}
          onChange={(e) => setMediaId(e.target.value)}
        >
          <option value="">Select Media</option>
          {media.map((m) => (
            <option key={m._id} value={m._id}>
              {m.filename} ({m.type})
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border p-2 w-20"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button
          onClick={addToPlaylist}
          className="bg-indigo-600 text-white px-3 rounded"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((i, index) => (
          <div
            key={i._id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => moveItem(index)}
            className="flex items-center gap-3 p-2 bg-white rounded shadow cursor-move"
          >
            <span className="text-gray-400">☰</span>

            {i.mediaId ? (
              i.mediaId.type === "image" ? (
                <img
                  src={i.mediaId.url}
                  alt={i.mediaId.filename}
                  className="w-16 h-10 object-cover rounded"
                />
              ) : (
                <video
                  src={i.mediaId.url}
                  className="w-16 h-10 rounded"
                  muted
                />
              )
            ) : (
              <span className="text-red-500 text-xs">Media missing</span>
            )}

            <span className="flex-1 truncate text-sm">
              {i.mediaId?.filename}
            </span>

            <span className="text-gray-500">{i.duration}s</span>

            <button
              onClick={() => duplicateItem(i)}
              className="text-indigo-500 text-xs cursor-pointer"
            >
              Duplicate
            </button>

            <button
              onClick={() => deleteItem(i._id)}
              className="text-red-500 text-xs cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
