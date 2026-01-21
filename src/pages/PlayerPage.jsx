import { useParams } from "react-router-dom";
import Player from "../components/Player";

export default function PlayerPage() {
  const { screenId } = useParams();
  return <Player screenId={screenId} />;
}
