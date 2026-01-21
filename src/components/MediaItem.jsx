export default function MediaItem({ item }) {
  const media = item?.mediaId;

  if (!media) {
    return (
      <div className="text-xs text-red-400">
        Media missing
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {media.type === "image" ? (
        <img
          src={media.url}
          alt={media.filename}
          className="w-10 h-7 object-cover rounded"
        />
      ) : (
        <video
          src={media.url}
          className="w-10 h-7 rounded"
          muted
        />
      )}

      <div className="flex-1 truncate">
        <p className="truncate">{media.filename}</p>
        <p className="text-slate-400">{item.duration}s</p>
      </div>
    </div>
  );
}
