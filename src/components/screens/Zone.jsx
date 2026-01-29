import { Rnd } from "react-rnd";

function Zone({ zone, containerRef, onChange, media = [], updateZone }) {
  if (!containerRef?.current) return null;

  const { offsetWidth, offsetHeight } = containerRef.current;
  const GRID = 20;
  const snap = value => Math.round(value / GRID) * GRID;

  return (
    <Rnd
      disableDragging={zone.locked}
      enableResizing={!zone.locked}
      size={{
        width: zone.w * offsetWidth,
        height: zone.h * offsetHeight
      }}
      position={{
        x: zone.x * offsetWidth,
        y: zone.y * offsetHeight
      }}
      bounds="parent"
      onDragStop={(e, d) =>
        onChange({
          ...zone,
          x: snap(d.x) / offsetWidth,
          y: snap(d.y) / offsetHeight
        })
      }
      onResizeStop={(e, dir, ref, delta, pos) =>
        onChange({
          ...zone,
          w: snap(ref.offsetWidth) / offsetWidth,
          h: snap(ref.offsetHeight) / offsetHeight,
          x: snap(pos.x) / offsetWidth,
          y: snap(pos.y) / offsetHeight
        })
      }
      style={{ zIndex: zone.zIndex }}
      className="border-2 border-indigo-500 bg-indigo-100/30"
    >
      <div className="text-xs p-1 font-semibold">{zone.name}</div>

      <label className="flex items-center gap-1 text-xs mt-1">
        <input
          type="checkbox"
          checked={zone.locked}
          onChange={e =>
            updateZone(zone._id || zone.tempId, {
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
        onChange={e =>
          updateZone(zone._id || zone.tempId, {
            fallbackMediaId: e.target.value || null
          })
        }
      >
        <option value="">No fallback</option>
        {(media || []).map(m => (
          <option key={m._id} value={m._id}>
            {m.filename || m.title}
          </option>
        ))}
      </select>
    </Rnd>
  );
}

export default Zone;
