import { useEffect, useState } from "react";

function TimeWidget({ config = {} }) {
  const { timezone = "local", format = "HH:mm:ss" } = config;
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(i);
  }, []);

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: timezone === "local" ? undefined : timezone
  }).format(now);

  return (
    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
      {time}
    </div>
  );
};
export default TimeWidget;