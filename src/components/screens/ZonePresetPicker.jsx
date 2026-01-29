import { ZONE_PRESETS } from "../../config/zonePresets";
import ZonePresetCard from "./ZonePresetCard";

export default function ZonePresetSelector({ onApply }) {
  return (
    <div className="flex gap-2 mb-3">
      {ZONE_PRESETS.map((preset) => (
        <ZonePresetCard
         key={preset.id}
         preset={preset}
         onSelect={onApply}
        />
      ))}
    </div>
  );
}
