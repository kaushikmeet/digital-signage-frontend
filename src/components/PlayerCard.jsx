import { PlayCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlayerCard({ screen }) {
  const navigate = useNavigate();
  const isOnline = screen.status === "online";

  return (
    <div
      onClick={() => navigate(`/preview/${screen._id}`)}
      className="group relative flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      {/* Icon */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-md transition
          ${
            isOnline
              ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
      >
        <PlayCircle size={28} strokeWidth={2} />
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">
            {screen.name}
          </h3>

          {/* Status */}
          <span
            className={`h-2 w-2 rounded-full ${
              isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          <span className="text-xs text-gray-500">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={12} />
          <span>{screen.location || "No location assigned"}</span>
        </div>
      </div>

      {/* Action */}
      <div className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition">
        Preview →
      </div>
    </div>
  );
}
