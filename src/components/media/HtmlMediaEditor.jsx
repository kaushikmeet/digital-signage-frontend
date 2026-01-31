import { useState } from "react";
import api from "../../api/services";
import { Code, Eye, Save } from "lucide-react";

export default function HtmlMediaEditor({ onCreated }) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(true);
  

  async function save() {
    if (!html.trim()) return alert("HTML cannot be empty");

    try {
      setLoading(true);

      const res = await api.post("/media/createMedia", {
        title: "HTML Media",
        type: "html",
        content: html,
        duration: 15
      });

      onCreated?.(res.data);
      setHtml("");
    } catch (err) {
      console.error(err);
      alert("Failed to create HTML media");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-3">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="font-semibold flex items-center gap-2">
          <Code size={16} /> HTML Media Editor
        </div>

        <button
          onClick={() => setPreview(p => !p)}
          className="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 flex items-center gap-1"
        >
          <Eye size={14} />
          {preview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {/* EDITOR */}
      <textarea
        value={html}
        onChange={e => setHtml(e.target.value)}
        placeholder={`<h1>🔥 Big Sale</h1>\n<p>{{time}}</p>`}
        className="w-full h-32 bg-black text-green-400 font-mono text-xs
                   border border-gray-700 rounded p-2 resize-none"
      />

      {/* PREVIEW */}
      {preview && (
        <div className="border border-gray-700 rounded bg-black p-3 text-white">
          <div className="text-xs text-gray-400 mb-1">Live Preview</div>
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html || "<em>Nothing to preview</em>" }}
          />
        </div>
      )}

      {/* ACTION */}
      <button
        disabled={loading}
        onClick={save}
        className={`w-full flex items-center justify-center gap-2
          px-3 py-2 rounded font-semibold
          ${loading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500"
          }`}
      >
        <Save size={16} />
        {loading ? "Creating..." : "Create HTML Media"}
      </button>

      {/* HINTS */}
      {/* <div className="text-xs text-gray-400">
        💡 You can use dynamic variables like <code>{{time}}</code>, <code>{{weather}}</code>
      </div> */}
    </div>
  );
}
