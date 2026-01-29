export default function ZonePresetCard({ preset, onSelect }) {
  const Icon = preset.icon;

  return (
    <button
      onClick={() => onSelect(preset)}
      className="bg-gray-800 flex gap-5 items-center flex-col hover:bg-indigo-600 transition rounded-lg p-2 w-32"
    >
      <Icon size={36} className="text-white"/>
      <div className="text-xs text-center">{preset.name}</div>
    </button>
  );
}
