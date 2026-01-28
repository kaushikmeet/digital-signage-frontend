import Zone from "./Zone";

function ZoneEditor({ zones, setZones, containerRef }) {
  if (!containerRef?.current) return null;

  return (
    <>
      {zones.map((zone) => (
        <Zone
          key={zone._id}
          zone={zone}
          containerRef={containerRef}
          onChange={(updated) => {
            setZones((prev) =>
              prev.map((z) =>
                z._id === updated._id ? updated : z
              )
            );
          }}
        />
      ))}
    </>
  );
}

export default ZoneEditor;
