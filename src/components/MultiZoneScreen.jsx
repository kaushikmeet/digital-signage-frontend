import ZonePlayer from "./ZonePlayer";

export default function MultiZoneScreen({ zones = [], screenId }) {
  if (!zones.length) return null;

  return (
    <div className="relative w-full h-full bg-black">
      {zones.map(zone => {
        const key = zone._id || zone.tempId

        if (!key) return null; // safety guard

        return (
          <div
            key={key}
            className="absolute overflow-hidden"
            style={{
              left: `${zone.x * 100}%`,
              top: `${zone.y * 100}%`,
              width: `${zone.w * 100}%`,
              height: `${zone.h * 100}%`,
              zIndex: zone.zIndex || 1
            }}
          >
            <ZonePlayer
              screenId={screenId}
              zone={zone}
              activeTimelinePlaylistId={null}
            />
          </div>
        );
      })}
    </div>
  );
}
