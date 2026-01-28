import { Rnd } from "react-rnd";

function Zone({ zone, containerRef, onChange }) {
  if (!containerRef?.current) return null;

  const { offsetWidth, offsetHeight } = containerRef.current;

  return (
    <Rnd
      size={{
        width: zone.w * offsetWidth,
        height: zone.h * offsetHeight
      }}
      position={{
        x: zone.x * offsetWidth,
        y: zone.y * offsetHeight
      }}
      bounds="parent"
      onDragStop={(e, d) => {
        onChange({
          ...zone,
          x: d.x / offsetWidth,
          y: d.y / offsetHeight
        });
      }}
      onResizeStop={(e, dir, ref, delta, pos) => {
        onChange({
          ...zone,
          w: ref.offsetWidth / offsetWidth,
          h: ref.offsetHeight / offsetHeight,
          x: pos.x / offsetWidth,
          y: pos.y / offsetHeight
        });
      }}
      style={{ zIndex: zone.zIndex }}
      className="border-2 border-indigo-500 bg-indigo-100/30"
    >
      <div className="text-xs p-1 font-semibold">
        {zone.name}
      </div>
    </Rnd>
  );
}

export default Zone;
