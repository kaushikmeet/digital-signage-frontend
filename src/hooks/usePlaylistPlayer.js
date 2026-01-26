import { useEffect, useState, useRef } from "react";

export default function usePlaylistPlayer(items = []) {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef(null);

  /* RESET WHEN PLAYLIST CHANGES */
  useEffect(() => {
    if (!items.length) return;

    setIndex(0);
    setRemaining(items[0]?.duration || 0);
    setPaused(false);
  }, [items]);

  /* PLAYBACK TIMER */
  useEffect(() => {
    if (paused || !items.length) return;

    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setIndex(i => {
            const next = (i + 1) % items.length;
            setRemaining(items[next]?.duration || 0);
            return next;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [paused, items]);

  /* MANUAL SKIP */
  const skip = () => {
    if (!items.length) return;

    setIndex(i => {
      const next = (i + 1) % items.length;
      setRemaining(items[next]?.duration || 0);
      return next;
    });
  };

  return {
    current: items[index] || null,
    index,
    remaining,
    paused,
    skip,
    setPaused
  };
}
