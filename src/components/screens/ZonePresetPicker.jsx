import { ZONE_PRESETS } from "../../config/zonePresets";

export default function ZonePresetSelector({ onApply }) {
  return (
    <div className="flex gap-2 mb-3">
      {ZONE_PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onApply(preset)}
          className="px-3 py-1 text-xs bg-gray-800 text-white rounded hover:bg-indigo-600"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
}
