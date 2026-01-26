import { Play, Pause, SkipForward } from "lucide-react";
import socket from "../utils/socket";

export default function ScreenControls({ screenId }) {
  const send = (action) => {
    if (!screenId) {
      console.error("❌ screenId missing");
      return;
    }

    socket.emit("player-control", {
      screenId,
      action
    });

    console.log("🎮 Control sent:", action);
  };

  
  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={() => send("play")}
        className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
        title="Play"
      >
        <Play size={20} />
      </button>

      <button
        onClick={() => send("pause")}
        className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
        title="Pause"
      >
        <Pause size={20} />
      </button>

      <button
        onClick={() => send("skip")}
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        title="Skip"
      >
        <SkipForward size={20} />
      </button>
    </div>
  );
}
