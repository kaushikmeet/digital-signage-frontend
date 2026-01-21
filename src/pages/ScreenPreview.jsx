import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ScreenPreview() {
  const { screenId } = useParams();
  const [mode, setMode] = useState("horizontal");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Screen Preview — {screenId}
        </h2>

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setMode("horizontal")}
            className={`px-4 py-2 text-sm ${
              mode === "horizontal"
                ? "bg-indigo-600"
                : "hover:bg-gray-700"
            }`}
          >
            Horizontal
          </button>
          <button
            onClick={() => setMode("vertical")}
            className={`px-4 py-2 text-sm ${
              mode === "vertical"
                ? "bg-indigo-600"
                : "hover:bg-gray-700"
            }`}
          >
            Vertical
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex justify-center mt-6">
        <div
          className={`bg-black rounded-xl shadow-lg overflow-hidden ${
            mode === "horizontal"
              ? "w-[900px] h-[500px]"
              : "w-[400px] h-[700px]"
          }`}
        >
          {/* IMAGE / VIDEO PREVIEW */}
          {/* Example image */}
          <img
            src="https://placehold.co/900x500"
            alt="preview"
            className="w-full h-full object-cover"
          />

          {/* Example video */}
          {/*
          <video
            src="/sample.mp4"
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          />
          */}
        </div>
      </div>
    </div>
  );
}
