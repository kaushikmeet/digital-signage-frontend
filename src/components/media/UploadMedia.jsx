import { useState } from "react";
import api from "../../api/services";
import { UploadCloud, X, Image, Video } from "lucide-react";

export default function UploadMedia({ onCreated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return alert("Please select a file");

    try {
      setLoading(true);

      const form = new FormData();
      form.append("file", file);

      const res = await api.post("/media/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      onCreated?.(res.data);
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function clearFile() {
    setFile(null);
  }

  const isImage = file?.type?.startsWith("image");
  const isVideo = file?.type?.startsWith("video");

  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      {/* HEADER */}
      <div className="flex items-center gap-2 font-semibold">
        <UploadCloud size={16} />
        Upload Media
      </div>

      {/* DROP ZONE */}
      <label className="flex flex-col items-center justify-center
        border-2 border-dashed border-gray-700 rounded-xl
        p-6 cursor-pointer hover:border-indigo-500 transition">

        <input
          type="file"
          accept="image/*,video/*"
          onChange={e => setFile(e.target.files[0])}
          className="hidden"
        />

        {!file ? (
          <>
            <UploadCloud className="text-gray-400 mb-2" />
            <div className="text-sm text-gray-400">
              Click to upload image or video
            </div>
            <div className="text-xs text-gray-600">
              PNG, JPG, MP4, WEBM
            </div>
          </>
        ) : (
          <div className="w-full space-y-2">
            {/* PREVIEW */}
            <div className="relative rounded-lg overflow-hidden bg-black">
              {isImage && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="max-h-40 mx-auto"
                />
              )}

              {isVideo && (
                <video
                  src={URL.createObjectURL(file)}
                  className="max-h-40 mx-auto"
                  controls
                />
              )}

              <button
                onClick={clearFile}
                className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>

            {/* FILE INFO */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                {isImage && <Image size={12} />}
                {isVideo && <Video size={12} />}
                {file.name}
              </span>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
        )}
      </label>

      {/* ACTION */}
      <button
        disabled={loading || !file}
        onClick={upload}
        className={`w-full flex items-center justify-center gap-2
          px-3 py-2 rounded font-semibold
          ${
            loading || !file
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }
        `}
      >
        <UploadCloud size={16} />
        {loading ? "Uploading..." : "Upload Media"}
      </button>
    </div>
  );
}
