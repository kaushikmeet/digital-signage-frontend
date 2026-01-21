import api from "../api/axios";

export default function MediaUploader({ onUploaded }) {
  async function upload(file) {
    const formData = new FormData();
    formData.append("file", file);

    await api.post("/media/upload", formData);
    onUploaded && onUploaded();
  }

  return (
    <input
      type="file"
      accept="image/*,video/*"
      onChange={e => upload(e.target.files[0])}
      className="border p-2 rounded"
    />
  );
}
