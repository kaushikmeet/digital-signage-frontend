import { useEffect, useState } from "react";
import api from "../../api/services";
import ApplyGroupLayoutButton from "./ApplyGroupLayoutButton";
import CloneGroupButton from "./CloneGroupButton";

export default function ScreenGroupManager({
  screenId,
  onApplyLayout,
  mode
}) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const isLive = mode === "live"; // ✅ FIX

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    try {
      const res = await api.get("/screen-groups");
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load groups", err);
      setGroups([]);
    }
  }

  const selectedGroup = groups.find(g => g._id === selectedGroupId);

  return (
    <div className="bg-gray-800 p-3 rounded-xl text-sm">
      <div className="font-semibold mb-2">🖥 Screen Groups</div>

      <select
        value={selectedGroupId}
        onChange={e => setSelectedGroupId(e.target.value)}
        className="w-full bg-black border border-gray-700 rounded p-1 mb-2"
      >
        <option value="">Select group</option>
        {groups.map(g => (
          <option key={g._id} value={g._id}>
            {g.name}
          </option>
        ))}
      </select>

      {/* ✅ Apply layout */}
      {selectedGroup && (
        <ApplyGroupLayoutButton
          screenId={screenId}
          layout={selectedGroup.layout || []}
          onApply={onApplyLayout}
          disabled={isLive} 
        />
      )}

      {/* ✅ Clone only if group exists */}
      {selectedGroup && (
        <CloneGroupButton
          group={selectedGroup}
          onCloned={loadGroups}
        />
      )}
    </div>
  );
}
