import { Rnd } from "react-rnd";

const GRID = 20;
const snap = value => Math.round(value / GRID) * GRID;
const clamp01 = v => Math.max(0, Math.min(1, v));

function Zone({
  zone,
  containerRef,
  onChange,
  media = [],
  updateZone,
  mode
}) {
  if (!containerRef?.current) return null;

  const { offsetWidth, offsetHeight } = containerRef.current;
  const isLive = mode === "live";

  function handleMove(pos) {
    onChange({
      ...zone,
      x: clamp01(snap(pos.x) / offsetWidth),
      y: clamp01(snap(pos.y) / offsetHeight)
    });
  }

  function handleResize(ref, pos) {
    onChange({
      ...zone,
      w: clamp01(snap(ref.offsetWidth) / offsetWidth),
      h: clamp01(snap(ref.offsetHeight) / offsetHeight),
      x: clamp01(snap(pos.x) / offsetWidth),
      y: clamp01(snap(pos.y) / offsetHeight)
    });
  }

  return (
    <Rnd
      disableDragging={isLive || zone.locked}
      enableResizing={!isLive && !zone.locked}
      size={{
        width: zone.w * offsetWidth,
        height: zone.h * offsetHeight
      }}
      position={{
        x: zone.x * offsetWidth,
        y: zone.y * offsetHeight
      }}
      bounds="parent"
      onDragStop={(e, d) => handleMove(d)}
      onResizeStop={(e, dir, ref, delta, pos) =>
        handleResize(ref, pos)
      }
      style={{ zIndex: zone.zIndex }}
      className="border-2 border-indigo-500 bg-indigo-100/30"
    >
      {/* Zone title */}
      <div className="text-xs p-1 font-semibold">
        {zone.name}
      </div>

      {/* Lock toggle */}
      <label className="flex items-center gap-1 text-xs mt-1">
        <input
          type="checkbox"
          checked={!!zone.locked}
          disabled={isLive}
          onChange={e =>
            updateZone(zone.id, {
              locked: e.target.checked
            })
          }
        />
        🔒 Lock
      </label>

      {/* Fallback selector */}
      <select
        className="w-full text-xs bg-black text-white mt-1"
        value={zone.fallbackMediaId || ""}
        disabled={isLive}
        onChange={e =>
          updateZone(zone.id, {
            fallbackMediaId: e.target.value || null
          })
        }
      >
        <option value="">No fallback</option>
        {media.map(m => (
          <option key={m._id} value={m._id}>
            {m.filename || m.title}
          </option>
        ))}
      </select>
    </Rnd>
  );
}

export default Zone;
