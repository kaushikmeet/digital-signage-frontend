export default function GroupPlaylistSelector({
  playlists,
  value,
  onChange
}) {
  return (
    <select
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      className="bg-black border border-gray-700 rounded p-1 text-xs"
    >
      <option value="">No group playlist</option>
      {playlists.map(p => (
        <option key={p._id} value={p._id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
