import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API = "http://localhost:8080";
const socket = io(API);

function Player({ screenId }) {
  const [timeline, setTimeline] = useState([]);
  const [index, setIndex] = useState(0);

  const loadTimeline = async () => {
    if (!screenId) return;

    try {
      const res = await fetch(`${API}/player/${screenId}`);
      const data = await res.json();
      setTimeline(Array.isArray(data) ? data : []);
      setIndex(0);
    } catch (err) {
      console.error("Failed to load timeline", err);
      setTimeline([]);
    }
  };

  useEffect(() => {
    loadTimeline();

    socket.emit("register-screen", screenId);

    socket.on("playlist-updated", () => {
      console.log("Playlist updated, reloading...");
      loadTimeline();
    });

    return () => socket.off("playlist-updated");
  }, [screenId]);

  // Reset index if timeline changes
  useEffect(() => {
    setIndex(0);
  }, [timeline]);

  // Advance timeline
  useEffect(() => {
    if (!timeline.length) return;

    const current = timeline[index];
    const timer = setTimeout(() => {
      setIndex((index + 1) % timeline.length);
    }, current.duration * 1000);

    return () => clearTimeout(timer);
  }, [index, timeline]);

  if (!screenId) {
    return (
      <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
        Select a screen
      </div>
    );
  }

  if (!timeline.length) {
    return (
      <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
        No content assigned
      </div>
    );
  }

  const current = timeline[index];

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      {current.type === "image" ? (
        <img src={current.url} className="max-w-full max-h-full object-contain" alt="" />
      ) : (
        <video src={current.url} autoPlay muted className="max-w-full max-h-full object-contain" />
      )}
    </div>
  );
}

export default Player;
