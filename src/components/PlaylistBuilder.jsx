import { useEffect, useState } from "react";
import UploadMedia from "../components/media/UploadMedia";
import HtmlEditor from "../components/media/HtmlMediaEditor";
import TextMediaForm from "../components/media/TextMediaForm";
import api from "../api/services";
import socket from "../utils/socket";
import PlaylistItemSchedule from "../components/PlaylistItemSchedule";

export default function PlaylistBuilder({ playlistId }) {
  const [media, setMedia] = useState([]);
  const [items, setItems] = useState([]);
  const [mediaId, setMediaId] = useState("");
  const [duration, setDuration] = useState(10);
  const [dragIndex, setDragIndex] = useState(null);

  /* 🔗 Shared callback */
  const handleMediaCreated = (newMedia) => {
    setMedia((prev) => [...prev, newMedia]);
  };

  /* LOAD MEDIA LIBRARY */
  useEffect(() => {
    api.get("/media").then((res) => setMedia(res.data));
  }, []);

  /* LOAD PLAYLIST ITEMS */
  async function load() {
    const res = await api.get(`/playlists/${playlistId}/items`);
    setItems(res.data);
  }

  useEffect(() => {
    if (!playlistId) return;
    socket.emit("register-playlist", playlistId);
    load();
  }, [playlistId]);

  /* REORDER */
  function moveItem(target) {
    if (dragIndex === null || dragIndex === target) return;

    const updated = [...items];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(target, 0, moved);

    setItems(updated);
    setDragIndex(null);

    api.post("/playlists/reorder", {
      playlistId,
      items: updated.map((i, idx) => ({
        id: i._id,
        position: idx
      }))
    });
  }

  /* ADD TO PLAYLIST */
  async function addToPlaylist() {
    if (!mediaId) return alert("Select media");

    await api.post("/playlists/items", {
      playlistId,
      mediaId,
      duration,
      position: Date.now()
    });

    setMediaId("");
    load();
  }

  async function deleteItem(id) {
    await api.delete(`/playlists/items/${id}`);
    load();
  }

  async function duplicateItem(item) {
    await api.post("/playlists/items", {
      playlistId,
      mediaId: item.mediaId._id,
      duration: item.duration,
      position: Date.now()
    });
    load();
  }

  return (
    <div className="space-y-6 bg-gray-50 p-4 rounded">

      {/* 🧩 MEDIA CREATION */}
      <div className="space-y-4">
        <UploadMedia onCreated={handleMediaCreated} />
        <HtmlEditor onCreated={handleMediaCreated} />
        <TextMediaForm onCreated={handleMediaCreated} />
      </div>

      {/* ➕ ADD TO PLAYLIST */}
      <div className="flex gap-2 items-center">
        <select
          className="border p-2 rounded"
          value={mediaId}
          onChange={(e) => setMediaId(e.target.value)}
        >
          <option value="">Select Media</option>
          {media.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title || m.filename} ({m.type})
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

      {/* 📋 PLAYLIST ITEMS */}
      <div className="space-y-2">
        {items.map((i, index) => (
          <div
            key={i._id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => moveItem(index)}
            className="flex items-center gap-3 p-2 bg-white rounded shadow"
          >
            <span className="text-gray-400">☰</span>

            <span className="flex-1 truncate">
              {i.mediaId?.title || i.mediaId?.filename}
            </span>

            <PlaylistItemSchedule item={i} onSaved={load} />

            <button
              onClick={() => duplicateItem(i)}
              className="text-indigo-500 text-xs"
            >
              Duplicate
            </button>

            <button
              onClick={() => deleteItem(i._id)}
              className="text-red-500 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}