import { useState } from "react";
import api from "../../api/services";

function TextMediaForm({ onCreated }) {
  const [text, setText] = useState("");

  async function save() {
    const res = await api.post("/media/createMedia", {
      title: "Text Media",
      type: "text",
      content: text,
      duration: 10,
      meta: {
        fontSize: 48,
        color: "#fff",
        bgColor: "#000"
      }
    });

    onCreated(res.data); // ✅
    setText("");
  }

  return (
    <div>
      <input
        placeholder="Your text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={save}>Create Text</button>
    </div>
  );
}

export default TextMediaForm;