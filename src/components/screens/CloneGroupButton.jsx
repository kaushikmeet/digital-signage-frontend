import api from "../../api/services";

export default function CloneGroupButton({ group, onCloned }) {
  async function clone() {
    await api.post("/screen-groups", {
      name: `${group.name} (Copy)`,
      layout: group.layout
    });

    onCloned();
  }

  return (
    <button
      onClick={clone}
      className="px-2 py-1 text-xs bg-indigo-700 rounded"
    >
      📋 Clone
    </button>
  );
}
