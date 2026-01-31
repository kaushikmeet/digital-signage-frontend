import { useState } from "react";
import api from "../../api/services";
import { v4 as uuid } from "uuid";

export default function GroupLayoutEditor() {
  const [name, setName] = useState("");
  const [zones, setZones] = useState([]);

  function addZone() {
    setZones(z => [
      ...z,
      {
        _id: uuid(), 
        name: "Zone",
        x: 0,
        y: 0,
        w: 0.5,
        h: 0.5,
        zIndex: z.length + 1,
        locked: false,
        playlistId: null,
        fallbackMediaId: null,
        timeline: []
      }
    ]);
  }

  function updateZone(id, changes) {
    setZones(z =>
      z.map(zone =>
        zone._id === id ? { ...zone, ...changes } : zone
      )
    );
  }

  async function saveLayout() {
    if (!name.trim()) {
      alert("Group name required");
      return;
    }
    if (!zones.length) {
      alert("Add at least one zone");
      return;
    }

    await api.post("/screen-groups", {
      name,
      layout: zones
    });

    setName("");
    setZones([]);
    alert("✅ Group layout saved");
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl text-white">
      <div className="font-semibold mb-2">
        🧱 Group Layout Editor
      </div>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Group name"
        className="w-full bg-black border border-gray-700 rounded p-1 mb-3"
      />

      {/* 🔲 ZONE LIST */}
      {zones.map(z => (
        <div
          key={z._id}
          className="grid grid-cols-7 gap-1 text-xs mb-1"
        >
          <input
            value={z.name}
            onChange={e =>
              updateZone(z._id, { name: e.target.value })
            }
            className="bg-black border border-gray-700 rounded px-1"
          />

          <input
            type="number"
            step="0.01"
            value={z.x}
            onChange={e =>
              updateZone(z._id, { x: +e.target.value })
            }
          />
          <input
            type="number"
            step="0.01"
            value={z.y}
            onChange={e =>
              updateZone(z._id, { y: +e.target.value })
            }
          />
          <input
            type="number"
            step="0.01"
            value={z.w}
            onChange={e =>
              updateZone(z._id, { w: +e.target.value })
            }
          />
          <input
            type="number"
            step="0.01"
            value={z.h}
            onChange={e =>
              updateZone(z._id, { h: +e.target.value })
            }
          />

          <input
            type="number"
            value={z.zIndex}
            onChange={e =>
              updateZone(z._id, { zIndex: +e.target.value })
            }
            className="w-12"
          />

          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={z.locked}
              onChange={e =>
                updateZone(z._id, { locked: e.target.checked })
              }
            />
            🔒
          </label>
        </div>
      ))}

      {/* 🔘 ACTIONS */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={addZone}
          className="px-3 py-1 bg-indigo-600 rounded"
        >
          + Zone
        </button>

        <button
          onClick={saveLayout}
          className="px-3 py-1 bg-green-600 rounded"
        >
          💾 Save Group
        </button>
      </div>

      {/* 👁 MINI PREVIEW */}
      {!!zones.length && (
        <div className="mt-4 relative aspect-video bg-black border border-gray-700 rounded">
          {zones.map(z => (
            <div
              key={z._id}
              className="absolute border border-indigo-400 text-[9px] flex items-center justify-center"
              style={{
                left: `${z.x * 100}%`,
                top: `${z.y * 100}%`,
                width: `${z.w * 100}%`,
                height: `${z.h * 100}%`,
                zIndex: z.zIndex
              }}
            >
              {z.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
