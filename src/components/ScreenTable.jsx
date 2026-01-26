import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Search } from "lucide-react";
import api from "../api/services"; // ✅ FIX

export default function ScreensTable({ screens = [] }) {
  const navigate = useNavigate();

  /* STATE */
  const [selected, setSelected] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  /* FILTER */
  const filtered = useMemo(() => {
    return screens.filter(screen =>
      screen.name.toLowerCase().includes(search.toLowerCase()) ||
      (screen.location || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [screens, search]);

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* SELECTION */
  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  function toggleAll() {
    const ids = paginated.map(s => s._id);
    const allSelected = ids.every(id => selected.includes(id));

    setSelected(allSelected
      ? selected.filter(id => !ids.includes(id))
      : [...new Set([...selected, ...ids])]
    );
  }

  /* DELETE */
  async function deleteSingle(id) {
    if (!window.confirm("Delete this screen?")) return;
    await api.delete(`/screens/${id}`);
  }

  async function deleteBulk() {
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} screens?`)) return;

    await api.post("/screens/bulk-delete", { ids: selected });
    setSelected([]);
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Screens</h2>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search screen..."
            className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* BULK ACTION */}
      {selected.length > 0 && (
        <div className="mb-3 text-sm flex gap-3">
          <span>{selected.length} selected</span>
          <button
            onClick={deleteBulk}
            className="text-red-600 hover:underline"
          >
            Delete selected
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">
                <input
                  type="checkbox"
                  checked={
                    paginated.length > 0 &&
                    paginated.every(s => selected.includes(s._id))
                  }
                  onChange={toggleAll}
                />
              </th>
              <th className="py-2 px-1">Name</th>
              <th className="py-2 px-1">Status</th>
              <th className="py-2 px-1">Location</th>
              <th className="text-right py-2 px-1">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(screen => {
              const isOnline = screen.status === "online";

              return (
                <tr
                  key={screen._id}
                  draggable
                  onDragStart={() => setDraggedId(screen._id)}
                  className="border-b hover:bg-gray-50 py-2 px-1"
                >
                  <td className="py-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(screen._id)}
                      onChange={() => toggleSelect(screen._id)}
                    />
                  </td>

                  <td className="font-medium py-2 px-1">{screen.name}</td>

                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs
                      ${isOnline
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"}
                    `}>
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </td>

                  <td className="text-gray-500 py-2 px-1">
                    {screen.location || "—"}
                  </td>

                  <td className="text-right flex justify-end gap-3 py-2 px-1">
                    <button
                      onClick={() => navigate(`/preview/${screen._id}`)}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <PlayCircle size={16} />
                      Preview
                    </button>

                    <button
                      onClick={() => deleteSingle(screen._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {!paginated.length && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No screens found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
