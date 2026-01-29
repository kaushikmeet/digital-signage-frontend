import { useEffect, useState } from "react";

function WeatherWidget({ config = {} }) {
  const { city = "Delhi" } = config;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchWeather();
    const i = setInterval(fetchWeather, 10 * 60 * 1000); // every 10 min
    return () => clearInterval(i);
  }, [city]);

  async function fetchWeather() {
    try {
      // 🔴 Replace with your backend proxy
      const res = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`
      );
      const data = await res.json();
      setWeather(data);
    } catch {
      setWeather(null);
    }
  }

  if (!weather)
    return (
      <div className="text-xs text-gray-400">
        Loading weather…
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <div className="text-lg font-semibold">{city}</div>
      <div className="text-3xl">{Math.round(weather.temp)}°C</div>
      <div className="text-sm text-gray-300">
        {weather.condition}
      </div>
    </div>
  );
}

export default WeatherWidget;