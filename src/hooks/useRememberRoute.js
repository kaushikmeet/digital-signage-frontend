import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function useRememberRoute() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/login") {
      localStorage.setItem("lastPath", location.pathname);
    }
  }, [location]);
}
