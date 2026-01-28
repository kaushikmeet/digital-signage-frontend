import ZonePlayer from './ZonePlayer';

export default function MultiZoneScreen({ zones, screenId }) {
  return (
    <div className="relative w-full h-screen bg-black">
      {zones.map(zone => (
        <div
          key={zone.id}
          className="absolute overflow-hidden"
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`
          }}
        >
          <ZonePlayer
            screenId={screenId}
            zoneId={zone.zoneId}
            items={zone.items}
          />
        </div>
      ))}
    </div>
  );
}
