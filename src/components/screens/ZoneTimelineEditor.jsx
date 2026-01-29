import useZoneTimeline from "../../hooks/useZoneTimeline";

export default function ZoneTimelineEditor({
  zone,
  playlists = [],
  updateZone
}) {
  const {
    timeline,
    error,
    addSlot,
    updateSlot,
    removeSlot
  } = useZoneTimeline(zone, updateZone);

  return (
    <div className="mt-2 p-2 bg-gray-900 text-white rounded text-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">🕒 Timeline</span>
        <button
          onClick={addSlot}
          className="px-2 py-1 bg-indigo-600 rounded"
        >
          + Add
        </button>
      </div>

      {timeline.map(slot => (
        <div
          key={slot.id}
          className="grid grid-cols-4 gap-1 items-center mb-1"
        >
          <input
            type="time"
            value={slot.start}
            onChange={e =>
              updateSlot(slot.id, { start: e.target.value })
            }
            className="bg-black border border-gray-600 rounded px-1"
          />

          <input
            type="time"
            value={slot.end}
            onChange={e =>
              updateSlot(slot.id, { end: e.target.value })
            }
            className="bg-black border border-gray-600 rounded px-1"
          />

          <select
            value={slot.playlistId || ""}
            onChange={e =>
              updateSlot(slot.id, {
                playlistId: e.target.value
              })
            }
            className="bg-black border border-gray-600 rounded px-1"
          >
            <option value="">Select playlist</option>
            {playlists.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => removeSlot(slot.id)}
            className="text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      ))}

      {error && (
        <div className="mt-2 text-red-400 font-semibold">
          {error}
        </div>
      )}
    </div>
  );
}
