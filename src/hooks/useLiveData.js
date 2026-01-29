import { useEffect, useState } from "react";

/**
 * Handles live data fetching with auto refresh
 * Supports: time, weather, custom API
 */
export default function useLiveData(source) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!source?.type) return;

    let interval;

    async function load() {
      try {
        setError(null);

        switch (source.type) {
          case "time": {
            setData(new Date());
            break;
          }

          case "weather": {
            const res = await fetch(
              `/api/weather?city=${encodeURIComponent(
                source.city || "Delhi"
              )}`
            );
            const json = await res.json();
            setData(json);
            break;
          }

          case "api": {
            const res = await fetch(source.url);
            const json = await res.json();
            setData(json);
            break;
          }

          default:
            setError("Unknown live source");
        }
      } catch {
        setError("Live data error");
      }
    }

    load();

    interval = setInterval(
      load,
      source.refreshInterval || 10000
    );

    return () => clearInterval(interval);
  }, [JSON.stringify(source)]);

  return { data, error };
}
