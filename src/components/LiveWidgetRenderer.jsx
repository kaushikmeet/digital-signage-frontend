import TimeWidget from "./widgets/ClockWidget";
import WeatherWidget from "./widgets/WeatherWidget";

export default function LiveWidgetRenderer({ widget }) {
  if (!widget?.type) return null;

  switch (widget.type) {
    case "time":
      return <TimeWidget config={widget.config} />;

    case "weather":
      return <WeatherWidget config={widget.config} />;

    default:
      return (
        <div className="text-xs text-red-400">
          Unknown widget
        </div>
      );
  }
}


