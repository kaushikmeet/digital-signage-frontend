import { useParams } from "react-router-dom";
import Player from "../components/Player";

export default function PlayerPage() {
  
  useEffect(() => {
  socket.on("player-control", action => {
    if (action === "pause") videoRef.current?.pause();
    if (action === "play") videoRef.current?.play();
    if (action === "skip") nextItem();
  });

  return () => socket.off("player-control");
}, []);

  const { screenId } = useParams();
  return <Player screenId={screenId} />;
}
