import { useEffect } from "react";
import socket from "../utils/socket";

export default function useScreenGroupSync({
  groupId,
  setZones
}) {
  useEffect(() => {
    if (!groupId) return;

    socket.emit("register-group", groupId);

    const handler = ({ zones }) => {
      setZones(zones);
    };

    socket.on("group-layout-updated", handler);

    return () => {
      socket.off("group-layout-updated", handler);
    };
  }, [groupId, setZones]);
}
