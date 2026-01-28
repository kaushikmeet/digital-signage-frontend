import { useState } from "react";
import api from "../../api/services";

function UploadMedia({ onCreated }) {
  const [file, setFile] = useState(null);

  async function upload() {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await api.post("/media/upload", form);
    onCreated(res.data); // ✅ only update media library
    setFile(null);
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={upload}>Upload</button>
    </div>
  );
}

export default UploadMedia;