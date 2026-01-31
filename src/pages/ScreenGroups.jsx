import { useEffect, useState } from "react";
import api from "../api/services";
import GroupLayoutEditor from "../components/screens/GroupLayoutEditor";
import GroupAnalyticsDashboard from "../components/screens/GroupAnalyticsDashboard";

export default function ScreenGroups() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    const res = await api.get("/screen-groups");
    setGroups(res.data || []);
  }

  async function loadAnalytics(groupId) {
    const res = await api.get(`/analytics/group/${groupId}`);
    setAnalytics(res.data);
  }

  function handleSelectGroup(group) {
    setSelectedGroup(group);
    loadAnalytics(group._id);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-xl font-semibold mb-4">🖥 Screen Groups</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LEFT: GROUP LIST */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="font-semibold mb-2">Saved Groups</div>

          {groups.map(g => (
            <button
              key={g._id}
              onClick={() => handleSelectGroup(g)}
              className={`w-full text-left px-3 py-2 rounded mb-1 ${
                selectedGroup?._id === g._id
                  ? "bg-indigo-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* CENTER: GROUP DETAILS */}
        <div className="bg-gray-800 p-4 rounded-xl">
          {selectedGroup ? (
            <>
              <div className="font-semibold mb-2">
                📐 Layout: {selectedGroup.name}
              </div>

              <div className="text-xs text-gray-400 mb-2">
                Zones: {selectedGroup.layout.length}
              </div>

              <pre className="text-xs bg-black p-2 rounded overflow-auto">
                {JSON.stringify(selectedGroup.layout, null, 2)}
              </pre>
            </>
          ) : (
            <div className="text-gray-400">
              Select a group to preview
            </div>
          )}
        </div>

        {/* RIGHT: ANALYTICS */}
        <div>
          <GroupAnalyticsDashboard stats={analytics} />
        </div>
      </div>

      {/* CREATE NEW GROUP */}
      <div className="mt-6">
        <GroupLayoutEditor />
      </div>
    </div>
  );
}
