import ZonePlayer from './ZonePlayer';

export default function MultiZoneScreen({ screen }) {
  return (
    <div className="relative w-full h-screen bg-black">
      {screen.zones.map(zone => (
        <div
          key={zone.zoneId}
          className="absolute overflow-hidden border border-gray-800"
          style={{
            left: `${zone.position.x}%`,
            top: `${zone.position.y}%`,
            width: `${zone.position.width}%`,
            height: `${zone.position.height}%`
          }}
        >
          <ZonePlayer playlistId={zone.playlistId} />
        </div>
      ))}
    </div>
  );
}
