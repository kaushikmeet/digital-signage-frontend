import { useState } from "react";
import api from "../api/services";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function PlaylistItemSchedule({ item }) {
  const [days, setDays] = useState(item.days || []);
  const [startTime, setStartTime] = useState(
    item.startTime ? item.startTime.slice(0, 16) : ""
  );
  const [endTime, setEndTime] = useState(
    item.endTime ? item.endTime.slice(0, 16) : ""
  );

  function toggleDay(day) {
    setDays(d =>
      d.includes(day) ? d.filter(x => x !== day) : [...d, day]
    );
  }

  async function save() {
    const toMinutes = (time) => {
      if (!time) return null;
      const [h, m] = time.split(":");
      return Number(h) * 60 + Number(m);
    };

    await api.put(`/playlists/${item._id}/schedule`, {
      days,
      startTime: toMinutes(startTime),
      endTime: toMinutes(endTime)
    });
    alert("Schedule saved");
  }

  return (
    <div className="p-4 rounded-lg space-y-3">
      {/* Days */}
      <div className="flex gap-2 flex-wrap">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`px-3 py-1 rounded text-xs cursor-pointer
              ${days.includes(day) ? "bg-indigo-600 text-white" : "bg-gray-700 text-white"}`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Time */}
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          className="border-1 p-2 rounded text-sm"
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          className="border-1 p-2 rounded text-sm"
        />
      </div>

      <button
        onClick={save}
        className="bg-green-600 px-4 py-1 rounded text-sm cursor-pointer text-white hover:bg-green-700 transition"
      >
        Save Schedule
      </button>
    </div>
  );
}
