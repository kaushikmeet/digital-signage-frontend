import { useState } from "react";
import api from "../../api/services";

function HtmlMediaEditor({ onCreated }) {
  const [html, setHtml] = useState("");

  async function save() {
    const res = await api.post("/media/createMedia", {
      title: "HTML Media",
      type: "html",
      content: html,
      duration: 15
    });

    onCreated(res.data); // ✅
    setHtml("");
  }

  return (
    <div>
      <textarea
        placeholder="<h1>Sale {{time}}</h1>"
        value={html}
        onChange={(e) => setHtml(e.target.value)}
      />
      <button onClick={save}>Create HTML</button>
    </div>
  );
}

export default HtmlMediaEditor;