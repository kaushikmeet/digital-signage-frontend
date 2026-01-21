import { PlayCircle } from "lucide-react";

export default function PlayerCard({ screen }) {
  return (
    <div className="border rounded-lg p-4 flex items-center gap-3 hover:shadow">
      <PlayCircle className="text-indigo-600" />
      <div>
        <div className="font-semibold">{screen.name}</div>
        <div className="text-xs text-gray-500">
          {screen.location || "No location"}
        </div>
      </div>
    </div>
  );
}
