import { useState } from "react";
import api from "../../api/services";
import { Type, Save } from "lucide-react";

export default function TextMediaForm({ onCreated }) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!text.trim()) return alert("Text cannot be empty");

    try {
      setLoading(true);

      const res = await api.post("/media/createMedia", {
        title: "Text Media",
        type: "text",
        content: text,
        duration: 10,
        meta: {
          fontSize,
          color,
          bgColor
        }
      });

      onCreated?.(res.data);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to create text media");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      {/* HEADER */}
      <div className="flex items-center gap-2 font-semibold">
        <Type size={16} />
        Text Media Editor
      </div>

      {/* TEXT INPUT */}
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter your text..."
        className="w-full bg-white border border-gray-700 rounded px-3 py-2
                   text-gray text-sm focus:outline-none focus:border-indigo-500"
      />

      {/* CONTROLS */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block mb-1 text-gray-400">Font Size</label>
          <input
            type="number"
            min={12}
            max={120}
            value={fontSize}
            onChange={e => setFontSize(+e.target.value)}
            className="w-full bg-white border border-gray-700 rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-400">Text Color</label>
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="w-full h-8 border border-gray-700 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-400">Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="w-full h-8 bg-white border border-gray-700 rounded"
          />
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="border border-gray-700 rounded p-3 bg-black">
        <div className="text-xs text-gray-400 mb-1">Live Preview</div>
        <div
          className="flex items-center justify-center text-center"
          style={{
            fontSize,
            color,
            backgroundColor: bgColor,
            minHeight: 80
          }}
        >
          {text || "Your text will appear here"}
        </div>
      </div>

      {/* SAVE */}
      <button
        disabled={loading}
        onClick={save}
        className={`w-full flex items-center justify-center gap-2
          px-3 py-2 rounded font-semibold
          ${loading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500"}
        `}
      >
        <Save size={16} />
        {loading ? "Creating..." : "Create Text Media"}
      </button>
    </div>
  );
}
