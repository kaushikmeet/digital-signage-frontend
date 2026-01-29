import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/services";
import socket from "../utils/socket";

import MultiZoneScreen from "../components/MultiZoneScreen";
import MediaPlayer from "../components/MediaPlayer";

export default function LiveScreenPlayer() {
  const { screenId } = useParams();

  const [screen, setScreen] = useState(null);
  const [emergency, setEmergency] = useState(null);

  /* ---------------- LOAD SCREEN ---------------- */

  useEffect(() => {
    api.get(`/screens/${screenId}`).then(res => {
      setScreen(res.data);
    });
  }, [screenId]);

  /* ---------------- SOCKET ---------------- */

  useEffect(() => {
    socket.emit("register-screen", screenId);

    socket.on("screen-updated", () => {
      api.get(`/screens/${screenId}`).then(res => {
        setScreen(res.data);
      });
    });

    socket.on("emergency-on", data => setEmergency(data));
    socket.on("emergency-off", () => setEmergency(null));

    return () => {
      socket.off("screen-updated");
      socket.off("emergency-on");
      socket.off("emergency-off");
    };
  }, [screenId]);

  if (!screen) return null;

  /* ---------------- RENDER ---------------- */

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      {emergency ? (
        <MediaPlayer media={emergency.mediaId} />
      ) : (
        <MultiZoneScreen
          zones={screen.zones || []}
          screenId={screenId}
        />
      )}
    </div>
  );
}
